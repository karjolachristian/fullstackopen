const Blog = require('../models/blog');
const User = require('../models/user');
const { hash } = require('bcrypt');

const INITIAL_BLOGS = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

const BLOG_FIELD_PRESETS = [
  ['author', 'aaa'],
  ['title', 'bbb'],
  ['url', 'ccc'],
  ['likes', 123],
];

const dummyBlog = (requested_fields = 0b1111) => {
  return Object.fromEntries(
    BLOG_FIELD_PRESETS.filter(
      (_key_val_pair, idx) => requested_fields & Math.pow(2, idx)
    )
  );
};

const resetDb = async (api = null) => {
  await User.deleteMany({});

  const testUser = {
    username: 'root',
    password: 'toor',
    name: 'I AM ROOT',
  };

  const saved_user = await new User({
    ...testUser,
    passwordHash: await hash(testUser.password, 10),
    blogs: INITIAL_BLOGS.map((b) => b._id),
  }).save();

  await Blog.deleteMany({});
  await Blog.insertMany(
    INITIAL_BLOGS.map((b) => ({
      ...b,
      user: saved_user._id,
    }))
  );

  if (api) {
    const resp = await api
      .post('/api/login')
      .send(testUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    return {
      Authorization: `Bearer ${resp.body.token}`,
    };
  }
};

const blogsInDb = async () => {
  const notes = await Blog.find({});
  return notes.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  INITIAL_BLOGS,
  resetDb,
  blogsInDb,
  dummyBlog,
  BLOG_FIELD_PRESETS,
  usersInDb,
};
