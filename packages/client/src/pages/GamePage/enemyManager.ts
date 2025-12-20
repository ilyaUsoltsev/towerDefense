import Enemy from './enemy';
import { GameConfig } from './game/config';
import PathManager from './pathManager';
import { Tile } from './types';

class EnemyManager {
  enemies: Enemy[] = [];
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

  addEnemy(health: number): Enemy {
    const enemy = new Enemy(this.startTile, this.pathManager, health);
    this.enemies.push(enemy);
    return enemy;
  }

  removeEnemy(enemy: Enemy): void {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
  }

  generateEnemies(count: number, health: number): void {
    for (let i = 0; i < count; i++) {
      this.addEnemy(health);
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
      this.addEnemy(GameConfig.enemy.defaultHealth);
      this.lastSpawnTime = currentTime;
    }

    // Remove destroyed or finished entities
    this.enemies = this.enemies.filter(
      enemy => !enemy.destroyed() && !enemy.hasReachedEnd()
    );
  }

  render(): void {
    this.enemies.forEach(enemy => {
      enemy.render(this.context);
    });
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  getAliveEnemies(): Enemy[] {
    return this.enemies.filter(enemy => !enemy.destroyed());
  }

  getEnemyCount(): number {
    return this.enemies.length;
  }

  clearAll(): void {
    this.enemies = [];
  }
}

export default EnemyManager;
