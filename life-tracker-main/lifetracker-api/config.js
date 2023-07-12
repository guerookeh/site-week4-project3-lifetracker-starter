require('dotenv').config();

const PORT = process.env.BACKEND_PORT || 3001;

const FRONTEND_URL = `${process.env.HOST}:${process.env.FRONTEND_PORT}`;
const BACKEND_URL = `${process.env.HOST}:${process.env.BACKEND_PORT}`;

const { SECRET_KEY } = process.env;

function getDatabaseURI() {
  const {
    DATABASE_USER, DATABASE_PASS, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME,
  } = process.env;
  return `postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
}

module.exports = {
  PORT,
  FRONTEND_URL,
  BACKEND_URL,
  SECRET_KEY,
  getDatabaseURI,
};
