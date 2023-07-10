require('dotenv').config();

const PORT = process.env.PORT || 3001;

const { SECRET_KEY } = process.env;

function getDatabaseURI() {
  const {
    DATABASE_USER, DATABASE_PASS, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME,
  } = process.env;
  return `postgresql://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
}

module.exports = {
  PORT,
  SECRET_KEY,
  getDatabaseURI,
};
