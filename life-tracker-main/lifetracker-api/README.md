# LifeTracker Express API

This repo holds the backend code for the LifeTracker Express API.


Then setup the database by running `psql -f lifetracker.sql`.

Run `npm install` to get the appropriate dependencies.

Start up the server in dev with `npm run dev` (`npm run dev-win` for Windows users).

# LifeTracker API

This repo holds the backend code for the LifeTracker API. 
It has been heavily modified and refactored to include facilitated bootup functionality for both Express and PostgreSQL.

## Dev Setup

Copy the .env.template into a `.env` file.

```bash
cp .env.template .env
```

And fill in the appropriate env vars:

```bash
DATABASE_USER=postgres
DATABASE_PASS=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=lifetracker
DATABASE_TEST_NAME=lifetracker_test
```

These should be updated with values needed for your PostgreSQL connection string.

# Backend Startup

In the `bootup` files there are two shell scripts to start Express and PostgreSQL.

For both of these files, you will have to grant executable permissions.
```bash 
chmod +x boot-express.sh
```
```bash 
chmod +x boot-postgres.sh
```

Proceed to run both of them afterwards.
```bash 
./boot-express.sh
```
```bash 
./boot-postgres.sh
```

# NOTE: Certain module and application installations are required before utilizing these commands.
Take note of any `node_module` dependencies in the `package.json`.
Also take note of your local PostgreSQL installation path, if so, modify the path in `boot-postgres.sh` for your path and/or installation.
