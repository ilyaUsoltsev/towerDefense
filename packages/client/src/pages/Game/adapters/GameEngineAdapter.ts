import type { Store } from '@reduxjs/toolkit';

import { RootState } from '../../../store';
import GameEngine from '../core/gameEngine';

import {
  gameSelectEntity,
  gameInitializeState,
  gameSetHp,
  gameSetMoney,
  gameSetWaveNumber,
} from '../../../slices/gameSlice';
import { GameConfig } from '../core/utils/config';
import { getCannonState } from './get-cannon-state';
import { eventBus } from '../core/utils/eventBus';

/**
 * Этот адаптер синхронизирует состояние между GameEngine и Redux store.
 * Он слушает события из GameEngine и диспатчит соответствующие действия Redux.
 * Он также слушает изменения в хранилище Redux и обновляет состояние GameEngine соответственно.
 */
export class GameEngineAdapter {
  private unsubSink: (() => void)[] = [];
  constructor(private gameEngine: GameEngine, private store: Store) {}

  // Этот метод обеспечивает синхронизацию от движка к Redux
  // Все события должны начинаться с "redux:"
  init() {
    const unsubInit = eventBus.on('redux:gameInitialize', () => {
      this.store.dispatch(
        gameInitializeState({
          hp: GameConfig.hp,
          money: GameConfig.initialMoney,
        })
      );
    });

    const waveStartedUnsub = eventBus.on(
      'redux:waveStarted',
      ({ waveNumber }) => {
        this.store.dispatch(gameSetWaveNumber(waveNumber));
      }
    );

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

    this.unsubSink = [
      unsubInit,
      unsubHp,
      unsubCannonClick,
      unsubMoney,
      waveStartedUnsub,
    ];
  }

  // Этот метод обеспечивает синхронизацию от Redux к движку
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

    // selectedCannon может быть null, чтобы отменить размещение, поэтому мы передаем его напрямую
    this.gameEngine.mapManager.setPlacingCannonType(state.game.selectedCannon);
  }

  removeSubscriptions() {
    this.unsubSink.forEach(unsub => unsub());
    this.unsubSink.length = 0;
  }
}
