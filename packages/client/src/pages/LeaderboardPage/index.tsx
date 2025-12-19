import { Helmet } from 'react-helmet';
import { Table } from '@gravity-ui/uikit';
import { useSelector } from '../../store';
import { Header } from '../../components/Header';
import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import { PageInitArgs } from '../../routes';
import { usePage } from '../../hooks/usePage';
import styles from './LeaderboardPage.module.css';

// Моковые данные для лидерборда
const mockLeaderboard = [
  { position: 1, username: 'Игрок1', score: 15000 },
  { position: 2, username: 'Игрок2', score: 12000 },
  { position: 3, username: 'Игрок3', score: 10000 },
  { position: 4, username: 'Игрок4', score: 8500 },
  { position: 5, username: 'Игрок5', score: 7200 },
  { position: 6, username: 'Игрок6', score: 6000 },
  { position: 7, username: 'Игрок7', score: 5000 },
  { position: 8, username: 'Игрок8', score: 4500 },
  { position: 9, username: 'Игрок9', score: 4000 },
  { position: 10, username: 'Игрок10', score: 3500 },
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
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Лидерборд</title>
          <meta name="description" content="Таблица лидеров" />
        </Helmet>
        <Header />
        <h3>Для просмотра лидерборда необходимо авторизоваться</h3>
      </div>
    );
  }

  const data = mockLeaderboard.map(item => ({
    position: item.position.toString(),
    username: item.username,
    score: item.score.toLocaleString('ru-RU'),
  }));

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Таблица лидеров" />
      </Helmet>
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
