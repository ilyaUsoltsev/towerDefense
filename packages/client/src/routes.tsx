import { AppDispatch, RootState } from './store';

import { initMainPage, MainPage } from './pages/Main';
import { initFriendsPage, FriendsPage } from './pages/FriendsPage';
import { initNotFoundPage, NotFoundPage } from './pages/NotFound';
import { initLoginPage, LoginPage } from './pages/Login';
import { initRegisterPage, RegisterPage } from './pages/Register';
import { initError400Page, Error400Page } from './pages/Error400';

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
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '/login',
    Component: LoginPage,
    fetchData: initLoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
    fetchData: initRegisterPage,
  },
  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
  },
  {
    path: '/400',
    Component: Error400Page,
    fetchData: initError400Page,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
];
