export interface Point {
  x: number;
  y: number;
}

export interface Tile {
  x: number;
  y: number;
  id: string;
}

export interface CannonData {
  position: Tile;
  range: number;
}

export interface Projectile {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
}

/**
 * Central event definitions for game-wide communication
 */
export interface GameEvents {
  'pathManager:pathUpdated': Tile[];
  'mapManager:cannonPlaced': Tile;
  'mapManager:tryAddCannon': { cannonTile: Tile; collisionMap: (0 | 1)[][] };
}

export type GameEventName = keyof GameEvents;
export type GameEventPayload<T extends GameEventName> = GameEvents[T];
