import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { persistUser, readUser } from '@app/services/localStorage';

const initialState: any = {
  user: readUser(),
};

export const setUser = createAction<PrepareAction<any>>('user/setUser', (newUser) => {
  persistUser(newUser);
  return {
    payload: newUser,
  };
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice.reducer;
