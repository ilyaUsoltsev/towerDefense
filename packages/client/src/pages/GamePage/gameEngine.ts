import CannonManager from './cannonManager';
import EntityManager from './entityManager';
import MapManager from './mapManager';
import PathManager from './pathManager';
import { eventBus } from './eventBus';

class GameEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private mapManager!: MapManager;
  private cannonManager!: CannonManager;
  private entityManager!: EntityManager;
  private pathManager!: PathManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
  }

  async initialize() {
    this.mapManager = new MapManager(this.context);
    this.cannonManager = new CannonManager(
      this.context,
      this.mapManager.tileSize
    );
    this.pathManager = new PathManager(
      this.context,
      this.mapManager.getStartTile(),
      this.mapManager.getFinishTile()
    );

    await this.pathManager.setCollisionMap(this.mapManager.collisionMap);

    this.entityManager = new EntityManager(
      this.context,
      this.pathManager,
      this.mapManager.getTiles('Start')[0],
      2000
    );

    // Generate initial entities
    this.entityManager.generateEntities(3, 100);

    // Start auto-spawning
    this.entityManager.startSpawning();

    this.canvas.width = this.mapManager.mapWidth * this.mapManager.tileSize;
    this.canvas.height = this.mapManager.mapHeight * this.mapManager.tileSize;
  }

  async start() {
    await this.initialize();
    this.loop();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    eventBus.clear();
    this.mapManager?.removeEventListeners();
  }

  private loop = () => {
    this.render();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private render() {
    const currentTime = Date.now();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mapManager.renderGameField();
    this.mapManager.renderWalls();
    this.mapManager.renderStart();
    this.mapManager.renderFinish();
    this.pathManager.renderPathStartFinish();
    this.entityManager.update(currentTime);
    this.cannonManager.update(this.entityManager.getAliveEntities());
    this.cannonManager.render();
    this.entityManager.render();
  }
}

export default GameEngine;
