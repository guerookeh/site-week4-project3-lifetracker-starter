require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./routes/auth.js');
const nutritionRouter = require('./routes/nutrition.js');
const { BadRequestError, NotFoundError } = require('./utils/errors.js');

const app = express();

// -----pre-processing middleware-----

app.use(express.json());
app.use(morgan('tiny'));

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

// -----main handler/endpoints-----

app.get('/', (req, res) => {
  res.send({ ping: 'pong' });
});

// -----security middleware-----

// -----route handlers-----

app.use('/nutrition', nutritionRouter);
app.use('/auth', authRouter);

// -----error handlers/post-processing-----

app.use((req, res, next) => next(new NotFoundError()));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const { message } = err;
  return res.status(status).json({
    error: { message, status },
  });
});

// ----------server/port----------

const { PORT } = require('./config.js');

app.listen(PORT, () => {
  console.log(`Server running on http::localhost:${PORT}`);
});

console.log('Server running...');
