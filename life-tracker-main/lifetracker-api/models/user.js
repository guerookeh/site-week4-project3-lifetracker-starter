const bcrypt = require('bcrypt');

const dbClientInstance = require('../database/db.js');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../utils/errors.js');
const { generateToken, createUserJwt } = require('../utils/tokens.js');

class User {
  // -----Authentication Methods-----

  static async login(credentials) {
    this.isAnyEmpty(credentials);
    await this.doesUserExist(credentials.email);
    const passObj = await this.fetchUserHashedPassword(credentials.email);
    await this.verifyPassword(credentials.password, passObj.hashed_password);
    const userObj = await this.retrieveUserObj(credentials.email);
    const jwtPayload = { id: userObj.id, email: userObj.email };
    const userJwt = createUserJwt(jwtPayload);
    return { ...userObj, jwt: userJwt };
  }

  static async register(credentials) {
    this.isAnyEmpty(credentials);
    this.isValidEmail(credentials.email);
    await this.doesEmailExist(credentials.email);
    const hashedPassword = await this.hashPassword(credentials.password);
    await this.insertUserIntoDatabase({ ...credentials, hashed_password: hashedPassword });
    const userObj = await this.retrieveUserObj(credentials.email);
    const jwtPayload = { id: userObj.id, email: userObj.email };
    const userJwt = createUserJwt(jwtPayload);
    return { ...userObj, jwt: userJwt };
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

  static async doesUserExist(userEmail) {
    const result = await this.fetchUserByEmail(userEmail);
    if (!result) {
      throw new NotFoundError('User with this email was not found.');
    }
  }

  static async doesEmailExist(userEmail) {
    const result = await this.fetchUserByEmail(userEmail);
    if (result) {
      throw new BadRequestError('Email is already in use.');
    }
  }

  static async verifyPassword(loginPassword, hashedPassword) {
    const isValidPassword = await bcrypt.compare(loginPassword, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedError('Incorrect password.');
    }
  }

  // --Database Queries--

  static async fetchUserByEmail(userEmail) {
    const query = 'SELECT id, email FROM UserTable WHERE LOWER(email) = LOWER($1);';
    const result = await dbClientInstance.query(query, [userEmail]);
    return result.rows[0];
  }

  static async fetchUserHashedPassword(userEmail) {
    const query = 'SELECT hashed_password FROM UserTable WHERE LOWER(email) = LOWER($1);';
    const result = await dbClientInstance.query(query, [userEmail]);
    return result.rows[0];
  }

  static async retrieveUserObj(userEmail) {
    const lowerCaseUserEmail = userEmail.toLowerCase();
    const query = 'SELECT id, first_name, last_name, email, date FROM UserTable WHERE LOWER(email) = LOWER($1);';
    const result = await dbClientInstance.query(query, [userEmail]);
    return result.rows[0];
  }

  static async insertUserIntoDatabase(userObj) {
    const {
      first_name, last_name, email, hashed_password,
    } = userObj;
    const query = 'INSERT INTO UserTable (first_name, last_name, email, hashed_password) VALUES ($1, $2, LOWER($3), $4);';
    const result = await dbClientInstance.query(query, [first_name, last_name, email, hashed_password]);
  }

  // --Data Processing--

  static async hashPassword(userPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);
    return hashedPassword;
  }
}

module.exports = User;
