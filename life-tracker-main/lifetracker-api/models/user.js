const bcrypt = require('bcrypt');

const dbClientInstance = require('../db.js');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/errors.js');
const { generateToken, createUserJwt } = require('../utils/tokens.js');

class User {

  // -----Authentication Methods-----

  static async login(credentials) {
    try {
      this.isAnyEmpty(credentials);
      this.doesUserExist(credentials.email);
      this.verifyPassword(credentials.password, user.password_hash);
      const userObj = await this.retrieveUserObj(credentials.email);
      const jwtPayload = { id: userObj.id, email: userObj.email };
      const userJwt = createUserJwt(jwtPayload);
      return { ...userObj, jwt: userJwt };
    } catch (err) {
      next(err);
    }
  }

  static async register(credentials) {
    try { 
      this.isAnyEmpty(credentials);
      this.isValidEmail(credentials.email);
      this.doesEmailExist(credentials.email);
      const hashedPassword = hashPassword(credentials.password);
      this.insertUserIntoDatabase({ ...credentials, hashedPassword });
      const userObj = this.retrieveUserObj(credentials.email);
      const jwtPayload = { id: userObj.id, email: userObj.email };
      const userJwt = createUserJwt(jwtPayload);
      return { ...userObj, jwt: userJwt };
    } catch (err) {
      next(err);
    }
  }

  // -----Helper Functions / Utility-----

  // --Input Checks--

  static isAnyEmpty(credentials) {
    const isAnyEmpty = Object.values(credentials).some((credential) => !credential);
    if (isAnyEmpty) {
      throw new BadRequestError('One or more credentials are empty.');
    }
  }

  static isValidEmail(userEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(userEmail);
    if (!isValid) {
      throw new BadRequestError('Email is not in a valid format.');
    }
  }

  static doesUserExist(userEmail) {
    const result = await this.fetchUserByEmail(userEmail);
    if (result.rows.length === 0) {
      throw new NotFoundError('User with this email was not found.');
    }
  }

  static doesEmailExist(userEmail) {
    const result = await this.fetchUserByEmail(userEmail);
    if (result.rows.length !== 0) {
      throw new BadRequestError('Email is already in use.');
    }
  }

  async static verifyPassword(loginPassword, hashedPassword) {
    const isValidPassword = await bcrypt.compare(loginPassword, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedError('Incorrect password.');
    }
  }

  // --Database Queries--

  async static fetchUserByEmail(userEmail) {
    const query = 'SELECT id, email FROM User WHERE LOWER(emai) = LOWER($1)';
    const result = await dbClientInstance.query(query, [userEmail]);
    return result.rows[0];
  }

  async static retrieveUserObj(userEmail) {
    const lowerCaseUserEmail = userEmail.toLowerCase();
    const query = 'SELECT id, first_name, last_name, email, date FROM User WHERE LOWER(email) = LOWER($1)';
    const result = await dbClientInstance.query(query, [userEmail]);
    return result.rows[0];
  }

  async static insertUserIntoDatabase(userObj) {
    const { first_name, last_name, email, hashed_password } = userObj;
    const query = 'INSERT INTO User (first_name, last_name, email, hashed_password) VALUES ($1, $2, LOWER($3), $4)';
    const result = await dbClientInstance.query(query, [first_name, last_name, email, hashed_password]);
  }

  // --Data Processing--

  async static hashPassword(userPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    return hashedPassword;
  }

}

module.exports = User;

