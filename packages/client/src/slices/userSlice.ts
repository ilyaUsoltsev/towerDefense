import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SERVER_HOST } from '../constants';
import { User, LoginRequestData, CreateUser, APIError } from '../api/type';
import AuthApi from '../api/auth';
import OauthApi from '../api/oauth';
import { isApiError } from '../api/isApiError';

export interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
};

const authApi = new AuthApi();
const oauthApi = new OauthApi();

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async (_: void) => {
    const url = `${SERVER_HOST}/user`;
    return fetch(url).then(res => res.json());
  }
);

// Thunk для входа
export const loginThunk = createAsyncThunk(
  'user/login',
  async (model: LoginRequestData, { rejectWithValue }) => {
    try {
      // Шаг 1: Выполняем вход
      const loginResult = await authApi.login(model);

      // Если ошибка авторизации — возвращаем её
      if (isApiError(loginResult)) {
        return rejectWithValue(loginResult as APIError);
      }

      // Шаг 2: Получаем данные пользователя
      const userResult = await authApi.me();

      // Если ошибка при получении данных — возвращаем её
      if (isApiError(userResult)) {
        return rejectWithValue(userResult as APIError);
      }

      return userResult as User; // Возвращаем пользователя
    } catch (err) {
      return rejectWithValue({ reason: 'Произошла ошибка' } as APIError);
    }
  }
);

// Thunk для OAuth-входа через Яндекс
export const oauthLoginThunk = createAsyncThunk(
  'user/oauthLogin',
  async (
    { code, redirectUri }: { code: string; redirectUri: string },
    { rejectWithValue }
  ) => {
    try {
      const signInResult = await oauthApi.signIn(code, redirectUri);

      if (isApiError(signInResult)) {
        return rejectWithValue(signInResult as APIError);
      }

      const userResult = await authApi.me();

      if (isApiError(userResult)) {
        return rejectWithValue(userResult as APIError);
      }

      return userResult as User;
    } catch (err) {
      return rejectWithValue({
        reason: 'Ошибка OAuth-авторизации',
      } as APIError);
    }
  }
);

// Thunk для регистрации
export const registerThunk = createAsyncThunk(
  'user/register',
  async (model: CreateUser, { rejectWithValue }) => {
    try {
      const result = await authApi.create(model);
      if (isApiError(result)) {
        return rejectWithValue(result as APIError);
      }
      return result as User;
    } catch (err) {
      return rejectWithValue({ reason: 'Произошла ошибка' } as APIError);
    }
  }
);

// Thunk для выхода
export const logoutThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApi.logout();
      if (isApiError(result)) {
        return rejectWithValue(result as APIError);
      }
      return null;
    } catch (err) {
      return rejectWithValue({ reason: 'Ошибка при выходе' } as APIError);
    }
  }
);

// Thunk для проверки авторизации
export const checkUserThunk = createAsyncThunk(
  'user/checkUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApi.me();
      if (isApiError(result)) {
        if ((result as APIError).status === 401) {
          return null; // Не считаем 401 ошибкой для checkUser
        }
        return rejectWithValue(result as APIError);
      }
      return result as User;
    } catch (err) {
      return rejectWithValue({
        reason: 'Ошибка проверки авторизации',
      } as APIError);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Оставляем для ручного управления
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
    },
    clearUser: state => {
      state.data = null;
    },
  },
  extraReducers: builder => {
    builder
      // loginThunk
      .addCase(loginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as APIError).reason || 'Ошибка входа';
      })

      // oauthLoginThunk
      .addCase(oauthLoginThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(oauthLoginThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(oauthLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as APIError).reason || 'Ошибка OAuth-авторизации';
      })

      // registerThunk
      .addCase(registerThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as APIError).reason || 'Ошибка регистрации';
      })

      // logoutThunk
      .addCase(logoutThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.data = null;
        state.isLoading = false;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as APIError).reason || 'Ошибка выхода';
      })

      // checkUserThunk
      .addCase(checkUserThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserThunk.fulfilled, (state, action) => {
        state.data = action.payload; // Может быть null (если 401)
        state.isLoading = false;
      })
      .addCase(checkUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as APIError).reason || 'Ошибка проверки';
      })
      .addCase(fetchUserThunk.pending.type, state => {
        state.data = null;
        state.isLoading = true;
      })
      .addCase(
        fetchUserThunk.fulfilled.type,
        (state, { payload }: PayloadAction<User>) => {
          state.data = payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchUserThunk.rejected.type, state => {
        state.isLoading = false;
      });
  },
});

export const selectUser = (state: RootState) => state.user.data;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
