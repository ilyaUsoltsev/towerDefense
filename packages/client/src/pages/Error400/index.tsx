import { Button } from '@gravity-ui/uikit';
import { Link } from 'react-router-dom';
import { usePage } from '../../hooks/usePage';
import SectionLog from '../../components/SectionLog';
import { PageInitArgs } from '../../routes';
import styles from './Error400.module.css';

export const Error400Page = () => {
  usePage({ initPage: initError400Page });

  return (
    <SectionLog>
      <div className={styles.error__container}>
        <h1 className={styles.error__code}>400</h1>
        <h2 className={styles.error__title}>Неверный запрос</h2>
        <p className={styles.error__description}>
          К сожалению, ваш запрос содержит ошибку. Пожалуйста, проверьте
          введенные данные и попробуйте снова.
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

export const initError400Page = async ({ dispatch, state }: PageInitArgs) => {
  return Promise.resolve();
};
