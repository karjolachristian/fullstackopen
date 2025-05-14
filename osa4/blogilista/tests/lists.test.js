const { strictEqual, deepStrictEqual } = require('node:assert');
const { test, describe } = require('node:test');
const {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
} = require('../utils/list_helper');
const { INITIAL_BLOGS } = require('./test_helper');

test('dummy(blogs) => 1', () => {
  const blogs = [];

  const result = dummy(blogs);
  strictEqual(result, 1);
});

describe('totalLikes', () => {
  test('empty array returns 0', () => {
    strictEqual(totalLikes([]), 0);
  });

  test("array of 1 blog equals 1st elements' likes", () => {
    strictEqual(totalLikes([INITIAL_BLOGS[0]]), INITIAL_BLOGS[0].likes);
  });

  test('3+4+5 likes == 12 likes', () => {
    strictEqual(
      totalLikes([
        { likes: 3 },
        { likes: 4 },
        { likes: 5 },
      ]),
      12
    );
  });

  test('totalLikes(INITIAL_BLOGS) => 36', () => {
    strictEqual(totalLikes(INITIAL_BLOGS), 36);
  });
});

describe('favoriteBlog', () => {
  test("empty array's favorite is an empty array", () => {
    deepStrictEqual(favoriteBlog([]), []);
  });

  test('array of 2 with equal likes returns both', () => {
    const arr = [
      { name: 1, likes: 10 },
      { name: 2, likes: 10 },
    ];

    deepStrictEqual(favoriteBlog(arr), arr);
  });

  test('larger array works fine with 1 top-liked element', () => {
    deepStrictEqual(favoriteBlog(INITIAL_BLOGS), [INITIAL_BLOGS[2]]);
  });

  test('larger array works fine with more top-liked element', () => {
    const injected = [...INITIAL_BLOGS];

    injected.splice(2, 0, INITIAL_BLOGS[2], INITIAL_BLOGS[2], INITIAL_BLOGS[2]);

    deepStrictEqual(favoriteBlog(injected), [
      INITIAL_BLOGS[2],
      INITIAL_BLOGS[2],
      INITIAL_BLOGS[2],
      INITIAL_BLOGS[2],
    ]);
  });
});

describe('mostBlogs', () => {
  test('return most popular author', () => {
    deepStrictEqual(mostBlogs(INITIAL_BLOGS), [
      {
        author: INITIAL_BLOGS[3].author,
        blogs: 3,
      },
    ]);
  });

  test('most popular of empty list is []', () => {
    deepStrictEqual(mostBlogs([]), []);
  });

  test('returns both top-authors', () => {
    const modified = [...INITIAL_BLOGS, INITIAL_BLOGS[2]];

    deepStrictEqual(mostBlogs(modified), [
      {
        author: INITIAL_BLOGS[2].author,
        blogs: 3,
      },
      {
        author: INITIAL_BLOGS[3].author,
        blogs: 3,
      },
    ]);
  });
});

describe('mostLikes', () => {
  test('return correct author with mostLikes', () => {
    deepStrictEqual(mostLikes(INITIAL_BLOGS), [
      {
        author: INITIAL_BLOGS[2].author,
        likes: 17,
      },
    ]);
  });

  test('mostLikes of empty list is []', () => {
    deepStrictEqual(mostLikes([]), []);
  });

  test('mostLikes reutrns both top-authors', () => {
    const modified = [
      ...INITIAL_BLOGS,
      {
        ...INITIAL_BLOGS[0],
        likes: 10,
      },
    ];

    deepStrictEqual(mostLikes(modified), [
      {
        author: INITIAL_BLOGS[0].author,
        likes: 17,
      },
      {
        author: INITIAL_BLOGS[2].author,
        likes: 17,
      },
    ]);
  });
});
