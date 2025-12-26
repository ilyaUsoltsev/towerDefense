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
  'redux:gameInitialize': null;
  'mapManager:cannonPlaced': { tile: Tile; cannonType: CannonType };
  'mapManager:tryAddCannon': {
    cannonTile: Tile;
    collisionMap: number[][];
    cannonType: CannonType;
  };
  'redux:selectedCannon': { x: number; y: number };
  'pathManager:pathUpdated': Tile[];
  'redux:setMoney': { money: number };
  'redux:setPlayerHp': { hp: number };
}

export type GameEventName = keyof GameEvents;
export type GameEventPayload<T extends GameEventName> = GameEvents[T];
