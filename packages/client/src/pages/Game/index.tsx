import { FC } from 'react';
import { usePage } from '../../hooks/usePage';
import PageWrapper from '../../components/PageWrapper';

import Game from './Game';
import styles from './Game.module.css';
import GameMenu from './GameMenu';
import { useSelector } from '../../store';
import { Text } from '@gravity-ui/uikit';
import { wavesConfig } from './constants/waves-config';

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
            <div className="flex justify-around">
              <Text color="info" variant="body-3">
                Wave:&nbsp;
                <Text variant="subheader-3">
                  {waveNumber + 1}/{wavesConfig.length}
                </Text>
              </Text>
              <Text color="positive-heavy" variant="body-3">
                Lives: <Text variant="subheader-3">{lives}</Text>
              </Text>
              <Text color="warning" variant="body-3">
                Gold: <Text variant="subheader-3">{money}</Text>
              </Text>
            </div>
            <Game />
          </div>
          <GameMenu />
        </div>
      </div>
    </PageWrapper>
  );
};

export const initGamePage = () => Promise.resolve();
