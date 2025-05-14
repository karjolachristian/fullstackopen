const { notEqual, strictEqual } = require('node:assert');
const { test, beforeEach, after, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const api = supertest(require('../app'));
const { usersInDb } = require('./test_helper');

const bcrypt = require('bcrypt');
const User = require('../models/user');

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    await new User({
      username: 'root',
      passwordHash: await bcrypt.hash('toor', 10),
    }).save();
  });

  test('POST => 201 with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'aaa',
      name: 'Aa A',
      password: 'aaa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    notEqual(
      usersAtEnd.find(({ username: u }) => u === newUser.username),
      undefined
    );
  });

  test('POST => 400 with a taken username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'Aa A',
      password: 'aaa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('POST => 201 with username.length == 3', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'xxx',
      password: 'aaa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();

    strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    notEqual(
      usersAtEnd.find(({ username: u }) => u === newUser.username),
      undefined
    );
  });

  test('POST => 400 with username.length < 3', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'x',
      password: 'aaa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('POST => 201 with password.length == 3', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'xxx',
      password: 'aaa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();

    strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    notEqual(
      usersAtEnd.find(({ username: u }) => u === newUser.username),
      undefined
    );
  });

  test('POST => 400 with password.length < 3', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'xxx',
      password: 'aa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
