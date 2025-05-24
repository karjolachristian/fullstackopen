import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'feedback',
  initialState: null,
  reducers: {
    set: (_state, { payload }) => payload,
    reset: () => null,
  },
});

const { reset, set } = slice.actions;
let counter = 0;

export const setFeedback = (feedback) => {
  return async (dispatch) => {
    ++counter;
    dispatch(set(feedback));
    setTimeout(() => {
      if (--counter === 0) {
        dispatch(reset());
      }
    }, 5000);
  };
};

export default slice.reducer;
