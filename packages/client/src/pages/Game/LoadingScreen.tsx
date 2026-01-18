import { FC, useEffect, useRef, useState } from 'react';
import { GAME_STATE } from '../../constants/GAME_STATE';
import { gameSetState } from '../../slices/gameSlice';
import { useDispatch } from '../../store';
import styles from './Game.module.css';

const COUNTDOWN = 5;

const LoadingScreen: FC = () => {
  const dispatch = useDispatch();

  const [timer, setTimer] = useState(COUNTDOWN);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer(prevTimer => Math.max(prevTimer - 1, 0));
    }, 1000);
  };

  useEffect(() => {
    if (timer === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      dispatch(gameSetState(GAME_STATE.GAME));
    }
  }, [timer, dispatch]);

  useEffect(() => {
    setTimer(COUNTDOWN);
    startCountdown();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div>
      <p className={styles.countdown}>{timer}</p>
    </div>
  );
};

export default LoadingScreen;
