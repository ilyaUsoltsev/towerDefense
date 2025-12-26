import Projectile from '../entities/projectile/projectile';
import Enemy from '../entities/enemy';
import { Point } from '../utils/types';
import Cannon from '../entities/cannon';
import { projectileConfig } from './constants/projectile-config';

class ProjectileManager {
  private projectiles: Projectile[] = [];
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  createProjectile(start: Point, target: Point, cannon: Cannon): void {
    const config = projectileConfig[cannon.cannonType];

    const projectile = new Projectile(
      start,
      target,
      cannon,
      new config.moveStrategy(),
      new config.collisionStrategy()
    );

    this.projectiles.push(projectile);
  }

  update(enemies: Enemy[]): void {
    this.projectiles.forEach(projectile => {
      projectile.update(enemies);
    });

    this.projectiles = this.projectiles.filter(
      projectile => !projectile.isDestroyed()
    );
  }

  render(): void {
    this.projectiles.forEach(projectile => {
      projectile.render(this.context);
    });
  }

  getProjectileCount(): number {
    return this.projectiles.length;
  }

  clear(): void {
    this.projectiles = [];
  }
}

export default ProjectileManager;
