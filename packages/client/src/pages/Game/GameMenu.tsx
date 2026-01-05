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
import { GameConfig } from './constants/game-config';
import { EffectsConfig } from './constants/effects-config';

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
        {Object.keys(CannonsConfig).map(cannonType => (
          <span
            key={cannonType}
            className="cursor-pointer"
            onClick={() => chooseCannon(cannonType as CannonType)}>
            {/* IMPORTANT: image filename should match cannonType */}
            <img src={`/${cannonType}.png`} alt={cannonType} width={30} />
          </span>
        ))}
      </div>
      {cannon && (
        <Card className="p-2 flex-col gap-2">
          <p>{CannonsConfig[cannon].name}</p>
          <p>Урон: {CannonsConfig[cannon].damage}</p>
          <p>
            Эффект: {EffectsConfig[cannon] ? EffectsConfig[cannon].name : 'Нет'}
          </p>
          <p>Дальность: {CannonsConfig[cannon].range}</p>
          <p>
            Частота:&nbsp;
            {Math.round((1000 / CannonsConfig[cannon].fireRate) * 100) / 100} Гц
          </p>
          <p>Стоимость: {CannonsConfig[cannon].cost}</p>
        </Card>
      )}

      {selectedEntity && (
        <Card className="p-2 flex-col gap-2">
          <p>ID: {selectedEntity.id}</p>
          <p>Type: {selectedEntity.type}</p>
          <p>Level: {selectedEntity.level}</p>
          <p>Damage: {Math.round(selectedEntity.damage)}</p>
          <p>Range: {Math.round(selectedEntity.range)}</p>
          <p>
            Frequency:&nbsp;
            {Math.round((1000 / selectedEntity.fireRate) * 100) / 100} Hz
          </p>
          <p>Upgrade Cost: {selectedEntity.upgradeCost}</p>
          <Button
            view="action"
            onClick={upgradeSelectedEntity}
            disabled={
              money < selectedEntity.upgradeCost ||
              selectedEntity.level >= GameConfig.maxCannonLevel
            }>
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
