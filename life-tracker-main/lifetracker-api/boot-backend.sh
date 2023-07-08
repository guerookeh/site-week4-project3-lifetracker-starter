#!/bin/bash

# ---Shell script to run entire backend: Express.JS and PostgreSQL server---

# This script is supposed to go on `/lifetracker-api` so that paths are correctly set.

# ---Express.JS---

# `npm run dev` script command located in `package.json`

echo "Starting Express.JS server..."
npm run dev

# ---PostgreSQL---

# Import environment variables from .env
source .env

# Start the PostgreSQL server (suppose it exists, check installation path)
pg_ctl -D /usr/local/var/postgres start

# Check if the database already exists
if psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -lqt | cut -d \| -f 1 | grep -qw "$DATABASE_NAME"; then
  echo "Database '$DATABASE_NAME' already exists. Skipping creation."
else
  # Create the database
  createdb -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" "$DATABASE_NAME"
  echo "Database '$DATABASE_NAME' created."
  # Create the user with password
  psql -U postgres -c "CREATE USER '$DATABASE_USER' WITH PASSWORD '$DATABASE_PASSWORD';"
  echo "User '$DATABASE_USER' created with password '$DATABASE_PASSWORD'."
  # Grant read/write privileges to user on database
  psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DATABASE_NAME TO '$DATABASE_USER';"
  echo "Read/write privileges granted to '$DATABASE_USER' on '$DATABASE_NAME'."
fi

# Run the SQL script to create tables
psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -W "$DATABASE_PASSWORD" -d "$DATABASE_NAME" -f database/user-schema-setup.sql
