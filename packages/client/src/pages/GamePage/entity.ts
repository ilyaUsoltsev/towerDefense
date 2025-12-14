import { eventBus } from './eventBus';
import PathManager from './pathManager';
import { Point, Tile } from './types';

class Entity {
  path: Tile[] = [];
  currentPosition: Point;
  speed = 1;
  currentIndex: number;
  pathManager: PathManager;
  health: number;
  maxHealth: number;
  isDestroyed: boolean;

  constructor(start: Tile, pathManager: PathManager, health = 100) {
    this.pathManager = pathManager;
    this.currentPosition = {
      x: start.x * 32 + 16,
      y: start.y * 32 + 16,
    };
    this.currentIndex = 0;
    this.health = health;
    this.maxHealth = health;
    this.isDestroyed = false;
    this.addEventListeners();
    this.path = this.pathManager.getStartFinishPath();
  }

  setPath(path: Tile[]) {
    this.path = path;
  }

  moveAlongPath() {
    if (this.path.length === 0) {
      return;
    }

    const nextTile = this.path[this.currentIndex + 1];

    if (this.hasReachedEnd()) {
      return;
    }

    if (!nextTile) return;

    const targetPosition = {
      x: nextTile.x * 32 + 16,
      y: nextTile.y * 32 + 16,
    };

    const dx = targetPosition.x - this.currentPosition.x;
    const dy = targetPosition.y - this.currentPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.currentPosition = targetPosition;
      this.currentIndex++;
    } else {
      this.currentPosition.x += (dx / distance) * this.speed;
      this.currentPosition.y += (dy / distance) * this.speed;
    }
  }

  getPosition(): Point {
    return this.currentPosition;
  }

  hasReachedEnd(): boolean {
    return this.currentIndex >= this.path.length - 1;
  }

  takeHit(damage: number): void {
    if (this.isDestroyed) return;

    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.isDestroyed = true;
    }
  }

  getHealth(): number {
    return this.health;
  }

  getMaxHealth(): number {
    return this.maxHealth;
  }

  destroyed(): boolean {
    return this.isDestroyed;
  }

  render(context: CanvasRenderingContext2D) {
    this.moveAlongPath();

    // Render entity circle
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(
      this.currentPosition.x,
      this.currentPosition.y,
      10,
      0,
      2 * Math.PI
    );
    context.fill();

    // Render health bar
    const healthBarWidth = 30;
    const healthBarHeight = 4;
    const healthBarX = this.currentPosition.x - healthBarWidth / 2;
    const healthBarY = this.currentPosition.y - 18;
    const healthPercentage = this.health / this.maxHealth;

    // Background
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    // Health
    context.fillStyle =
      healthPercentage > 0.5
        ? 'green'
        : healthPercentage > 0.25
        ? 'yellow'
        : 'red';
    context.fillRect(
      healthBarX,
      healthBarY,
      healthBarWidth * healthPercentage,
      healthBarHeight
    );
  }

  private addEventListeners() {
    eventBus.on('pathManager:pathUpdated', () => {
      const currentPositionTile: Tile = {
        x: Math.floor(this.currentPosition.x / 32),
        y: Math.floor(this.currentPosition.y / 32),
        id: 'current',
      };
      this.pathManager
        .getPath(currentPositionTile)
        .then((newPathForEntity: Tile[]) => {
          this.setPath(newPathForEntity);
          this.currentIndex = 0;
        });
    });
  }
}

export default Entity;
