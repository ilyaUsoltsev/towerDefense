import { CannonType } from '../../../constants/cannons-config';
import AtTargetMove from '../../entities/projectile/AtTargetMove';
import CollisionStrategy from '../../entities/projectile/CollisionStrategy';
import { ExplosionCollision } from '../../entities/projectile/ExplosionCollision';
import MoveStrategy from '../../entities/projectile/MoveStrategy';
import NoCollisionStrategy from '../../entities/projectile/NoCollisionStrategy';
import NoMove from '../../entities/projectile/NoMove';
import { SingleHitCollision } from '../../entities/projectile/SingleHitCollision';
import StraightMove from '../../entities/projectile/StraightMove';

export const projectileConfig: Record<
  CannonType,
  {
    moveStrategy: new () => MoveStrategy;
    collisionStrategy: new () => CollisionStrategy;
  }
> = {
  dumb: {
    moveStrategy: NoMove,
    collisionStrategy: NoCollisionStrategy,
  },
  basic: {
    moveStrategy: StraightMove,
    collisionStrategy: SingleHitCollision,
  },
  rocket: {
    moveStrategy: AtTargetMove,
    collisionStrategy: ExplosionCollision,
  },
  sniper: {
    moveStrategy: StraightMove,
    collisionStrategy: SingleHitCollision,
  },
  freeze: {
    moveStrategy: StraightMove,
    collisionStrategy: SingleHitCollision,
  },
};
