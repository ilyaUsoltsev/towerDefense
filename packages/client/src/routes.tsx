import { AppDispatch, RootState } from './store';

import { initMainPage, MainPage } from './pages/Main';
import { initNotFoundPage, NotFoundPage } from './pages/NotFound';
import { initLoginPage, LoginPage } from './pages/Login';
import { initRegisterPage, RegisterPage } from './pages/Register';
import { initError400Page, Error400Page } from './pages/Error400';

import { ROUTE } from './constants/ROUTE';

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
    path: ROUTE.ERROR_400,
    Component: Error400Page,
    fetchData: initError400Page,
  },
  {
    path: ROUTE.ANY,
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
];
