import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../reducers/sessionReducer"

export default function Navbar() {
  const dispatch = useDispatch()
  const session = useSelector(({ session }) => session)

  return (
    <nav>
      <Link to="/blogs">blogs</Link>
      <Link to="/users">users</Link>
      {session
        ? <>
          <i>
            {session.name} logged in
          </i>
          <button className="login"
            onClick={() => {
              dispatch(logout());
            }}>
            logout
          </button>
        </>
        : <>
          <Link className="auth" to="/login">login</Link>
          <Link className="auth" to="/register">register</Link>
        </>
      }
    </nav>
  )
}