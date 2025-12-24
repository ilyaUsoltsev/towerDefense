import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SelectedEntity {
  type: 'enemy' | 'cannon';
  id: string;
}

export interface UserState {
  hp: number;
  money: number;
  selectedEntity: SelectedEntity | null;
  blockingPath: boolean;
}

const initialState: UserState = {
  hp: 10,
  money: 1000,
  selectedEntity: null,
  blockingPath: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    gameAddMoney: (state, action: PayloadAction<number>) => {
      state.money += action.payload;
    },
    gameSelectEntity: (state, action: PayloadAction<SelectedEntity | null>) => {
      state.selectedEntity = action.payload;
    },
    gameSetBlockingPath: (state, action: PayloadAction<boolean>) => {
      state.blockingPath = action.payload;
    },
    gameRemoveHp: state => {
      state.hp -= 1;
    },
  },
});

export const {
  gameAddMoney,
  gameSelectEntity,
  gameSetBlockingPath,
  gameRemoveHp,
} = gameSlice.actions;

export default gameSlice.reducer;
