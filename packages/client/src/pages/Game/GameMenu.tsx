import { Button } from '@gravity-ui/uikit';
import { useDispatch, useSelector } from '../../store';
import { gameSellSelectedEntity } from '../../slices/gameSlice';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h2>Game Menu</h2>
      <p>HP: {hp}</p>
      <p>Money: {money}</p>
      <br />
      {selectedEntity ? (
        <div>
          <h3>Selected Entity</h3>
          <p>Type: {selectedEntity.type}</p>
          <p>ID: {selectedEntity.id}</p>
          <Button view="action" onClick={sellSelectedEntity}>
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
