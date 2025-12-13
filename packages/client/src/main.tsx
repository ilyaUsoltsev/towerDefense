import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'

import { routes } from './routes'
import { ThemeProvider } from '@gravity-ui/uikit'

const router = createBrowserRouter(routes)

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <ThemeProvider>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ThemeProvider>
)
