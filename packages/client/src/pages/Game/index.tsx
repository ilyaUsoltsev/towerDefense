import { FC } from 'react';
import { usePage } from '../../hooks/usePage';
import PageWrapper from '../../components/PageWrapper';

import styles from './Game.module.css';
import GameScreen from './GameScreen';
import StartScreen from './StartScreen';

const CurrentScreen: FC<{ screen: 'start' | 'game' | 'end' }> = ({
  screen,
}) => {
  switch (screen) {
    case 'start': {
      return <StartScreen />;
    }
    case 'game': {
      return <GameScreen />;
    }
    case 'end':
    default: {
      return <StartScreen />;
    }
  }
};

export const GamePage: FC = () => {
  usePage({ initPage: initGamePage });

  return (
    <PageWrapper description="Tower defense">
      <div className={styles.gameWrapper}>
        <CurrentScreen screen="game" />
      </div>
    </PageWrapper>
  );
};

export const initGamePage = () => Promise.resolve();
