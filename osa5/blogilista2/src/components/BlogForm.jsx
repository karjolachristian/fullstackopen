import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { useField } from "../hooks/field";

export default function BlogForm() {
  const [showForm, setShowForm] = useState(false);
  const { reset: reTitle, ...title } = useField();
  const { reset: reAuthor, ...author } = useField();
  const { reset: reUrl, ...url } = useField();

  const dispatch = useDispatch();
  const toggleForm = (event) => {
    event.preventDefault()
    setShowForm(!showForm)
  }

  const handleBlogSubmit = (event) => {
    event.preventDefault();
    dispatch(
      createBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      }),
    );
  };

  return (
    <form action="/api/blogs" method="POST">
      {showForm &&
        <>
          <h2>create new</h2>
          title: <input {...title} />
          <br />
          author: <input {...author} />
          <br />
          url: <input {...url} />
          <br />
          <button type="submit" onClick={handleBlogSubmit}>
            create
          </button>
        </>
      }
      <button onClick={toggleForm}>
        {showForm ? "cancel" : "create new blog"}
      </button>
    </form>
  );
};