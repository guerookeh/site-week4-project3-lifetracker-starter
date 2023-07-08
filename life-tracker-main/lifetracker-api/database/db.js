const { Client } = require('pg');
const { getDatabaseURI } = require('../config.js');

const databaseURI = getDatabaseURI();
const client = new Client({ connectionString: databaseURI });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Client connected to database.');
  } catch (err) {
    console.log('Error connecting to database.');
  }
}

connectToDatabase();

module.exports = client;
