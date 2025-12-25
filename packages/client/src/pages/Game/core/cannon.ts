import { Point, Tile } from './types';
import Enemy from './enemy';
import { GameConfig } from './config';
import ProjectileManager from './projectileManager';

class Cannon {
  id: string;
  position: Tile;
  range: number;
  tileSize: number;
  fireRate = GameConfig.cannon.fireRate;
  projectileSpeed = GameConfig.cannon.projectileSpeed;
  damage = GameConfig.cannon.damage;
  lastFireTime = 0;
  level = 1;
  cost: number;
  private projectileManager: ProjectileManager;

  constructor(
    position: Tile,
    range: number,
    tileSize: number,
    projectileManager: ProjectileManager
  ) {
    this.id = `cannon-${position.x}-${position.y}`;
    this.position = position;
    this.range = range;
    this.tileSize = tileSize;
    this.projectileManager = projectileManager;
    this.cost = GameConfig.cannon.cost;
  }

  upgrade(): void {
    this.level += 1;
    this.damage *= 1.5;
    this.range *= 1.2;
  }

  getSellValue(): number {
    return Math.floor(this.cost * 0.7 * this.level);
  }

  getUpgradeCost(): number {
    return Math.floor(this.cost * 1.5 * this.level);
  }

  getCenter(): Point {
    return {
      x: this.position.x * this.tileSize + this.tileSize / 2,
      y: this.position.y * this.tileSize + this.tileSize / 2,
    };
  }

  isEnemyInRange(enemy: Enemy): boolean {
    const enemyPos = enemy.getPosition();
    const cannonCenter = this.getCenter();
    const dx = enemyPos.x - cannonCenter.x;
    const dy = enemyPos.y - cannonCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.range;
  }

  canFire(currentTime: number): boolean {
    return currentTime - this.lastFireTime >= this.fireRate;
  }

  shootAt(target: Point, currentTime: number): void {
    if (!this.canFire(currentTime)) {
      return;
    }

    const cannonCenter = this.getCenter();
    this.projectileManager.createProjectile(
      cannonCenter,
      target,
      this.projectileSpeed,
      this.damage
    );
    this.lastFireTime = currentTime;
  }

  update(enemies: Enemy[], currentTime: number): void {
    const enemiesInRange = enemies.filter(
      enemy => this.isEnemyInRange(enemy) && !enemy.hasReachedEnd()
    );

    if (enemiesInRange.length > 0 && this.canFire(currentTime)) {
      const target = enemiesInRange[0].getPosition();
      this.shootAt(target, currentTime);
    }
  }

  render(context: CanvasRenderingContext2D): void {
    const center = this.getCenter();

    context.fillStyle = 'black';
    context.fillRect(
      this.position.x * this.tileSize,
      this.position.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );

    context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    context.beginPath();
    context.arc(center.x, center.y, this.range, 0, 2 * Math.PI);
    context.stroke();
  }
}

export default Cannon;
