import { FC, useEffect } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { usePage } from '../../hooks/usePage';

import { GAME_STATE } from '../../constants/GAME_STATE';
import { useDispatch, useSelector } from '../../store';
import EndScreen from './EndScreen';
import styles from './Game.module.css';
import GameScreen from './GameScreen';
import StartDelayScreen from './StartDelayScreen';
import StartScreen from './StartScreen';
import { gameReset } from '../../slices/gameSlice';

const CurrentScreen: FC = () => {
  const gameState = useSelector(state => state.game.gameState);

  switch (gameState) {
    case GAME_STATE.START: {
      return <StartScreen />;
    }
    // case GAME_STATE.LOADING: {
    //   return <StartDelayScreen />;
    // }
    case GAME_STATE.GAME: {
      return <GameScreen />;
    }
    case GAME_STATE.END: {
      return <EndScreen />;
    }
    default: {
      return <StartScreen />;
    }
  }
};

export const GamePage: FC = () => {
  const dispatch = useDispatch();
  usePage({ initPage: initGamePage });

  useEffect(() => {
    return () => {
      dispatch(gameReset());
    };
  }, []);

  return (
    <PageWrapper description="Tower defense">
      <div className={styles.gameWrapper}>
        <CurrentScreen />
      </div>
    </PageWrapper>
  );
};

export const initGamePage = () => Promise.resolve();
