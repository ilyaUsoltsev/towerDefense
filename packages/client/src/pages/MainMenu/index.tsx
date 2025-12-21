import { Button, Modal } from '@gravity-ui/uikit';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { fetchUserThunk, selectUser } from '../../slices/userSlice';

import { usePage } from '../../hooks/usePage';

import { type PageInitArgs } from '../../routes';

import { ROUTE } from '../../constants/ROUTE';

import PageWrapper from '../../components/PageWrapper';
import SectionLog from '../../components/SectionLog';

import styles from './MainMenu.module.css';

export const MainPage: FC = () => {
  usePage({ initPage: initMainPage });

  const [openRules, setOpenRules] = useState(false);

  return (
    <PageWrapper description="Главное меню">
      <SectionLog>
        <div className={styles.buttonBlock}>
          <Link to={ROUTE.GAME}>
            <Button view="action" size="xl">
              Новая игра
            </Button>
          </Link>
          <Button
            view="outlined-action"
            size="xl"
            onClick={() => setOpenRules(true)}>
            Как играть
          </Button>
          <Link to={ROUTE.LEADERBOARD}>
            <Button view="outlined-action" size="xl">
              Список лидеров
            </Button>
          </Link>
          <Link to={ROUTE.FORUM}>
            <Button view="outlined-action" size="xl">
              Форум
            </Button>
          </Link>
        </div>
      </SectionLog>

      <Modal open={openRules} onClose={() => setOpenRules(false)}>
        <div
          style={{
            padding: '100px',
          }}>
          Будет позже
        </div>
      </Modal>
    </PageWrapper>
  );
};

export const initMainPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
