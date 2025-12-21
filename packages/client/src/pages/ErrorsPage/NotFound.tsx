import { Button } from '@gravity-ui/uikit';
import { FC } from 'react';
import { Link } from 'react-router-dom';

import { usePage } from '../../hooks/usePage';

import PageWrapper from '../../components/PageWrapper';
import SectionLog from '../../components/SectionLog';

import styles from './ErrorsPage.module.css';

export const NotFoundPage: FC = () => {
  usePage({ initPage: initNotFoundPage });

  return (
    <PageWrapper description="404: Страница не найдена" withHeader={false}>
      <SectionLog>
        <div className={styles.error__container}>
          <h1 className={styles.error__code}>404</h1>
          <h2 className={styles.error__title}>Страница не найдена!</h2>
          <Link to="/">
            <Button view="action" size="xl" width="max">
              Вернуться на главную
            </Button>
          </Link>
        </div>
      </SectionLog>
    </PageWrapper>
  );
};

export const initNotFoundPage = () => Promise.resolve();
