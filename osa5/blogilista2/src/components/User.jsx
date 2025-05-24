import { Link } from "react-router-dom"
export default function User({ user }) {
  
  return user
    ? <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(b =>
          <li key={`${user.id}-${b.id}`}>
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </li>
        )}
      </ul>
    </>
    : null
}