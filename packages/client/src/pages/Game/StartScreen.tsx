import { Button } from '@gravity-ui/uikit';
import { FC } from 'react';
import { GAME_STATE } from '../../constants/GAME_STATE';
import { gameSetState } from '../../slices/gameSlice';
import { useDispatch } from '../../store';
import styles from './Game.module.css';

const StartScreen: FC = () => {
  const dispatch = useDispatch();

  const onStartGame = () => {
    dispatch(gameSetState(GAME_STATE.LOADING));
  };

  return (
    <div>
      <Button
        view="action"
        size="xl"
        className={styles.startButton}
        onClick={onStartGame}>
        Старт
      </Button>
    </div>
  );
};

export default StartScreen;
