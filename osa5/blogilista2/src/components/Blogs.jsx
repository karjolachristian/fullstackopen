import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import BlogForm from "./BlogForm";

export default function Blogs() {
  const { blogs, session } = useSelector(({ blogs, session }) => ({ blogs, session }));

  return (
    <>
      {session && <BlogForm />}
      <ul>
        {// Array.sort modifies the original array...
          [...blogs]
            .sort(({ likes: a }, { likes: b }) => b - a)
            .map((blog) =>
              <li>
                <Link key={blog.id} to={`/blogs/${blog.id}`}>
                  {blog.title}
                </Link> by {blog.author}
              </li>
            )}
      </ul>
    </>
  );
}