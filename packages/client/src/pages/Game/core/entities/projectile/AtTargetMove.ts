import MoveStrategy from './MoveStrategy';
import Projectile from './projectile';

// Projectile moves directly towards its target position
// But is destroyed upon reaching the target
// Or when overshooting it
// Good candidate for rocket-type projectiles

class AtTargetMove implements MoveStrategy {
  move(projectile: Projectile): void {
    const dx = projectile.targetX - projectile.x;
    const dy = projectile.targetY - projectile.y;
    const distance = Math.hypot(dx, dy);

    if (distance < projectile.speed) {
      projectile.x = projectile.targetX;
      projectile.y = projectile.targetY;
      projectile.explode();
      return;
    }

    projectile.x += (dx / distance) * projectile.speed;
    projectile.y += (dy / distance) * projectile.speed;
  }
}
export default AtTargetMove;
