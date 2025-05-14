const { hash } = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

router.get('/', async (_req, resp) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  resp.json(users);
});

router.post('/', async ({ body: { username, name = 'John Doe', password } }, resp, next) => {
    if (password.length < 3)
      return next({
        name: 'ValidationError',
        message: 'Password must be at least 3 characters long',
      });

    const saltRounds = 10;
    const passwordHash = await hash(password, saltRounds);
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    resp.status(201).json(savedUser);
  }
);

module.exports = router;
