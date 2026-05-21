import { updateUserApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerUserApi, loginUserApi, getUserApi, logoutApi } from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; name: string; password: string }) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const res = await loginUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (user: { name?: string; email?: string; password?: string }) => {
    const res = await updateUserApi(user);
    return res.user;
  }
);

export const getUser = createAsyncThunk('auth/getUser', async () => {
  if (!getCookie('accessToken')) return Promise.reject();
  const res = await getUserApi();
  return res.user;
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const res = await logoutApi();
  if (res.success) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return null;
});

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Ошибка регистрации';
      })

      // Вход
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.error = 'Ошибка входа';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      // Получение пользователя
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })

      // Выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default authSlice.reducer;
