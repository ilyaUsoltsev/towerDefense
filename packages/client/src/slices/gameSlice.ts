import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tile } from '../pages/Game/core/utils/types';
import { CannonType } from '../pages/Game/constants/cannons-config';

export interface SelectedEntity {
  type: CannonType;
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
  selectedCannon: CannonType | null;
  waveNumber: number;
}

const initialState: UserState = {
  hp: 0, // will be initialized on game start
  money: 0, // will be initialized on game start
  selectedEntity: null,
  selectedCannon: null,
  blockingPath: false,
  waveNumber: 0,
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
    gameSelectCannon: (state, action: PayloadAction<CannonType | null>) => {
      state.selectedCannon = action.payload;
    },
    gameSetWaveNumber: (state, action: PayloadAction<number>) => {
      state.waveNumber = action.payload;
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
  gameSelectCannon,
  gameSetWaveNumber,
} = gameSlice.actions;

export default gameSlice.reducer;
