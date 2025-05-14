const jwt = require('jsonwebtoken');
const User = require('../models/user');
const log = require('./logger');

const requestLogger = (req, _resp, next) => {
  log.info('Method:', req.method);
  log.info('Path:  ', req.path);
  log.info('Body:  ', req.body);
  log.info('---');
  next();
};

const unknownEndpoint = (_req, resp) =>
  resp.status(404).send({ error: 'unknown endpoint' });

const errorHandler = (error, _req, resp, next) => {
  const { name, message } = error;

  if (name === 'CastError')
    return resp.status(400).send({ error: 'malformatted id' });

  if (name === 'ValidationError')
    return resp.status(400).json({ error: message });

  if (
    name === 'MongoServerError' &&
    message.includes('E11000 duplicate key error')
  )
    return resp.status(400).json({ error: 'expected `username` to be unique' });

  if (name === 'AuthErr') return resp.status(401).json({ error: message });

  if (name === 'JsonWebTokenError')
    return resp.status(400).json({ error: 'token missing or invalid' });

  next(error);
};

const tokenExtractor = (req, _resp, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  }
  next();
};

const userExtractor = async (req, _resp, next) => {
  if (req.token) {
    const { id: uid = null } = jwt.verify(req.token, process.env.SECRET);

    if (!uid){
      return next({
        name: 'AuthErr',
        message: 'invalid token',
      });
    }
    req.user = await User.findById(uid);
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
