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
  'mapManager:collisionMap': (0 | 1)[][];
  'pathManager:pathUpdated': Tile[];
  'mapManager:cannonPlaced': Tile;
}

export type GameEventName = keyof GameEvents;
export type GameEventPayload<T extends GameEventName> = GameEvents[T];
