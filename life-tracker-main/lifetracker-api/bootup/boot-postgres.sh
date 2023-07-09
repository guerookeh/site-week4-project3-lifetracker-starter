#!/bin/bash

# Shell script to boot up and setup databases for database in PostgreSQL

# ---PostgreSQL---

# Import environment variables from .env
source .env

# Start the PostgreSQL server (suppose it exists, check installation path)
echo "Starting PostgreSQL database server..."
pg_ctl -D /usr/local/var/postgresql@14 start
echo "PostgreSQL database server booted..."

# Connect into the default `postgres` database server
# Create user with password, then create database, then grant read/write acccess to said user
echo "Connecting into 'postgres' database..."
psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -d postgres << EOF
CREATE USER $DATABASE_USER WITH PASSWORD $DATABASE_PASSWORD;
CREATE DATABASE $DATABASE_NAME;
GRANT ALL PRIVILEGES ON DATABASE $DATABASE_NAME TO $DATABASE_USER;
EOF
echo "Database '$DATABASE_NAME' successfuly created with user '$DATABASE_USER' and password '$DATABASE_PASSWORD'"

# Run the SQL script to create tables
echo "Running SQL script to create tables on '$DATABASE_NAME' database..."
psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USER" -W "$DATABASE_PASSWORD" -d "$DATABASE_NAME" -f database/user-schema-setup.sql
echo "User table created."

echo "To shut down the PostgreSQL server, run 'pg_ctl -D /usr/local/var/postgresql@14 stop.'"

