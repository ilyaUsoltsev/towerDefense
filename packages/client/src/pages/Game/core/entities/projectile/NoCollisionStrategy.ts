import CollisionStrategy from './CollisionStrategy';

class NoCollisionStrategy implements CollisionStrategy {
  checkCollision(): void {
    // No collision detection
  }
}

export default NoCollisionStrategy;
