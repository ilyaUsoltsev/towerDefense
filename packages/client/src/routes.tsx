import { AppDispatch, RootState } from './store';

import { initNotFoundPage, NotFoundPage } from './pages/ErrorsPage/NotFound';
import { GamePage, initGamePage } from './pages/Game';
import { initLoginPage, LoginPage } from './pages/Login';
import { initMainPage, MainPage } from './pages/MainMenu';
import { initRegisterPage, RegisterPage } from './pages/Register';
import { initError400Page, Error400Page } from './pages/Error400';

import { initError500Page, Error500Page } from './pages/Error500';
import { initLeaderboardPage, LeaderboardPage } from './pages/LeaderboardPage';
import { initProfilePage, ProfilePage } from './pages/Profile';

import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Forum } from './pages/Forum/pages/Forum';
import { ForumNew } from './pages/Forum/pages/NewPost';
import { ForumDiscussion } from './pages/Forum/pages/Discussion';
import { ROUTE } from './constants/ROUTE';

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

export const routes = [
  {
    path: ROUTE.ROOT,
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
    fetchData: initMainPage,
  },
  {
    path: ROUTE.GAME,
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
    fetchData: initGamePage,
  },
  {
    path: ROUTE.LOGIN,
    element: <LoginPage />,
    fetchData: initLoginPage,
  },
  {
    path: ROUTE.REGISTER,
    element: <RegisterPage />,
    fetchData: initRegisterPage,
  },
  {
    path: ROUTE.ERROR_400,
    Component: Error400Page,
    fetchData: initError400Page,
  },
  {
    path: ROUTE.ERROR_500,
    Component: Error500Page,
    fetchData: initError500Page,
  },
  {
    path: ROUTE.LEADERBOARD,
    Component: LeaderboardPage,
    fetchData: initLeaderboardPage,
  },
  {
    path: ROUTE.USER,
    Component: ProfilePage,
    fetchData: initProfilePage,
  },
  {
    path: ROUTE.ANY,
    element: <NotFoundPage />,
    fetchData: initNotFoundPage,
  },
  {
    path: ROUTE.FORUM,
    element: (
      <ProtectedRoute>
        <Forum />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTE.FORUM_NEW,
    element: (
      <ProtectedRoute>
        <ForumNew />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTE.FORUM_TOPIC,
    element: (
      <ProtectedRoute>
        <ForumDiscussion />
      </ProtectedRoute>
    ),
  },
];
