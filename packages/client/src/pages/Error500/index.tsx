import { Button } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import { usePage } from '../../hooks/usePage';
import SectionLog from '../../components/SectionLog';
import { PageInitArgs } from '../../routes';
import styles from './Error500.module.css';

export const Error500Page = () => {
  usePage({ initPage: initError500Page });

  return (
    <SectionLog>
      <div className={styles.error__container}>
        <h1 className={styles.error__code}>500</h1>
        <h2 className={styles.error__title}>Внутренняя ошибка сервера</h2>
        <p className={styles.error__description}>
          К сожалению, произошла внутренняя ошибка сервера. Мы уже работаем над
          её устранением. Пожалуйста, попробуйте позже.
        </p>
        <Link to="/">
          <Button view="action" size="xl" width="max">
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </SectionLog>
  );
};

export const initError500Page = async ({ dispatch, state }: PageInitArgs) => {
  return Promise.resolve();
};
