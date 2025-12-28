import { FC } from 'react';
import { Text } from '@gravity-ui/uikit';
import { wavesConfig } from '../constants/waves-config';

interface GameStatsProps {
  waveNumber: number | null;
  lives: number;
  money: number;
}

export const GameStats: FC<GameStatsProps> = ({ waveNumber, lives, money }) => {
  return (
    <div className="flex justify-around">
      <Text color="info" variant="body-3">
        Wave:&nbsp;
        {waveNumber !== null && (
          <Text variant="subheader-3">
            {waveNumber + 1}/{wavesConfig.length}
          </Text>
        )}
      </Text>
      <Text color="positive-heavy" variant="body-3">
        Lives: <Text variant="subheader-3">{lives}</Text>
      </Text>
      <Text color="warning" variant="body-3">
        Gold: <Text variant="subheader-3">{money}</Text>
      </Text>
    </div>
  );
};
