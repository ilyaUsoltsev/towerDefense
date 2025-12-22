import CannonManager from './cannonManager';
import MapManager from './mapManager';
import PathManager from './pathManager';
import { eventBus } from './eventBus';
import EnemyManager from './enemyManager';

class GameEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private mapManager!: MapManager;
  private cannonManager!: CannonManager;
  private enemyManager!: EnemyManager;
  private pathManager!: PathManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
  }

  async initialize() {
    this.mapManager = new MapManager(this.context);
    this.cannonManager = new CannonManager(this.context);
    this.pathManager = new PathManager(
      this.context,
      this.mapManager.getStartTile(),
      this.mapManager.getFinishTile()
    );

    await this.pathManager.setCollisionMap(this.mapManager.collisionMap);

    this.enemyManager = new EnemyManager(
      this.context,
      this.pathManager,
      this.mapManager.getTiles('Start')[0],
      2000
    );

    // Generate initial enemies
    // this.enemyManager.generateEnemies(0, GameConfig.enemy.defaultHealth);

    // Start auto-spawning
    this.enemyManager.startSpawning();

    this.canvas.width = this.mapManager.mapWidth * this.mapManager.tileSize;
    this.canvas.height = this.mapManager.mapHeight * this.mapManager.tileSize;
  }

  async start() {
    await this.initialize();
    this.loop(0);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.cannonManager.removeEventListeners();
    this.mapManager.removeEventListeners();
    this.enemyManager.removeEventListeners();
    this.pathManager.removeEventListeners();
    eventBus.clear();
  }

  private loop = (timestamp: number) => {
    this.render(timestamp);
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private render(timestamp: number) {
    const currentTime = timestamp;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mapManager.renderGameField();
    this.mapManager.renderWalls();
    this.mapManager.renderStart();
    this.mapManager.renderFinish();
    this.pathManager.renderPathStartFinish();
    this.enemyManager.update(currentTime);
    this.cannonManager.update(this.enemyManager.getAliveEnemies());
    this.cannonManager.render();
    this.enemyManager.render();
  }
}

export default GameEngine;
