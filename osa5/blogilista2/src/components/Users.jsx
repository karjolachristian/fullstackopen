import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

export default function Users() {
  const users = useSelector(({ users }) => users)

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u =>
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}