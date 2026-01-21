import { FC } from 'react';
import { Button, Icon } from '@gravity-ui/uikit';
import {
  ChevronsExpandUpRight,
  ChevronsCollapseUpRight,
} from '@gravity-ui/icons';
import { wavesConfig } from '../constants/waves-config';
import GameStatsItem from './GameStatsItem';
import { useFullscreen } from '../../../hooks/useFullscreen';

interface GameStatsProps {
  waveNumber: number | null;
  lives: number;
  money: number;
}

export const GameStats: FC<GameStatsProps> = ({ waveNumber, lives, money }) => {
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();

  return (
    <div className="flex justify-around">
      {waveNumber !== null && (
        <GameStatsItem
          color="info"
          title="Wave"
          value={`${waveNumber + 1}/${wavesConfig.length}`}
        />
      )}
      <GameStatsItem
        color="positive-heavy"
        title="Lives"
        value={lives.toString()}
      />
      <GameStatsItem color="warning" title="Gold" value={money.toString()} />
      {isSupported && (
        <Button
          view="flat"
          size="m"
          onClick={toggleFullscreen}
          title={
            isFullscreen
              ? 'Выход из полноэкранного режима (ESC)'
              : 'Полноэкранный режим'
          }>
          <Icon
            data={
              isFullscreen ? ChevronsCollapseUpRight : ChevronsExpandUpRight
            }
          />
        </Button>
      )}
    </div>
  );
};
