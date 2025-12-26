import CannonManager from './managers/cannonManager';
import MapManager from './managers/mapManager';
import PathManager from './managers/pathManager';
import { eventBus } from './utils/eventBus';
import EnemyManager from './managers/enemyManager';
import Player from './entities/player';

class GameEngine {
  mapManager!: MapManager;
  cannonManager!: CannonManager;
  pathManager!: PathManager;
  private context: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private enemyManager!: EnemyManager;
  private animationFrameId: number | null = null;
  private player!: Player;
  private lastFrameTime = 0;
  private readonly targetFPS = 60;
  private readonly frameInterval = 1000 / this.targetFPS;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
  }

  async initialize() {
    this.player = new Player();
    this.mapManager = new MapManager(this.context, this.player);
    this.cannonManager = new CannonManager(this.context, this.player);
    this.pathManager = new PathManager(
      this.context,
      this.mapManager.getStartTile(),
      this.mapManager.getFinishTile(),
      this.player
    );

    await this.pathManager.setCollisionMap(this.mapManager.collisionMap);

    this.enemyManager = new EnemyManager(
      this.context,
      this.pathManager,
      this.mapManager.getStartTile(),
      this.player
    );

    // Generate initial enemies
    // this.enemyManager.generateEnemies(0, GameConfig.enemy.defaultHealth);

    // Start auto-spawning
    this.enemyManager.startSpawning();

    this.canvas.width = this.mapManager.mapWidth * this.mapManager.tileSize;
    this.canvas.height = this.mapManager.mapHeight * this.mapManager.tileSize;
    eventBus.emit('redux:gameInitialize', null);
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

  sellCannon(cannonId: string) {
    const [cannon, soldFor] = this.cannonManager.sellCannon(cannonId);
    if (cannon) {
      this.player.addMoney(soldFor);
      const collisionMap = this.mapManager.collisionMap;
      collisionMap[cannon.position.y][cannon.position.x] = 0; // Free the tile
      this.pathManager.setCollisionMap(this.mapManager.collisionMap);
    }
    return this.player.getMoney();
  }

  upgradeCannon(cannonId: string): number | null {
    const cannon = this.cannonManager.getCannonById(cannonId);
    if (cannon) {
      console.log(cannon.getUpgradeCost(), 'cost');
      if (this.player.haveEnoughMoney(cannon.getUpgradeCost()) === false) {
        return null;
      }
      // Deduct money before upgrading!
      this.player.subtractMoney(cannon.getUpgradeCost());

      this.cannonManager.upgradeCannon(cannonId);
      return this.player.getMoney();
    }

    return null;
  }

  private loop = (timestamp: number) => {
    this.animationFrameId = requestAnimationFrame(this.loop);

    // Adjust for target FPS
    // Otherwise on different monitors the game speed would vary
    const deltaTime = timestamp - this.lastFrameTime;
    if (deltaTime >= this.frameInterval) {
      this.lastFrameTime = timestamp - (deltaTime % this.frameInterval);
      this.render(timestamp);
    }
  };

  private render(timestamp: number) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mapManager.renderGameField();
    this.mapManager.renderWalls();
    this.mapManager.renderStart();
    this.mapManager.renderFinish();
    this.pathManager.renderPathStartFinish();
    this.enemyManager.update(timestamp);
    this.cannonManager.update(this.enemyManager.getEnemies(), timestamp);
    this.cannonManager.render();
    this.enemyManager.render();
    this.mapManager.renderCursorTile();
  }
}

export default GameEngine;
