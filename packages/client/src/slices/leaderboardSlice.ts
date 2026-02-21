import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import LeaderboardApi from '../api/leaderboard';
import { HttpClient } from '../utils/httpClient';
import type { APIError } from '../api/type';

const isApiErrorResponse = (r: unknown): r is APIError =>
  typeof r === 'object' && r !== null && 'status' in r;
import { LEADERBOARD_RATING_FIELD_NAME } from '../constants/leaderboard';
import { selectUser } from './userSlice';
import type { LeaderboardEntry } from '../api/type';

const httpClient = new HttpClient({
  baseUrl: 'https://ya-praktikum.tech/api/v2',
});
const leaderboardApi = new LeaderboardApi(httpClient);

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  entries: [],
  isLoading: false,
  error: null,
};

// Отправить результат в лидерборд по окончанию игры. Перезапишется только если новыйсчёт больше
export const addLeaderboardResultThunk = createAsyncThunk(
  'leaderboard/addResult',
  async (
    payload: { score: number; isWin: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const user = selectUser(state);
    const data: Record<string, unknown> = {
      [LEADERBOARD_RATING_FIELD_NAME]: payload.score,
      isWin: payload.isWin,
    };
    if (user?.login) {
      data.login = user.login;
    }
    const result = await leaderboardApi.addResult(data);
    if (result && isApiErrorResponse(result)) {
      return rejectWithValue(result.reason ?? result.message ?? 'Ошибка');
    }
  }
);

// Подтягивает лидерборд с бэкенда
export const fetchLeaderboardThunk = createAsyncThunk(
  'leaderboard/fetch',
  async (
    { cursor = 0, limit = 10 }: { cursor?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    const result = await leaderboardApi.getLeaderboard(cursor, limit);
    if (result && isApiErrorResponse(result)) {
      return rejectWithValue(
        result.reason ?? result.message ?? 'Ошибка загрузки лидерборда'
      );
    }
    return (result ?? []) as LeaderboardEntry[];
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearLeaderboardError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLeaderboardThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboardThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload;
        state.error = null;
      })
      .addCase(fetchLeaderboardThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLeaderboardError } = leaderboardSlice.actions;

export const selectLeaderboardEntries = (state: RootState) =>
  state.leaderboard.entries;
export const selectLeaderboardLoading = (state: RootState) =>
  state.leaderboard.isLoading;
export const selectLeaderboardError = (state: RootState) =>
  state.leaderboard.error;

export default leaderboardSlice.reducer;
