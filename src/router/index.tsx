import { createHashRouter, defer } from 'react-router-dom';

import RootLayout from './RootLayout';
import ErrorPage from './ErrorPage';
import Characters from './Characters';
import CharacterDetail from './CharacterDetail';
import LightCones from './LightCones';
import LightConeDetail from './LightConeDetail';
import MyCharacters from './MyCharacters';
import {
  characterDetailLoader,
  lightConeDetailLoader,
  playerDataLoader,
  rootLayoutLoader,
  starRailDataLoader
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
            loader: starRailDataLoader,
            Component: Characters
          },
          {
            path: 'my-characters',
            loader: playerDataLoader,
            Component: MyCharacters
          },
          {
            path: 'character/:id',
            loader: args => defer({ characterDetailData: characterDetailLoader(args) }),
            Component: CharacterDetail
          },
          {
            path: 'light-cones',
            loader: starRailDataLoader,
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
