import Projectile from './projectile';
import Enemy from './enemy';
import { Point } from './types';
import { CannonType } from '../utils/cannons';

class ProjectileManager {
  private projectiles: Projectile[] = [];
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  createProjectile(start: Point, target: Point, cannonType: CannonType): void {
    const projectile = new Projectile(start, target, cannonType);
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
