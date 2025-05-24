import { createSlice } from '@reduxjs/toolkit';
import service from '../services/login';
import { setFeedback } from './feedbackReducer';

const slice = createSlice({
  name: 'session',
  initialState: null,
  reducers: {
    login: (_state, { payload }) => {
      service.setToken(payload.token);
      localStorage.setItem('user', JSON.stringify(payload));
      return payload;
    },

    logout: () => {
      localStorage.removeItem('user');
      return null;
    },
  },
});

const { login, logout } = slice.actions;

const loginAction = (user = null) => {
  return async (dispatch) => {
    if (user) {
      try {
        const creditentials = await service.login(user);
        dispatch(login(creditentials));
        dispatch(setFeedback(['login succeeded']));
      } catch (e) {
        dispatch(setFeedback([`login failed: ${e.response.data.error}`, true]));
      }
    } else {
      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        const creditentials = JSON.parse(userJSON);
        dispatch(login(creditentials));
      }
    }
  };
};

export { loginAction as login, logout };
export default slice.reducer;
