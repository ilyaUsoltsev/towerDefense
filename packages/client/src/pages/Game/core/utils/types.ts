import { CannonType } from '../../constants/cannons-config';

export interface Point {
  x: number;
  y: number;
}

export interface Tile extends Point {
  id?: string;
}

export interface CannonData {
  position: Tile;
  range: number;
}

/**
 * Central event definitions for game-wide communication
 */
export interface GameEvents {
  'mapManager:cannonPlaced': { tile: Tile; cannonType: CannonType };
  'mapManager:tryAddCannon': {
    cannonTile: Tile;
    collisionMap: number[][];
    cannonType: CannonType;
  };
  'pathManager:pathUpdated': Tile[];
  'redux:waveStarted': { waveNumber: number };
  'redux:gameInitialize': { hp: number; money: number };
  'redux:selectedCannon': { x: number; y: number };
  'redux:setMoney': { money: number };
  'redux:setPlayerHp': { hp: number };
}

export type GameEventName = keyof GameEvents;
export type GameEventPayload<T extends GameEventName> = GameEvents[T];
