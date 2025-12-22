import { Point } from './types';
import Enemy from './enemy';
import { GameConfig } from './config';

class Projectile {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  private destroyed = false;

  constructor(
    start: Point,
    target: Point,
    speed: number = GameConfig.cannon.projectileSpeed,
    damage: number = GameConfig.cannon.damage
  ) {
    this.x = start.x;
    this.y = start.y;
    this.targetX = target.x;
    this.targetY = target.y;
    this.speed = speed;
    this.damage = damage;
  }

  update(enemies: Enemy[]): void {
    this.move();
    this.checkCollision(enemies);
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = GameConfig.projectile.color;
    context.beginPath();
    context.arc(this.x, this.y, GameConfig.projectile.radius, 0, 2 * Math.PI);
    context.fill();
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  private move(): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.destroyed = true;
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  private checkCollision(enemies: Enemy[]): void {
    for (const enemy of enemies) {
      if (enemy.destroyed()) {
        continue;
      }

      const enemyPos = enemy.getPosition();
      const distToEnemy = Math.hypot(this.x - enemyPos.x, this.y - enemyPos.y);

      if (distToEnemy < GameConfig.enemy.radius) {
        enemy.takeHit(this.damage);
        this.destroyed = true;
        return;
      }
    }
  }
}

export default Projectile;
