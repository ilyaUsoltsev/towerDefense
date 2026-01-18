import { FC } from 'react';
import { usePage } from '../../hooks/usePage';
import PageWrapper from '../../components/PageWrapper';

import styles from './Game.module.css';
import GameScreen from './GameScreen';
import StartScreen from './StartScreen';
import EndScreen from './EndScreen';
import { GAME_STATE } from '../../constants/GAME_STATE';
import { useSelector } from '../../store';
import LoadingScreen from './LoadingScreen';

const CurrentScreen: FC<{ gameState: GAME_STATE }> = ({ gameState }) => {
  switch (gameState) {
    case GAME_STATE.START: {
      return <StartScreen />;
    }
    case GAME_STATE.LOADING: {
      return <LoadingScreen />;
    }
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
  usePage({ initPage: initGamePage });
  const gameState = useSelector(state => state.game.state);
  console.log(gameState);

  return (
    <PageWrapper description="Tower defense">
      <div className={styles.gameWrapper}>
        <CurrentScreen gameState={gameState} />
      </div>
    </PageWrapper>
  );
};

export const initGamePage = () => Promise.resolve();
