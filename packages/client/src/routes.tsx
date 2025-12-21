import { AppDispatch, RootState } from './store';

import { initMainPage, MainPage } from './pages/Main';
import { initNotFoundPage, NotFoundPage } from './pages/NotFound';
import { initLoginPage, LoginPage } from './pages/Login';
import { initRegisterPage, RegisterPage } from './pages/Register';
import { initError500Page, Error500Page } from './pages/Error500';

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
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: ROUTE.LOGIN,
    Component: LoginPage,
    fetchData: initLoginPage,
  },
  {
    path: ROUTE.REGISTER,
    Component: RegisterPage,
    fetchData: initRegisterPage,
  },
  {
    path: ROUTE.ERROR_500,
    Component: Error500Page,
    fetchData: initError500Page,
  },
  {
    path: '*',
    path: ROUTE.ANY,
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
];
