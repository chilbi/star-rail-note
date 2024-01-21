import { Suspense, useRef } from 'react';
import { Await, Outlet, useLoaderData } from 'react-router-dom';
import Box from '@mui/joy/Box';

import Loading from '../component/Loding';
import Header from '../component/Header';
import Sidebar from '../component/Sidebar';
import { RootLayoutData } from './loaders';
import { useElementScrollRestoration } from '../common/hooks';

export default function RootLayout() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useLoaderData() as any;
  const mainRef = useRef<HTMLDivElement>();
  useElementScrollRestoration(mainRef);

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={data.rootLayoutData}
        children={({ uidItems, starRailDataInfoItems }: RootLayoutData) => {
          return (
            <Box className="RootLayout" sx={{ display: 'flex', height: '100dvh' }}>
              <Header />
              <Sidebar
                uidItems={uidItems}
                starRailDataInfoItems={starRailDataInfoItems}
              />
              <Box
                className="Main"
                sx={{
                  flex: 1,
                  pt: { xs: 'var(--Header-height)', md: '0px' },
                  width: { xs: '100vw', md: 'calc(100vw - var(--Sidebar-width, 0))' },
                  height: '100dvh'
                }}
              >
                <Box
                  ref={mainRef}
                  className="Content"
                  sx={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden auto'
                  }}
                >
                  <Outlet />
                </Box>
              </Box>
            </Box>
          );
        }}
      />
    </Suspense>
  );
}
