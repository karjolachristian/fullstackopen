const router = require('express').Router();
const Blog = require('../models/blog');

router.get('/', async (_req, resp) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    _id: 1,
  });
  resp.json(blogs);
});

router.post('/', async ({ body, user = null }, resp, next) => {
  if (!user)
    return next({
      name: 'AuthErr',
      message: 'must be signed in to create new blogs',
    });
  const new_blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await new_blog.save();

  user.blogs.push(savedBlog._id);
  await user.save();
  savedBlog.user = user;
  resp.status(201).json(savedBlog);
});

router.delete('/:id', async ({ params: { id }, user = null }, resp, next) => {
  if (!user)
    return next({
      name: 'AuthErr',
      message: 'must be signed in to delete blogs',
    });
  const blog = await Blog.findById(id);

  if (blog.user._id.toString() !== user._id.toString())
    return next({
      name: 'AuthErr',
      message: 'you SHALL NOT DELETE!',
    });
  user.blogs = user.blogs.filter((bid) => bid !== blog._id);
  await user.save();
  const deletedBlog = await Blog.findOneAndDelete({ _id: id });
  resp.status(200).json(deletedBlog);
});

router.put('/:id', async ({ params: { id }, body: { likes, comments } }, resp) => {
    const diff = {};
    if (likes) {diff.likes = likes};
    if (comments){diff.comments = comments} ;
    const updatedBlog = await Blog.findByIdAndUpdate(id, diff, {
      new: true,
      runValidators: true,
      context: 'query',
    }).populate('user', {
      username: 1,
      name: 1,
      _id: 1,
    });
    resp.status(200).json(updatedBlog);
  }
);

module.exports = router;
