const { MONGODB_URI } = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const blogRoutes = require('./controllers/blogs');
const loginRoutes = require('./controllers/login');
const userRoutes = require('./controllers/users');

const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require('./utils/middleware');
const log = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

log.info('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    log.info('connected to the database');
  })
  .catch((error) => {
    log.error('ERROR:', error.message);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(tokenExtractor);
app.use(userExtractor);
app.use(requestLogger);
app.use('/api/blogs', blogRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'test'){
  app.use('/api/testing', require('./controllers/testing'));
}

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
