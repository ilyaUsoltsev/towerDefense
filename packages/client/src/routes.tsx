import { AppDispatch, RootState } from './store';

import { initMainPage, MainPage } from './pages/Main';
import { initNotFoundPage, NotFoundPage } from './pages/NotFound';
import { initLoginPage, LoginPage } from './pages/Login';
import { initRegisterPage, RegisterPage } from './pages/Register';

import { ROUTE } from './constants/ROUTE';
import { Component } from 'react';
import { Forum } from './pages/Forum/pages/Forum';
import { ForumNew } from './pages/Forum/pages/NewPost';
import { ForumDiscussion } from './pages/Forum/pages/Discussion';

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
    path: ROUTE.ANY,
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
  {
    path: ROUTE.FORUM,
    Component: Forum,
  },
  {
    path: ROUTE.FORUM_NEW,
    Component: ForumNew,
  },
  {
    path: ROUTE.FORUM_TOPIC,
    Component: ForumDiscussion,
  },
];
