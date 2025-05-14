const jwt = require('jsonwebtoken');
const { compare } = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

router.post('/', async ({ body: { username: username_from_req, password } }, resp, next) => {
    const user = await User.findOne({ username: username_from_req });
    if (!user){
      return next({
        name: 'AuthErr',
        message: 'user not found',
      });
    }
    const { _id: id, username, passwordHash, name } = user;

    if (!(await compare(password, passwordHash)))
      return next({
        name: 'AuthErr',
        message: 'wrong password',
      });

    const token = jwt.sign({ username, id }, process.env.SECRET);

    resp.status(200).send({ token, username, name });
  }
);

module.exports = router;
