import Projectile from './projectile';

abstract class MoveStrategy {
  abstract move(projectile: Projectile): void;
}

export default MoveStrategy;
