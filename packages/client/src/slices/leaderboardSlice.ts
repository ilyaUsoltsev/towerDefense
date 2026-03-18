import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import LeaderboardApi from '../api/leaderboard';
import { httpClient } from '../api/httpClientInstance';
import { selectUser } from './userSlice';
import type { LeaderboardEntry } from '../api/type';

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

export type AddLeaderboardResultPayload = { score: number; isWin: boolean };
export type FetchLeaderboardPayload = {
  cursor?: number;
  limit?: number;
};

// Отправить результат в лидерборд по окончанию игры. Перезапишется только если новыйсчёт больше
export const addLeaderboardResultThunk = createAsyncThunk<
  void,
  AddLeaderboardResultPayload,
  { rejectValue: string }
>('leaderboard/addResult', async (payload, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const user = selectUser(state);
  const data = leaderboardApi.mapUserToEntryData(
    user ?? null,
    payload.score,
    payload.isWin
  );
  try {
    await leaderboardApi.addResult(data);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Ошибка отправки результата'
    );
  }
});

// Подтягивает лидерборд с бэкенда
export const fetchLeaderboardThunk = createAsyncThunk<
  LeaderboardEntry[],
  FetchLeaderboardPayload | void,
  { rejectValue: string }
>('leaderboard/fetch', async (arg = {}, { rejectWithValue }) => {
  const { cursor = 0, limit = 10 } = arg ?? {};
  try {
    return await leaderboardApi.getLeaderboard(cursor, limit);
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Ошибка загрузки лидерборда'
    );
  }
});

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
        state.error =
          action.payload ??
          action.error?.message ??
          'Ошибка загрузки лидерборда';
      })
      .addCase(addLeaderboardResultThunk.pending, state => {
        state.error = null;
      })
      .addCase(addLeaderboardResultThunk.fulfilled, state => {
        state.error = null;
      })
      .addCase(addLeaderboardResultThunk.rejected, (state, action) => {
        state.error =
          action.payload ??
          action.error?.message ??
          'Ошибка отправки результата';
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
