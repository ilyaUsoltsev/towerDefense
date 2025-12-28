import { FC } from 'react';
import { Text, Card } from '@gravity-ui/uikit';
import { wavesConfig } from '../constants/waves-config';
import { GameConfig } from '../constants/game-config';
import styles from './WaveInfo.module.css';

interface WaveInfoProps {
  waveNumber: number;
}

const WaveCard: FC<{
  title: string;
  wave: typeof wavesConfig[number];
  isNext?: boolean;
  waveNumber: number;
}> = ({ title, wave, isNext, waveNumber }) => {
  // Длина анимации рассчитывается исходя из времени задержки предыдущей волны
  const animationTime = isNext
    ? GameConfig.waveDelay +
      wavesConfig[waveNumber - 1].spawnInterval *
        wavesConfig[waveNumber - 1].count
    : 0;

  return (
    <Card
      view="outlined"
      key={isNext ? `wave-${waveNumber}` : undefined}
      className={`${styles.card} ${
        isNext ? styles.cardNext : styles.cardCurrent
      }`}
      style={
        isNext
          ? { ['--animation-duration' as string]: `${animationTime}ms` }
          : undefined
      }>
      <div className={styles.cardContent}>
        <Text color={isNext ? 'secondary' : 'warning'} variant="subheader-2">
          {title}
        </Text>
        <Text variant="body-2" color="secondary">
          Type:&nbsp;
          <Text variant="body-2" color={isNext ? 'secondary' : 'primary'}>
            {wave.name}
          </Text>
        </Text>
        <Text variant="body-2" color="secondary">
          HP:&nbsp;
          <Text variant="body-2" color={isNext ? 'secondary' : 'primary'}>
            {wave.hp}
          </Text>
        </Text>
      </div>
    </Card>
  );
};

export const WaveInfo: FC<WaveInfoProps> = ({ waveNumber }) => {
  const currentWave = wavesConfig[waveNumber];
  const nextWave = wavesConfig[waveNumber + 1];

  return (
    <div className={styles.container}>
      <WaveCard
        title="Current Wave"
        wave={currentWave}
        waveNumber={waveNumber}
      />
      {nextWave && (
        <WaveCard
          title="Next Wave"
          wave={nextWave}
          waveNumber={waveNumber + 1}
          isNext
        />
      )}
    </div>
  );
};
