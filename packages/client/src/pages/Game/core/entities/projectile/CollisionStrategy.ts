import Enemy from '../enemy';
import Projectile from './projectile';

abstract class CollisionStrategy {
  abstract checkCollision(projectile: Projectile, enemies: Enemy[]): void;
}

export default CollisionStrategy;
