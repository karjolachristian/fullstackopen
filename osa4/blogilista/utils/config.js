require('dotenv').config();

const PORT = process.env.PORT || 3001,
  DB_OPTS = 'retryWrites=true&w=majority',
  DB_HOST = process.env.DB_HOST || '127.0.0.1',
  DB_PASS = process.env.DB_PASS,
  DB_NAME = process.env.NODE_ENV === 'test' ? 'test' : '',
  MONGODB_URI = `mongodb://${
    DB_PASS
      ? 
        `fullstack:${DB_PASS}@`
      : ''
  }${DB_HOST}/${DB_NAME}?${DB_OPTS}`;

module.exports = { MONGODB_URI, PORT };
