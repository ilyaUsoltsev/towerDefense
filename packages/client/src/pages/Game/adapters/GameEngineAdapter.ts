import type { Store } from '@reduxjs/toolkit';

import { RootState } from '../../../store';
import GameEngine from '../core/gameEngine';
import { eventBus } from '../core/eventBus';
import { gameRemoveHp } from '../../../slices/gameSlice';

export class EngineAdapter {
  constructor(private gameEngine: GameEngine, private store: Store) {}

  // This methods provides Engine → Redux syncronization
  init() {
    eventBus.on('redux:enemyReachedFinish', () => {
      this.store.dispatch(gameRemoveHp());
    });
  }

  // This method provides Redux → Engine syncronization
  syncState(state: RootState) {
    if (state.game.hp <= 0) {
      this.gameEngine.stop();
    }
  }
}
