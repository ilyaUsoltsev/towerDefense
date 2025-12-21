import { AppDispatch, RootState } from './store';

import { initMainPage, MainPage } from './pages/Main';
import { initNotFoundPage, NotFoundPage } from './pages/NotFound';
import { initLoginPage, LoginPage } from './pages/Login';
import { initRegisterPage, RegisterPage } from './pages/Register';
import { initProfilePage, ProfilePage } from './pages/Profile';

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
    path: ROUTE.USER,
    Component: ProfilePage,
    fetchData: initProfilePage,
  },
  {
    path: ROUTE.ANY,
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
];
