import { FC, useEffect, useState } from 'react';
import { GAME_STATE } from '../../constants/GAME_STATE';
import { gameSetState } from '../../slices/gameSlice';
import { useDispatch } from '../../store';
import styles from './Game.module.css';
import { GameConfig } from './constants/game-config';

const StartDelayScreen: FC = () => {
  const dispatch = useDispatch();

  const [timer, setTimer] = useState<number>(GameConfig.gameStartDelay);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(prev => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          clearInterval(intervalId);
          dispatch(gameSetState(GAME_STATE.GAME));
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p className={styles.countdown}>{timer}</p>
    </div>
  );
};

export default StartDelayScreen;
