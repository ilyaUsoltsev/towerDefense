import { Point } from '../../utils/types';
import Enemy from '../enemy';
import { GameConfig } from '../../../constants/game-config';
import Cannon from '../cannon';
import MoveStrategy from './MoveStrategy';
import CollisionStrategy from './CollisionStrategy';

class Projectile {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  speed: number;
  damage: number;
  range: number;
  explosionRadius: number;
  exploded = false;
  private destroyed = false;
  private moveStrategy: MoveStrategy;
  private collisionStrategy: CollisionStrategy;

  constructor(
    start: Point,
    target: Point,
    cannon: Cannon,
    moveStrategy: MoveStrategy,
    collisionStrategy: CollisionStrategy
  ) {
    this.x = start.x;
    this.y = start.y;
    this.targetX = target.x;
    this.targetY = target.y;
    this.originX = start.x;
    this.originY = start.y;
    this.speed = cannon.projectileSpeed;
    this.damage = cannon.damage;
    this.range = cannon.range;
    this.explosionRadius = cannon.explosionRadius;
    this.moveStrategy = moveStrategy;
    this.collisionStrategy = collisionStrategy;
  }

  update(enemies: Enemy[]): void {
    this.moveStrategy.move(this);
    this.collisionStrategy.checkCollision(this, enemies);
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = GameConfig.projectile.color;
    context.beginPath();
    context.arc(this.x, this.y, GameConfig.projectile.radius, 0, 2 * Math.PI);
    context.fill();
  }

  destroy() {
    this.destroyed = true;
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  isExploded(): boolean {
    return this.exploded;
  }

  explode(): void {
    this.exploded = true;
  }
}

export default Projectile;
