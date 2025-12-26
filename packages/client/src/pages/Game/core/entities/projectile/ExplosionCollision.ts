import Enemy from '../enemy';
import CollisionStrategy from './CollisionStrategy';
import Projectile from './projectile';

export class ExplosionCollision implements CollisionStrategy {
  checkCollision(projectile: Projectile, enemies: Enemy[]): void {
    for (const enemy of enemies) {
      if (enemy.destroyed()) {
        continue;
      }
      const pos = enemy.getPosition();
      const dist = Math.hypot(projectile.x - pos.x, projectile.y - pos.y);

      if (projectile.isExploded() && dist < projectile.explosionRadius) {
        enemy.takeHit(projectile.damage);
      }
    }
    if (projectile.isExploded()) {
      projectile.destroy();
    }
  }
}
