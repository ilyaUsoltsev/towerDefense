import { Point, Projectile, Tile } from './types';
import Enemy from './enemy';

const sizeOfSprite = 32;

class Cannon {
  position: Tile;
  range: number;
  tileSize: number;
  projectiles: Projectile[] = [];
  fireRate = 1000;
  lastFireTime = 0;
  projectileSpeed = 5;
  damage = 2;

  constructor(position: Tile, range = 64, tileSize = 32) {
    this.position = position;
    this.range = range;
    this.tileSize = tileSize;
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
    this.projectiles.push({
      x: cannonCenter.x,
      y: cannonCenter.y,
      targetX: target.x,
      targetY: target.y,
      speed: this.projectileSpeed,
    });
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

    this.updateProjectiles(enemies);
  }

  private updateProjectiles(enemies: Enemy[]): void {
    this.projectiles = this.projectiles.filter(projectile => {
      const dx = projectile.targetX - projectile.x;
      const dy = projectile.targetY - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < projectile.speed) {
        return false;
      }

      // Check collision with entities
      for (const enemy of enemies) {
        if (enemy.destroyed()) continue;

        const enemyPos = enemy.getPosition();
        const distToEnemy = Math.sqrt(
          (projectile.x - enemyPos.x) ** 2 + (projectile.y - enemyPos.y) ** 2
        );
        if (distToEnemy < sizeOfSprite / 2) {
          enemy.takeHit(this.damage);
          return false;
        }
      }

      projectile.x += (dx / distance) * projectile.speed;
      projectile.y += (dy / distance) * projectile.speed;
      return true;
    });
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

    this.renderProjectiles(context);
  }

  private renderProjectiles(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'orange';
    this.projectiles.forEach(projectile => {
      context.beginPath();
      context.arc(projectile.x, projectile.y, 3, 0, 2 * Math.PI);
      context.fill();
    });
  }
}

export default Cannon;
