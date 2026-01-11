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
  isNext: boolean;
  waveNumber: number;
}> = ({ title, wave, isNext, waveNumber }) => {
  // Длина анимации рассчитывается исходя из времени задержки предыдущей волны
  const animationTime =
    isNext && waveNumber > 0
      ? GameConfig.waveDelay +
        wavesConfig[waveNumber - 1].spawnInterval *
          wavesConfig[waveNumber - 1].count
      : 0;

  return (
    <Card
      // Добавляем уникальный ключ, чтобы анимация срабатывала при смене волны
      key={isNext ? `next-${waveNumber}` : `current-${waveNumber}`}
      view="outlined"
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
          Type: {wave.name}
        </Text>
        <Text variant="body-2" color="secondary">
          HP: {wave.hp}
        </Text>
      </div>
    </Card>
  );
};

export const WaveInfo: FC<WaveInfoProps> = ({ waveNumber }) => {
  const currentWave = wavesConfig[waveNumber];
  const isNext = waveNumber + 1 < wavesConfig.length;
  const nextWave = isNext ? wavesConfig[waveNumber + 1] : undefined;

  return (
    <div className={styles.container}>
      <WaveCard
        title="Current Wave"
        wave={currentWave}
        waveNumber={waveNumber}
        isNext={false}
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
