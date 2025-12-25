import { Button } from '@gravity-ui/uikit';
import { useDispatch, useSelector } from '../../store';
import {
  gameSellSelectedEntity,
  gameUpgradeSelectedEntity,
} from '../../slices/gameSlice';

const GameMenu = () => {
  const hp = useSelector(state => state.game.hp);
  const selectedEntity = useSelector(state => state.game.selectedEntity);
  const money = useSelector(state => state.game.money);

  const dispatch = useDispatch();

  const sellSelectedEntity = () => {
    if (selectedEntity) {
      dispatch(gameSellSelectedEntity());
    }
  };

  const upgradeSelectedEntity = () => {
    if (selectedEntity) {
      dispatch(gameUpgradeSelectedEntity());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h2>Game Menu</h2>
      <p>HP: {hp}</p>
      <p>Money: {money}</p>
      <br />
      {selectedEntity ? (
        <div>
          <h3>Selected Entity</h3>
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
        </div>
      ) : (
        <p>No entity selected</p>
      )}
    </div>
  );
};

export default GameMenu;
