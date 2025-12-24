import { Button } from '@gravity-ui/uikit';
import { useSelector } from '../../store';

const GameMenu = () => {
  const hp = useSelector(state => state.game.hp);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h2>Game Menu</h2>
      <p>HP: {hp}</p>
      <p>Money: 1000</p>

      <Button view="action">Start Wave</Button>
    </div>
  );
};

export default GameMenu;
