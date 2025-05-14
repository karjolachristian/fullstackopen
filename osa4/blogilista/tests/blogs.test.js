const { notEqual, strictEqual, deepStrictEqual } = require('node:assert');
const { test, beforeEach, after, describe } = require('node:test');
const supertest = require('supertest');
const mongoose = require('mongoose');
const api = supertest(require('../app'));
const {
  INITIAL_BLOGS,
  resetDb,
  blogsInDb,
  dummyBlog,
  BLOG_FIELD_PRESETS,
} = require('./test_helper');

let authHeader;

describe('tests involving actual DB queries', () => {
  beforeEach(async () => {
    authHeader = await resetDb(api);
  });

  test('right amount of blogs are returned as json', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    strictEqual(blogs.body.length, INITIAL_BLOGS.length);
  });

  test('id property is present on blogs', async () => {
    const {
      body: [{ id, _id }],
    } = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    notEqual(id, undefined);
    strictEqual(_id, undefined);
  });

  test('POST /api/blogs returns blog w/ correct contents', async () => {
    const new_blog = dummyBlog();

    const { body: saved_blog } = await api
      .post('/api/blogs')
      .set(authHeader)
      .send(new_blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    deepStrictEqual(
      {
        ...new_blog,
        id: saved_blog.id,
        user: saved_blog.user,
      },
      saved_blog
    );

    const blogs_now = await blogsInDb();
    strictEqual(blogs_now.length, INITIAL_BLOGS.length + 1);
  });

  test('`likes` defaults to 0 if undefined', async () => {
    const new_blog = dummyBlog(0b111);

    const { body: saved_blog } = await api
      .post('/api/blogs')
      .set(authHeader)
      .send(new_blog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    deepStrictEqual(
      {
        ...new_blog,
        user: saved_blog.user,
        id: saved_blog.id,
        likes: 0,
      },
      saved_blog
    );
  });

  test('POST => HTTP400 if missing author/title/url fields', async () => {
    for (const missing_field of [0, 1, 2]) {
      const field_name = BLOG_FIELD_PRESETS[missing_field][0],
        expected_error = `Blog validation failed: ${field_name}: Path \`${field_name}\` is required.`;

      const {
        body: { error },
      } = await api
        .post('/api/blogs')
        .set(authHeader)
        .send(dummyBlog(0b111 - Math.pow(2, missing_field)))
        .expect(400)
        .expect('Content-Type', /application\/json/);

      strictEqual(error, expected_error);
    }
  });

  test('DELETE => HTTP 200 upon success', async () => {
    const removedId = INITIAL_BLOGS[0]._id;

    const response = await api
      .delete(`/api/blogs/${removedId}`)
      .set(authHeader)
      .expect(200);

    const { user, id: _id, ...deletedBlog } = response.body;

    deepStrictEqual(
      {
        ...deletedBlog,
        _id,
        __v: 0,
      },
      INITIAL_BLOGS[0]
    );

    strictEqual(
      (await blogsInDb()).find(({ id }) => id === removedId),
      undefined
    );
  });

  test('DELETE => HTTP 400 upon failure', async () => {
    await api.delete('/api/blogs/omena').set(authHeader).expect(400);

    strictEqual((await blogsInDb()).length, INITIAL_BLOGS.length);
  });

  test('PUT => HTTP 200 upon success', async () => {
    const updated_id = INITIAL_BLOGS[0]._id;

    await api
      .put(`/api/blogs/${updated_id}`)
      .set(authHeader)
      .send({ likes: 999 })
      .expect(200);

    strictEqual(
      (await blogsInDb()).find(({ id }) => id === updated_id).likes,
      999
    );
  });
  test('PUT => HTTP 400 upon failure', async () => {
    await api.put('/api/blogs/omena').send({ likes: 999 }).expect(400);
  });
  after(async () => {
    await mongoose.connection.close();
  });
});
