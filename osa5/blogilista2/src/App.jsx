import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Routes, Route, useMatch
} from 'react-router-dom'
import Navbar from "./components/Navbar";
import Feedback from "./components/Feedback";
import UserLogin from "./components/UserLogin";
import User from './components/User';
import Users from './components/Users';
import Blog from './components/Blog';
import Blogs from "./components/Blogs";
import { initBlogs } from './reducers/blogReducer';
import { initUsers } from './reducers/usersReducer';
import { login } from "./reducers/sessionReducer";

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initBlogs());
    dispatch(initUsers())
    dispatch(login());
  }, []);

  const { blogs, users } = useSelector(({ blogs, users }) =>
    ({ blogs, users }));

  const matchedUser = useMatch('/users/:id')
  const user = matchedUser
    ? users.find(user => user.id === matchedUser.params.id)
    : null

  const matchedBlog = useMatch('/blogs/:id')
  const blog = matchedBlog
    ? blogs.find(blog => blog.id === matchedBlog.params.id)
    : null

  return (
    <>
      <Navbar />
      <h1>Blogilista</h1>
      <Feedback />
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs" element={<Blogs />}> 
          <Route path=":id" element={<Blog blog={blog} />} />
        </Route>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserLogin reg={true} />} />
        <Route path="/users" element={<Users />} >
          <Route path=":id" element={<User user={user} />} />
        </Route>
      </Routes>
    </>

  );
};

export default App;
