import { configureStore } from '@reduxjs/toolkit';
import blogs from './reducers/blogReducer';
import session from './reducers/sessionReducer';
import users from './reducers/usersReducer';
import feedback from './reducers/feedbackReducer';

const store = configureStore({
  reducer: { blogs, session, users, feedback },
});

export default store;
