import { FC } from 'react';

import { usePage } from '../../hooks/usePage';

import PageWrapper from '../../components/PageWrapper';

import Game from './Game';
import styles from './Game.module.css';
import GameMenu from './GameMenu';

export const GamePage: FC = () => {
  usePage({ initPage: initGamePage });

  return (
    <PageWrapper description="Главное меню">
      <div className={styles.gameWrapper}>
        <Game />
        <GameMenu />
      </div>
    </PageWrapper>
  );
};

export const initGamePage = () => Promise.resolve();
