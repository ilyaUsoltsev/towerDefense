import type { Store } from '@reduxjs/toolkit';

import { RootState } from '../../../store';
import GameEngine from '../core/gameEngine';
import { eventBus } from '../core/eventBus';
import {
  gameSelectEntity,
  gameInitializeState,
  gameSetHp,
  gameSetMoney,
} from '../../../slices/gameSlice';
import { GameConfig } from '../core/config';
import { getCannonState } from '../core/utils/get-cannon-state';

/**
 * This class is an adapter between GameEngine and Redux store.
 * It listens to GameEngine events and dispatches corresponding Redux actions.
 * It also listens to Redux store changes and updates the GameEngine state accordingly.
 */
export class GameEngineAdapter {
  private unsubSink: (() => void)[] = [];
  constructor(private gameEngine: GameEngine, private store: Store) {}

  // This methods provides Engine → Redux syncronization
  // All event should start with "redux:"
  init() {
    const unsubInit = eventBus.on('redux:gameInitialize', () => {
      this.store.dispatch(
        gameInitializeState({
          hp: GameConfig.hp,
          money: GameConfig.initialMoney,
        })
      );
    });

    const unsubHp = eventBus.on('redux:setPlayerHp', ({ hp }) => {
      this.store.dispatch(gameSetHp(hp));
    });

    const unsubMoney = eventBus.on('redux:setMoney', ({ money }) => {
      this.store.dispatch(gameSetMoney(money));
    });

    const unsubCannonClick = eventBus.on('redux:selectedCannon', position => {
      const cannon =
        this.gameEngine.cannonManager.getCannonAtPosition(position);
      if (cannon) {
        this.store.dispatch(gameSelectEntity(getCannonState(cannon)));
      }
    });

    this.unsubSink = [unsubInit, unsubHp, unsubCannonClick, unsubMoney];
  }

  // This method provides Redux → Engine syncronization
  syncState(state: RootState) {
    if (state.game.selectedEntity?.selling) {
      const moneyBalance = this.gameEngine.sellCannon(
        state.game.selectedEntity.id
      );
      this.store.dispatch(gameSelectEntity(null));
      this.store.dispatch(gameSetMoney(moneyBalance));
    }

    if (state.game.selectedEntity?.upgrading) {
      const success = this.gameEngine.upgradeCannon(
        state.game.selectedEntity.id
      );
      if (success !== null) {
        const cannon = this.gameEngine.cannonManager.getCannonById(
          state.game.selectedEntity.id
        );
        if (cannon) {
          this.store.dispatch(gameSelectEntity(getCannonState(cannon)));
          this.store.dispatch(gameSetMoney(success));
        }
      }
    }

    // Additional state sync logic can be added here
  }

  removeSubscriptions() {
    this.unsubSink.forEach(unsub => unsub());
    this.unsubSink = [];
  }
}
