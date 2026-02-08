import { FC } from 'react';
import { wavesConfig } from '../constants/waves-config';
import GameStatsItem from './GameStatsItem';

interface GameStatsProps {
  waveNumber: number | null;
  lives: number;
  money: number;
}

export const GameStats: FC<GameStatsProps> = ({ waveNumber, lives, money }) => {
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
    </div>
  );
};
