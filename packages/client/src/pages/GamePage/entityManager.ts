import Entity from './entity';
import PathManager from './pathManager';
import { Tile } from './types';

class EntityManager {
  entities: Entity[] = [];
  pathManager: PathManager;
  startTile: Tile;
  context: CanvasRenderingContext2D;
  spawnInterval: number;
  lastSpawnTime: number;
  isSpawning: boolean;

  constructor(
    context: CanvasRenderingContext2D,
    pathManager: PathManager,
    startTile: Tile,
    spawnInterval = 2000
  ) {
    this.context = context;
    this.pathManager = pathManager;
    this.startTile = startTile;
    this.spawnInterval = spawnInterval;
    this.lastSpawnTime = 0;
    this.isSpawning = false;
  }

  addEntity(health = 100): Entity {
    const entity = new Entity(this.startTile, this.pathManager, health);
    this.entities.push(entity);
    return entity;
  }

  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }

  generateEntities(count: number, health = 100): void {
    for (let i = 0; i < count; i++) {
      this.addEntity(health);
    }
  }

  startSpawning(): void {
    this.isSpawning = true;
  }

  stopSpawning(): void {
    this.isSpawning = false;
  }

  setSpawnInterval(interval: number): void {
    this.spawnInterval = interval;
  }

  update(currentTime: number): void {
    // Auto-spawn entities if spawning is enabled
    if (
      this.isSpawning &&
      currentTime - this.lastSpawnTime >= this.spawnInterval
    ) {
      this.addEntity();
      this.lastSpawnTime = currentTime;
    }

    // Remove destroyed or finished entities
    this.entities = this.entities.filter(
      entity => !entity.destroyed() && !entity.hasReachedEnd()
    );
  }

  render(): void {
    this.entities.forEach(entity => {
      entity.render(this.context);
    });
  }

  getEntities(): Entity[] {
    return this.entities;
  }

  getAliveEntities(): Entity[] {
    return this.entities.filter(entity => !entity.destroyed());
  }

  getEntityCount(): number {
    return this.entities.length;
  }

  clearAll(): void {
    this.entities = [];
  }
}

export default EntityManager;
