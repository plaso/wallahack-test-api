require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

/* DB initialization */

require('./config/db.config');

/* Express middlewares configuration */

const app = express();

app.use(logger('dev'));
app.use(express.json());

/* Routes */

const routes = require('./config/routes.config');
app.use(routes);

/* Handle errors */

app.use((req, res, next) => {
  next(createError(StatusCodes.NOT_FOUND, 'Route not found'));
})

app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(StatusCodes.BAD_REQUEST, error);
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(StatusCodes.NOT_FOUND, 'Resource not found');
  } else if (error.message.includes('E11000')) {
    error = createError(StatusCodes.BAD_REQUEST, 'Already exists');
  } else if (error instanceof jwt.JsonWebTokenError) {
    error = createError(StatusCodes.UNAUTHORIZED, error)
  } else if (!error.status) {
    error = createError(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const data = {};
  data.message = error.message;
  data.errors = error.errors
    ? Object.keys(error.errors).reduce(
      (errors, key) => {
        return {
          ...errors,
          [key]: error.errors[key].message || error.errors[key]
        }
      },
      {}
    ) : undefined

  res.status(error.status).json(data);
})

app.listen(process.env.PORT || 3000, () => {
  console.log('App initialized at', process.env.PORT || 3000);
})