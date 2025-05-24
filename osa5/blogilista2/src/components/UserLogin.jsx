import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useField } from "../hooks/field";
import { login } from "../reducers/sessionReducer";
import { regUser } from "../reducers/usersReducer";

export default function UserLogin({ reg }) {
  const { reset: resetName, ...name } = useField();
  const { reset: resetUser, ...username } = useField();
  const { reset: resetPass, ...password } = useField('password');
  const { reset: resetVerification, ...pw_verify } = useField('password');
  const session = useSelector(({ session }) => session);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  if (session) return navigate('/blogs');

  const handleLogin = async (event) => {
    event.preventDefault();
    const user = {
      name: name.value,
      username: username.value,
      password: password.value,
    };
    if (reg) {
      if (password.value !== pw_verify.value)
        return alert('passwords don\'t match');
      dispatch(regUser(user))
      resetName();
      resetVerification();
    } else {
      dispatch(login(user));
    }
    resetUser();
    resetPass();
  };

  return (
    <form action="/api/login">
      <h2>{reg ? 'Register' : 'Log in to application'}</h2>
      <table>
        <tbody>
          {reg && <tr>
            <td>name:</td>
            <td>
              <input {...name} name="name"
                placeholder="Austin Powers" />
            </td>
          </tr>}

          <tr>
            <td>username:</td>
            <td>
              <input {...username} name="username"
                placeholder="austinPowerovich69" />
            </td>
          </tr>

          <tr>
            <td>password:</td>
            <td>
              <input {...password} name="password"
                placeholder="#?**!&@{\|" />
            </td>
          </tr>

          {reg && <tr>
            <td>verify:</td>
            <td>
              <input {...pw_verify} name="pw_verify"
                placeholder="try the same as above" />
            </td>
          </tr>}
        </tbody>
      </table>
      <button style={{
        float: "left"
      }} type="submit" onClick={handleLogin}>
        {reg ? 'register' : 'login'}
      </button>
    </form>
  );
}