export interface Point {
  x: number;
  y: number;
}

export interface Tile {
  x: number;
  y: number;
  id: string;
}

/**
 * Central event definitions for game-wide communication
 */
export interface GameEvents {
  'mapManager:collisionMap': (0 | 1)[][];
  'pathManager:pathUpdated': Tile[];
}

export type GameEventName = keyof GameEvents;
export type GameEventPayload<T extends GameEventName> = GameEvents[T];
