const bcrypt = require('bcrypt');

const dbClientInstance = require('../db.js');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/errors.js');
const { generateToken, createUserJwt, validateToken } = require('../utils/tokens.js');  

class User {

	// -----------------
	// Functionality: Login a user with given credentials, keep JWT in local/session storage or cookie
	// Input => User credentials [email, password]
	// Output => Entire User Object [first_name, email, location, date]
	// -----------------

  static async login(credentials) {
    // Check if any credentials in the parameter are empty
    const isAnyEmpty = Object.values(credentials).some(credential => !credential);
    if (isAnyEmpty) {
      throw new BadRequestError('One or more credentials are empty.');
    } 

    // Fetch the user from the database using the provided email
    const user = await this.fetchUserByEmail(credentials.email);
    if (!user) {
      throw new NotFoundError('User with this email was not found');
    } 

    // Compare the submitted password with the hashed password stored in the database
    const loginPassword = credentials.password;
    const hashedPassword = user.password_hash;
    const isValidPassword = await bcrypt.compare(loginPassword, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedError('Incorrect password');
    } 

    // Retrieve user information from the Person table in the database
    const query = `SELECT id, first_name, last_name, email, location, date FROM Person WHERE email = $1`;
    const result = await dbClientInstance.query(query, [credentials.email.toLowerCase()]);

    // Build the JWT (JSON Web Token) for the user with the specified ID and email
    const userId = result.rows[0].id;
    const userEmail = result.rows[0].email;
    const jwtPayload = { id: userId, email: userEmail };
    const userJwt = createUserJwt(jwtPayload);

    // Create a new object with user information and the JWT
    const loginUser = { ...result.rows[0], jwt: userJwt };
    return loginUser;
  }

	// ---------------------
	// Functionality: Stores user information in the database when registering,
	// Input => User credentials [first_name, last_name, email, location, password]
	// Output => User object [first_name, jwt]
	//---------------------

	static async register(credentials) {
		// Verify whether all credentials in the parameter are non-empty
		const isEmpty = Object.values(credentials).some(credential => !credential);
		if (isEmpty) throw new BadRequestError('One or more credentials are empty.');

		// Verify whether the email is valid or not by checking if @ exists after index 0 
		if (credentials.email.indexOf('@') <= 0) throw new BadRequestError('Invalid email.');

		// Check if the user's email is already in use in the database		
		const user = await this.fetchUserByEmail(credentials.email);
		if (user) throw new BadRequestError('Email is already in use.');

		// Destructure the @credentials parameter into corresponding variables
		const { first_name, last_name, email, location, password } = credentials;
		
		// Hash the user's password using the 'bcrypt' module		
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(credentials.password, salt);

		// Insert the credentials of said user into the Person database
		let query = `INSERT INTO Person (first_name, last_name, email, location, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING first_name`;
		let result = await dbClientInstance.query(query, [first_name, last_name, email, location, hashedPassword]);
		
		// If insert query was not successful, @rows property will be empty	
		if (result.rows.length === 0) throw new Error('Server error inserting data.'); 
		
		// Build the JWT for this user with their specified ID and email
		query = `SELECT id FROM Person WHERE email = $1`;
		result = await dbClientInstance.query(query, [email]);

		const userId = result.rows[0].id;
		const jwtPayload = { id: userId, email: email };
		const userJwt = createUserJwt(jwtPayload);

		// Set this JWT on the user's local storage, 
		
		const returnUser = { ...result.rows[0], jwt: userJwt };

		// Return the corresponding user back
		return returnUser;
	}

	// -------------------
	// Functionality: Fetch a user with a given email
	// Input => User email
	// Output => Entire User object
	// -------------------

	static async fetchUserByEmail(email) {
		// If the email field is empty, throw a bad request error
		if (!email) throw new BadRequestError('Empty email parameter.');

		const query = `SELECT * FROM Person WHERE email = $1`;
		const result = await dbClientInstance.query(query, [email.toLowerCase()]);

		// Return the corresponding user data back
		const user = result.rows[0];
		return user;
	}

}

module.exports = User;
