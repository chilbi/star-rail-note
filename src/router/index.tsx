import { createHashRouter, defer } from 'react-router-dom';

import RootLayout from './RootLayout';
import ErrorPage from './ErrorPage';
import Characters from './Characters';
import CharacterDetail from './CharacterDetail';
import LightCones from './LightCones';
import LightConeDetail from './LightConeDetail';
import {
  characterDetailLoader,
  lightConeDetailLoader,
  rootLayoutLoader
} from './loaders';
import {
  rootLayoutAction
} from './actions';

export const router = createHashRouter([
  {
    path: '/',
    loader: () => defer({ rootLayoutData: rootLayoutLoader() }),
    action: rootLayoutAction,
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        ErrorBoundary: ErrorPage,
        children: [
          {
            index: true,
            Component: Characters
          },
          {
            path: 'character/:id',
            loader: args => defer({ characterDetailData: characterDetailLoader(args) }),
            Component: CharacterDetail
          },
          {
            path: 'light-cones',
            Component: LightCones
          },
          {
            path: 'light-cone/:id',
            loader: args => defer({ lightConeDetailData: lightConeDetailLoader(args) }),
            Component: LightConeDetail
          },
        ]
      }
    ]
  },
  {
    path: '*',
    Component: ErrorPage
  }
]);
