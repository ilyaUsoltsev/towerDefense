export interface Point {
  x: number;
  y: number;
}

export interface Tile extends Point {
  id: string;
}

export interface CannonData {
  position: Tile;
  range: number;
}

/**
 * Central event definitions for game-wide communication
 */
export interface GameEvents {
  'pathManager:pathUpdated': Tile[];
  'mapManager:cannonPlaced': Tile;
  'mapManager:tryAddCannon': { cannonTile: Tile; collisionMap: (0 | 1)[][] };
  'redux:enemyReachedFinish': null;
}

export type GameEventName = keyof GameEvents;
export type GameEventPayload<T extends GameEventName> = GameEvents[T];
