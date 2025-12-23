import { AppDispatch, RootState } from './store';

import { initMainPage, MainPage } from './pages/MainMenu';
import { initNotFoundPage, NotFoundPage } from './pages/ErrorsPage/NotFound';
import { initLoginPage, LoginPage } from './pages/Login';
import { initRegisterPage, RegisterPage } from './pages/Register';

import { ROUTE } from './constants/ROUTE';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

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
