import { Button, Modal } from '@gravity-ui/uikit';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fetchUserThunk, selectUser } from '../../slices/userSlice';

import { usePage } from '../../hooks/usePage';

import { type PageInitArgs } from '../../routes';

import PageWrapper from '../../components/PageWrapper';
import SectionLog from '../../components/SectionLog';

import { ButtonBlock } from './styles';

export const MainPage: FC = () => {
  const navigate = useNavigate();
  usePage({ initPage: initMainPage });

  const [openRules, setOpenRules] = useState(false);

  const onNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <PageWrapper description="Главное меню">
      <SectionLog>
        <ButtonBlock>
          <Button view="action" size="xl" onClick={() => onNavigate('/game')}>
            Новая игра
          </Button>
          <Button
            view="outlined-action"
            size="xl"
            onClick={() => setOpenRules(true)}>
            Как играть
          </Button>
          <Button
            view="outlined-action"
            size="xl"
            onClick={() => onNavigate('/leaderboard')}>
            Список лидеров
          </Button>
          <Button
            view="outlined-action"
            size="xl"
            onClick={() => onNavigate('/forum')}>
            Форум
          </Button>
        </ButtonBlock>
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
