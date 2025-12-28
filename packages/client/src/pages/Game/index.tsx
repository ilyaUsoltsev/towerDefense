import { FC } from 'react';
import { usePage } from '../../hooks/usePage';
import PageWrapper from '../../components/PageWrapper';

import Game from './Game';
import styles from './Game.module.css';
import GameMenu from './GameMenu';
import { useSelector } from '../../store';
import { GameStats } from './components/GameStats';
import { WaveInfo } from './components/WaveInfo';

export const GamePage: FC = () => {
  usePage({ initPage: initGamePage });
  const money = useSelector(state => state.game.money);
  const lives = useSelector(state => state.game.hp);
  const waveNumber = useSelector(state => state.game.waveNumber);

  return (
    <PageWrapper description="Главное меню">
      <div className={styles.gameWrapper}>
        <div className="flex gap-2">
          <div>
            <GameStats waveNumber={waveNumber} lives={lives} money={money} />
            <Game />
          </div>
          <GameMenu />
        </div>
        {waveNumber !== null && <WaveInfo waveNumber={waveNumber} />}
      </div>
    </PageWrapper>
  );
};

export const initGamePage = () => Promise.resolve();
