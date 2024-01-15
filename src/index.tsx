import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssVarsProvider, StyledEngineProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import { theme } from './common/theme';
import { router } from './router';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <CssVarsProvider defaultMode="dark" theme={theme} disableTransitionOnChange>
        <CssBaseline />
        <RouterProvider router={router} />
      </CssVarsProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
