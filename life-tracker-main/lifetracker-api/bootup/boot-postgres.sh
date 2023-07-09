#!/bin/bash

# Shell script to boot up and setup databases for database in PostgreSQL

# NOTE: There are some pretty good tools to spawn separate instances of the terminal
# running both backend server processes, Express and PostgreSQL, at the same time, ex. tmux.

# ---PostgreSQL---

# Import environment variables from .env
source ../.env

# Function to execute cleanup before exiting the script
cleanup() {
    # Stop the PostgreSQL server
    echo "Stopping PostgreSQL database server..."
    pg_ctl -D /usr/local/var/postgresql@14 stop
    echo "PostgreSQL database server stopped."
}

# Register the cleanup function to execute on script exit
trap cleanup EXIT

# Start the PostgreSQL server (suppose it exists, check installation path)
echo "Starting PostgreSQL database server..."
pg_ctl -D /usr/local/var/postgresql@14 start
echo "PostgreSQL database server started..."

# Connect into the default `postgres` database server
# Create user with password, then create database, then grant read/write acccess to said user
echo "Connecting into 'postgres' database..."
psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -d postgres << EOF
CREATE USER $DATABASE_USER WITH PASSWORD '$DATABASE_PASS';
CREATE DATABASE $DATABASE_NAME;
GRANT ALL PRIVILEGES ON DATABASE $DATABASE_NAME TO $DATABASE_USER;
EOF
echo "Database '$DATABASE_NAME' successfuly created with user '$DATABASE_USER' and password '$DATABASE_PASS'."

# Run the SQL script to create tables
echo "Running SQL script to create tables on '$DATABASE_NAME' database as '$DATABASE_USER'..."
psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -d "$DATABASE_NAME" -U "$DATABASE_USER" -c '\i ../database/user-schema.sql'
echo "User table created."

echo "Press Ctrl+C to stop the script and shutdown the PostgreSQL server."

# Wait indefinitely, script will exit only when Ctrl+C is pressed
while true; do
    sleep 1
done
