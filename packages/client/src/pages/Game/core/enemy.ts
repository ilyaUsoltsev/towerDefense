import { GameConfig } from './config';
import PathManager from './pathManager';
import { Point, Tile } from './types';

class Enemy {
  path: Tile[] = [];
  currentPosition: Point;
  speed = GameConfig.enemy.defaultSpeed;
  currentIndex: number;
  pathManager: PathManager;
  health: number;
  maxHealth: number;
  isDestroyed: boolean;

  constructor(start: Tile, pathManager: PathManager, health: number) {
    this.pathManager = pathManager;
    this.currentPosition = {
      x: start.x * GameConfig.tileSize + GameConfig.tileSize / 2,
      y: start.y * GameConfig.tileSize + GameConfig.tileSize / 2,
    };
    this.currentIndex = 0;
    this.health = health;
    this.maxHealth = health;
    this.isDestroyed = false;
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
      x: nextTile.x * GameConfig.tileSize + GameConfig.tileSize / 2,
      y: nextTile.y * GameConfig.tileSize + GameConfig.tileSize / 2,
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

  update() {
    this.moveAlongPath();
  }

  render(context: CanvasRenderingContext2D) {
    // Render enemy circle
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(
      this.currentPosition.x,
      this.currentPosition.y,
      GameConfig.enemy.radius,
      0,
      2 * Math.PI
    );
    context.fill();

    // Render health bar
    const healthBarWidth = GameConfig.healthBar.width;
    const healthBarHeight = GameConfig.healthBar.height;
    const healthBarX = this.currentPosition.x - healthBarWidth / 2;
    const healthBarY = this.currentPosition.y - GameConfig.healthBar.offset;
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

    // Render enemy's path (for debugging)

    context.strokeStyle = 'rgba(0, 0, 255, 0.3)';
    context.beginPath();
    for (let i = this.currentIndex; i < this.path.length; i++) {
      const tile = this.path[i];
      const x = tile.x * GameConfig.tileSize + GameConfig.tileSize / 2;
      const y = tile.y * GameConfig.tileSize + GameConfig.tileSize / 2;
      if (i === this.currentIndex) {
        context.moveTo(this.currentPosition.x, this.currentPosition.y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  }
}

export default Enemy;
