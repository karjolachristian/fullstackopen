import { createSlice } from '@reduxjs/toolkit';
import service from '../services/users';
import loginService from '../services/login';
import { setFeedback } from './feedbackReducer';

const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    insert: (state, { payload }) => state.concat(...[payload].flat()),
  },
});

const { insert } = slice.actions;

export const initUsers = () => {
  return async (dispatch) => {
    const allUsers = await service.getAll();
    dispatch(insert(allUsers));
  };
};

export const regUser = (user) => {
  return async (dispatch) => {
    try {
      const newUser = await service.create({ ...user });
      dispatch(insert({ ...newUser }));
      dispatch(loginService.login({ ...user }));
      dispatch(setFeedback(['registration succeeded']));
    } catch (e) {
      dispatch(
        setFeedback([`registration failed: ${e.response.data.error}`, true])
      );
    }
  };
};

export default slice.reducer;
