import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, LoginRequest } from '@app/services/auth';
import {
  deletePermissions,
  deleteToken,
  deleteUser,
  persistPermissions,
  persistToken,
  persistUser,
  readPermissions,
  readToken,
} from '@app/services/localStorage';
import { setUser } from './userSlice';

export interface AuthSlice {
  token: string | null;
  permissions: string[];
}

const initialState: AuthSlice = {
  token: readToken(),
  permissions: readPermissions(),
};

export const doLogin = createAsyncThunk('auth/doLogin', async (loginPayload: LoginRequest, { dispatch }) =>
  login(loginPayload).then((response) => {
    dispatch(setUser(response.result));
    persistToken(response.result.accessToken);
    console.log('response.result.permissions', response.result.permissions);

    persistPermissions(response.result.permissions);
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
      state.permissions = readPermissions();
    });

    builder.addCase(doLogout.fulfilled, (state) => {
      state.token = '';
      state.permissions = [];
      deletePermissions();
    });
  },
});

export default authSlice.reducer;
