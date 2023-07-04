require('dotenv').config();

const express = require('express');

const { Pool } = require('pg');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./routes/auth.js');

const { requireAuthenticatedUser } = require('./middleware/security.js');

const { BadRequestError, NotFoundError } = require('./utils/errors.js');

const app = express();

// ------pre-processing middleware------

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

// ------main handler/endpoints---------

app.get('/', (req, res) => {
	res.send({ ping: 'pong'});
});

// ------security middleware------------

// ------auth route handler-------------
app.use('/auth', authRouter);

// -----post-processing middleware------

app.use((req, res, next) => {
	return next(new NotFoundError());
});

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message;

	return res.status(status).json({
		error: { message, status },
	});
});

// --------server/port----------

const {PORT} = require('./config.js');

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log(`Server running...`);
