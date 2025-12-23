import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SERVER_HOST } from '../constants';
import { User } from '../api/type';

export interface UserState {
  data: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  data: null,
  isLoading: false,
};

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async (_: void) => {
    const url = `${SERVER_HOST}/user`;
    return fetch(url).then(res => res.json());
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
    },
    // Опционально: очистка данных
    clearUser: state => {
      state.data = null;
    },
  },
  extraReducers: builder => {
    builder
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

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
