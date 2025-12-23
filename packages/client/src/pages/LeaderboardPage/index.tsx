import { Table } from '@gravity-ui/uikit';
import { useSelector } from '../../store';
import { Header } from '../../components/Header';
import { PageHelmet } from '../../components/PageHelmet';
import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { PageInitArgs } from '../../routes';
import { usePage } from '../../hooks/usePage';
import styles from './LeaderboardPage.module.css';

// Моковые данные для лидерборда
const mockLeaderboard = [
  { username: 'Игрок1', score: 15000 },
  { username: 'Игрок2', score: 12000 },
  { username: 'Игрок3', score: 10000 },
  { username: 'Игрок4', score: 8500 },
  { username: 'Игрок5', score: 7200 },
  { username: 'Игрок6', score: 6000 },
  { username: 'Игрок7', score: 5000 },
  { username: 'Игрок8', score: 4500 },
  { username: 'Игрок9', score: 4000 },
  { username: 'Игрок10', score: 3500 },
];

const getColumns = () => [
  { id: 'position', name: 'Место', align: 'left' as const },
  { id: 'username', name: 'Игрок', align: 'center' as const },
  { id: 'score', name: 'Рекорд', align: 'right' as const },
];

export const LeaderboardPage = () => {
  const user = useSelector(selectUser);

  usePage({ initPage: initLeaderboardPage });

  if (!user) {
    return (
      <div>
        <PageHelmet title="Лидерборд" description="Таблица лидеров" />
        <Header />
        <h3>Для просмотра лидерборда необходимо авторизоваться</h3>
      </div>
    );
  }

  const data = mockLeaderboard.map((item, index) => ({
    position: (index + 1).toString(),
    username: item.username,
    score: item.score.toLocaleString('ru-RU'),
  }));

  return (
    <div>
      <PageHelmet title="Лидерборд" description="Таблица лидеров" />
      <Header />
      <div className={styles.leaderboard__container}>
        <div className={styles.leaderboard__board}>
          <h2 className={styles.leaderboard__title}>Таблица лидеров</h2>
          <div className={styles.leaderboard__tableWrapper}>
            <Table data={data} columns={getColumns()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const initLeaderboardPage = async ({
  dispatch,
  state,
}: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
  return Promise.resolve();
};
