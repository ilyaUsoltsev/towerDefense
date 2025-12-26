import { GameConfig } from '../../utils/config';
import Enemy from '../enemy';
import CollisionStrategy from './CollisionStrategy';
import Projectile from './projectile';

export class SingleHitCollision implements CollisionStrategy {
  checkCollision(projectile: Projectile, enemies: Enemy[]): void {
    for (const enemy of enemies) {
      if (enemy.destroyed()) continue;

      const pos = enemy.getPosition();
      const dist = Math.hypot(projectile.x - pos.x, projectile.y - pos.y);

      // Probably not good to have enemy radius hardcoded in GameConfig
      // Fix it later
      if (dist < GameConfig.enemy.radius) {
        enemy.takeHit(projectile.damage);
        projectile.destroy();
        return;
      }
    }
  }
}
