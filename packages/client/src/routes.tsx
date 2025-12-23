import { AppDispatch, RootState } from './store';

import { initNotFoundPage, NotFoundPage } from './pages/ErrorsPage/NotFound';
import { GamePage, initGamePage } from './pages/Game';
import { initLoginPage, LoginPage } from './pages/Login';
import { initMainPage, MainPage } from './pages/MainMenu';
import { initRegisterPage, RegisterPage } from './pages/Register';

import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
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
    path: ROUTE.ANY,
    element: <NotFoundPage />,
    fetchData: initNotFoundPage,
  },
];
