import { useDispatch, useSelector } from "react-redux"
import { useField } from '../hooks/field'
import { Link } from "react-router-dom"
import { likeBlog, removeBlog, addComment } from "../reducers/blogReducer"

export default function Blog({ blog }) {
  const {
    reset: resetComment,
    ...commentInput
  } = useField()

  const dispatch = useDispatch()
  const session = useSelector(({ session }) => session)

  if (!blog) return null;
  const removeAllowed = session
    && session.username === blog.user.username

  const handleLike = () => {
    dispatch(likeBlog(blog));
  };
  const handleRemoval = () => {
    if (confirm(`really delete "${blog.title}" by ${blog.author}?`)) {
      dispatch(removeBlog(blog));
    }
  };
  const handleComment = (event) => {
    event.preventDefault();
    dispatch(addComment({
      ...blog,
      comments: blog.comments.concat(commentInput.value)
    }))
    resetComment()
  };

  return <>
    <h2>{blog.title}</h2>
    Click <Link to={blog.url}>here</Link> for more info.
    <br />
    {blog.likes} likes <button onClick={handleLike}>like</button>
    <br />
    added by {blog.user.name}
    {removeAllowed &&
      <button onClick={handleRemoval}>remove</button>
    }
    <h2>comments</h2>
    <form method="POST"
      action={`/blogs/${blog.id}/comments`}
      onSubmit={handleComment}>
      <input {...commentInput} />
      <button type="submit">add comment</button>
    </form >
    <ul>
      {blog.comments
        .map((c, i) =>
          <li key={`${blog.id}-comment-id-${i}`}>{c}</li>
        )}
    </ul>
  </>
}