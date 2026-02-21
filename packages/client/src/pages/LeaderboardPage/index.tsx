import { Table, Loader, Button } from '@gravity-ui/uikit';
import { useDispatch, useSelector } from '../../store';
import Header from '../../components/Header';
import { PageHelmet } from '../../components/PageHelmet';
import { fetchUserThunk, selectUser } from '../../slices/userSlice';
import {
  fetchLeaderboardThunk,
  selectLeaderboardEntries,
  selectLeaderboardLoading,
  selectLeaderboardError,
} from '../../slices/leaderboardSlice';
import { PageInitArgs } from '../../routes';
import { usePage } from '../../hooks/usePage';
import { LEADERBOARD_RATING_FIELD_NAME } from '../../constants/leaderboard';
import styles from './LeaderboardPage.module.css';

const getColumns = () => [
  { id: 'position', name: 'Место', align: 'left' as const },
  { id: 'username', name: 'Игрок', align: 'center' as const },
  { id: 'score', name: 'Рекорд', align: 'right' as const },
];

export const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const entries = useSelector(selectLeaderboardEntries);
  const isLoading = useSelector(selectLeaderboardLoading);
  const error = useSelector(selectLeaderboardError);

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

  const data = entries.map((entry, index) => {
    const score = entry.data[LEADERBOARD_RATING_FIELD_NAME];
    const scoreNum =
      typeof score === 'number'
        ? score
        : typeof score === 'string'
        ? Number(score)
        : 0;
    const username =
      (entry.data.login as string) ??
      (entry.data.display_name as string) ??
      '—';
    return {
      position: (index + 1).toString(),
      username: String(username),
      score: Number.isFinite(scoreNum) ? scoreNum.toLocaleString('ru-RU') : '0',
    };
  });

  return (
    <div>
      <PageHelmet title="Лидерборд" description="Таблица лидеров" />
      <Header />
      <div className={styles.leaderboard__container}>
        <div className={styles.leaderboard__board}>
          <h2 className={styles.leaderboard__title}>Таблица лидеров</h2>
          {error && (
            <div className={styles.leaderboard__error}>
              <p>{error}</p>
              <Button
                view="outlined"
                onClick={() =>
                  dispatch(fetchLeaderboardThunk({ cursor: 0, limit: 10 }))
                }>
                Повторить
              </Button>
            </div>
          )}
          {isLoading && <Loader size="m" />}
          {!isLoading && !error && (
            <div className={styles.leaderboard__tableWrapper}>
              <Table data={data} columns={getColumns()} />
            </div>
          )}
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
  await dispatch(fetchLeaderboardThunk({ cursor: 0, limit: 10 }));
};
