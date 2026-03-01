import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import { startServiceWorker } from './utils/ServiceWorker';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { routes } from './routes';
import { ThemeProvider } from '@gravity-ui/uikit';
import './index.css';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from './store';
import { fetchThemeThunk, selectTheme, setTheme } from './slices/themeSlice';
import { selectUser } from './slices/userSlice';
import type { Theme } from './api/type';

const ThemedApp: FC<PropsWithChildren> = ({ children }) => {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // On mount: restore theme from localStorage for unauth users
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem('theme') as Theme | null;
      if (stored) dispatch(setTheme(stored));
    }
  }, []);

  // On login (client-side, without SSR): fetch theme from DB
  const prevUserRef = useRef<typeof user>(user);
  useEffect(() => {
    const wasLoggedOut = prevUserRef.current === null;
    prevUserRef.current = user;
    if (user && wasLoggedOut) {
      dispatch(fetchThemeThunk());
    }
  }, [user]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <ThemedApp>
      <RouterProvider router={router} />
    </ThemedApp>
  </Provider>
);

startServiceWorker();
