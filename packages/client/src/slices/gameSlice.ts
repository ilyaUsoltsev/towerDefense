import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tile } from '../pages/Game/core/types';

export interface SelectedEntity {
  type: 'enemy' | 'cannon';
  id: string;
  position: Tile;
  selling: boolean;
  upgrading: boolean;
  level: number;
  damage: number;
  range: number;
  fireRate: number;
  upgradeCost: number;
}

export interface UserState {
  hp: number;
  money: number;
  selectedEntity: SelectedEntity | null;
  blockingPath: boolean;
}

const initialState: UserState = {
  hp: 0, // will be initialized on game start
  money: 0, // will be initialized on game start
  selectedEntity: null,
  blockingPath: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    gameInitializeState: (
      state,
      action: PayloadAction<{ hp: number; money: number }>
    ) => {
      state.hp = action.payload.hp;
      state.money = action.payload.money;
    },
    gameSetMoney: (state, action: PayloadAction<number>) => {
      state.money = action.payload;
    },
    gameSelectEntity: (state, action: PayloadAction<SelectedEntity | null>) => {
      state.selectedEntity = action.payload;
    },
    gameSellSelectedEntity: state => {
      if (state.selectedEntity) {
        state.selectedEntity.selling = true;
      }
    },
    gameSetBlockingPath: (state, action: PayloadAction<boolean>) => {
      state.blockingPath = action.payload;
    },
    gameSetHp: (state, action: PayloadAction<number>) => {
      state.hp = action.payload;
    },
    gameUpgradeSelectedEntity: state => {
      if (state.selectedEntity) {
        state.selectedEntity.upgrading = true;
      }
    },
  },
});

export const {
  gameInitializeState,
  gameSetMoney,
  gameSelectEntity,
  gameSetBlockingPath,
  gameSetHp,
  gameSellSelectedEntity,
  gameUpgradeSelectedEntity,
} = gameSlice.actions;

export default gameSlice.reducer;
