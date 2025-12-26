import { SelectedEntity } from '../../../slices/gameSlice';
import Cannon from '../core/entities/cannon';

export const getCannonState = (cannon: Cannon): SelectedEntity => {
  return {
    type: cannon.cannonType,
    id: cannon.id,
    position: cannon.position,
    level: cannon.level,
    damage: cannon.damage,
    range: cannon.range,
    fireRate: cannon.fireRate,
    selling: false,
    upgrading: false,
    upgradeCost: cannon.getUpgradeCost(),
  };
};
