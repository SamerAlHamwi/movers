import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, LoginRequest } from '@app/services/auth';
import { deleteToken, deleteUser, persistToken, persistUser, readToken } from '@app/services/localStorage';
import { setUser } from './userSlice';

export interface AuthSlice {
  token: string | null;
}

const initialState: AuthSlice = {
  token: readToken(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async (loginPayload: LoginRequest, { dispatch }) =>
  login(loginPayload).then((response) => {
    dispatch(setUser(response.result));
    persistToken(response.result.accessToken);
    persistUser(response.result);
    return response.result.accessToken;
  }),
);

export const doLogout = createAsyncThunk('auth/doLogout', (payload, { dispatch }) => {
  deleteToken();
  deleteUser();
  dispatch(setUser(null));
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      state.token = '';
    });
  },
});

export default authSlice.reducer;
