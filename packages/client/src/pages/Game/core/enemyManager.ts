import Enemy from './enemy';
import { GameConfig } from './config';
import PathManager from './pathManager';
import { Tile } from './types';
import { eventBus } from './eventBus';
import Player from './player';

class EnemyManager {
  enemies: Enemy[] = [];
  pathManager: PathManager;
  startTile: Tile;
  player: Player;
  context: CanvasRenderingContext2D;
  spawnInterval: number;
  lastSpawnTime: number;
  isSpawning: boolean;
  private unsubscribe!: () => void;

  constructor(
    context: CanvasRenderingContext2D,
    pathManager: PathManager,
    startTile: Tile,
    player: Player
  ) {
    this.context = context;
    this.pathManager = pathManager;
    this.startTile = startTile;
    this.player = player;
    this.spawnInterval = GameConfig.spawn.interval;
    this.lastSpawnTime = 0;
    this.isSpawning = false;
    this.addEventListeners();
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

    // Update all enemies
    this.enemies.forEach(enemy => {
      enemy.update();
      if (enemy.hasReachedEnd()) {
        this.handleEnemyReachedEnd();
      }
    });

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

  getEnemyCount(): number {
    return this.enemies.length;
  }

  clearAll(): void {
    this.enemies = [];
  }

  removeEventListeners(): void {
    this.unsubscribe();
  }

  private handleEnemyReachedEnd() {
    const remainingHp = this.player.takeDamage();

    eventBus.emit('redux:setPlayerHp', {
      hp: remainingHp,
    });
  }

  private addEventListeners() {
    this.unsubscribe = eventBus.on('pathManager:pathUpdated', async () => {
      const pathUpdatePromises = this.enemies.map(async enemy => {
        const currentPositionTile: Tile = {
          x: Math.floor(enemy.currentPosition.x / GameConfig.tileSize),
          y: Math.floor(enemy.currentPosition.y / GameConfig.tileSize),
          id: 'current',
        };
        const newPathForEnemy = await this.pathManager.getPath(
          currentPositionTile
        );
        enemy.setPath(newPathForEnemy);
        enemy.currentIndex = 0;
      });

      try {
        await Promise.all(pathUpdatePromises);
      } catch (error) {
        console.error('Error updating enemy paths:', error);
      }
    });
  }
}

export default EnemyManager;
