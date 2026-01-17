import { Button } from '@gravity-ui/uikit';
import { FC } from 'react';
import styles from './Game.module.css';

const StartScreen: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onStartGame = () => {};

  return (
    <div>
      <Button
        view="action"
        size="xl"
        className={styles.startButton}
        onClick={onStartGame}>
        Старт
      </Button>
    </div>
  );
};

export default StartScreen;
