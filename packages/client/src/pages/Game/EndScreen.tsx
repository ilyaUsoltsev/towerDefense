import { Button, Card } from '@gravity-ui/uikit';
import { FC } from 'react';
import styles from './Game.module.css';
import { ROUTE } from '../../constants/ROUTE';
import { Link } from 'react-router-dom';

const EndScreen: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onRepeatGame = () => {};

  return (
    <Card className={styles.resultCard__wrapper}>
      <h2 className={styles.resultCard__title}>Победа</h2>
      <img src="/divider.svg" />
      <div className={styles.resultCard__infoBlock}>
        <div className={styles.resultCard__infoRow}>
          <span>Нанесенный урон</span>
          <span className={styles.resultCard__value}>100</span>
        </div>
        <div className={styles.resultCard__infoRow}>
          <span>Убито врагов</span>
          <span className={styles.resultCard__value}>10</span>
        </div>
      </div>
      <div className={styles.resultCard__buttonWrapper}>
        <Button view="action" size="xl" onClick={onRepeatGame}>
          Повторить
        </Button>
        <Link to={ROUTE.ROOT}>
          <Button view="action" size="xl">
            На главную
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default EndScreen;
