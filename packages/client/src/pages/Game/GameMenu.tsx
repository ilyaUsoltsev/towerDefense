import { Button, Card } from '@gravity-ui/uikit';
import { useDispatch, useSelector } from '../../store';
import {
  gameSelectEntity,
  gameSellSelectedEntity,
  gameSelectCannon,
  gameUpgradeSelectedEntity,
} from '../../slices/gameSlice';
import { CannonsConfig, CannonType } from './constants/cannons-config';
import { useLayoutEffect, useState } from 'react';

const options: { value: CannonType; content: React.ReactNode }[] = [
  { content: <img src="/dumb.png" width={30} />, value: 'dumb' },
  { content: <img src="/basic.png" width={30} />, value: 'basic' },
  { content: <img src="/rocket.png" width={30} />, value: 'rocket' },
  { content: <img src="/sniper.png" width={30} />, value: 'sniper' },
  { content: <img src="/freeze.png" width={30} />, value: 'freeze' },
];

const GameMenu = () => {
  const [cannon, setCannon] = useState<CannonType | null>(null);
  const selectedEntity = useSelector(state => state.game.selectedEntity);
  const money = useSelector(state => state.game.money);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // Deselect cannon when an entity is selected
    if (selectedEntity) {
      setCannon(null);
      dispatch(gameSelectCannon(null));
    }
  }, [selectedEntity]);

  const sellSelectedEntity = () => {
    if (selectedEntity) {
      dispatch(gameSellSelectedEntity());
    }
    dispatch(gameSelectCannon(null));
  };

  const upgradeSelectedEntity = () => {
    if (selectedEntity) {
      dispatch(gameUpgradeSelectedEntity());
    }
  };

  const chooseCannon = (type: CannonType) => {
    if (selectedEntity) {
      // Don't show cannon info when cannon is selected
      dispatch(gameSelectEntity(null));
    }
    setCannon(type);
    dispatch(gameSelectCannon(type));
  };

  return (
    <div className="flex-col gap-2" style={{ width: '200px' }}>
      <div className="flex gap-2">
        {options.map(option => (
          <span
            key={option.value}
            className="cursor-pointer"
            onClick={() => chooseCannon(option.value)}>
            {option.content}
          </span>
        ))}
      </div>
      {cannon && (
        <Card className="p-2">
          <p>Тип: {cannon}</p>
          <p>Урон: {CannonsConfig[cannon].damage}</p>
          <p>Дальность: {CannonsConfig[cannon].range}</p>
          <p>Частота: {1000 / CannonsConfig[cannon].fireRate} Гц</p>
          <p>Стоимость: {CannonsConfig[cannon].cost}</p>
          <p>{CannonsConfig[cannon].description}</p>
        </Card>
      )}

      {selectedEntity && (
        <Card className="p-2">
          <p>ID: {selectedEntity.id}</p>
          <p>Type: {selectedEntity.type}</p>
          <p>Level: {selectedEntity.level}</p>
          <p>Damage: {selectedEntity.damage}</p>
          <p>Range: {selectedEntity.range}</p>
          <p>Frequency: {1000 / selectedEntity.fireRate} Hz</p>
          <p>Upgrade Cost: {selectedEntity.upgradeCost}</p>
          <Button
            view="action"
            onClick={upgradeSelectedEntity}
            disabled={money < selectedEntity.upgradeCost}>
            Апгрейд
          </Button>
          <Button view="outlined" onClick={sellSelectedEntity}>
            Продать
          </Button>
        </Card>
      )}
    </div>
  );
};

export default GameMenu;
