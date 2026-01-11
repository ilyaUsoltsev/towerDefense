import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tile } from '../pages/Game/core/utils/types';
import { CannonType } from '../pages/Game/constants/cannons-config';
import { isUpgradable } from './utils/is-upgradable';

export interface SelectedEntity {
  type: CannonType;
  id: string;
  position: Tile;
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
  waveNumber: number | null;
  pendingSellCannonId: string | null;
  pendingUpgradeCannonId: string | null;
}

const initialState: UserState = {
  hp: 0, // инициализируется при старте игры
  money: 0, // инициализируется при старте игры
  selectedEntity: null,
  selectedCannon: null,
  blockingPath: false,
  waveNumber: null,
  pendingSellCannonId: null,
  pendingUpgradeCannonId: null,
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
      state.selectedCannon = null;
      state.selectedEntity = action.payload;
    },
    gameSellSelectedEntity: state => {
      if (state.selectedEntity) {
        state.pendingSellCannonId = state.selectedEntity.id;
      }
      state.selectedCannon = null;
    },
    gameSetBlockingPath: (state, action: PayloadAction<boolean>) => {
      state.blockingPath = action.payload;
    },
    gameSetHp: (state, action: PayloadAction<number>) => {
      state.hp = action.payload;
    },
    gameUpgradeSelectedEntity: state => {
      if (!state.selectedEntity) {
        return;
      }

      if (isUpgradable(state.money, state.selectedEntity)) {
        state.pendingUpgradeCannonId = state.selectedEntity.id;
      }
    },
    gameSelectCannon: (state, action: PayloadAction<CannonType | null>) => {
      state.selectedEntity = null;
      state.selectedCannon = action.payload;
    },
    gameSetWaveNumber: (state, action: PayloadAction<number>) => {
      state.waveNumber = action.payload;
    },
    gameClearSellCommand: state => {
      state.pendingSellCannonId = null;
    },
    gameClearUpgradeCommand: state => {
      state.pendingUpgradeCannonId = null;
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
  gameClearSellCommand,
  gameClearUpgradeCommand,
} = gameSlice.actions;

export default gameSlice.reducer;
