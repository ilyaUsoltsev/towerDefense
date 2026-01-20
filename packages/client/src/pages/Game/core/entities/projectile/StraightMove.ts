import MoveStrategy from './MoveStrategy';
import Projectile from './projectile';

class StraightMove implements MoveStrategy {
  move(projectile: Projectile): void {
    const dx = projectile.targetX - projectile.originX;
    const dy = projectile.targetY - projectile.originY;

    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return;

    const dirX = dx / length;
    const dirY = dy / length;

    projectile.x += dirX * projectile.speed;
    projectile.y += dirY * projectile.speed;

    const traveledX = projectile.x - projectile.originX;
    const traveledY = projectile.y - projectile.originY;

    if (
      Math.sqrt(traveledX * traveledX + traveledY * traveledY) >=
      projectile.range
    ) {
      projectile.destroy();
    }
  }
}
export default StraightMove;
