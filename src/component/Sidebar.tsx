import useMedia from 'react-use/lib/useMedia';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';

import NavMenu from './NavMenu';
import ElementPathFilter from './ElementPathFilter';
import ResUrlSelect from './ResUrlSelect';
import LoginLogout from './LoginLogout';
import DataSelect from './DataSelect';
import { closeSidebar } from '../common/utils';
import { theme } from '../common/theme';

interface SidebarProps {
  uidItems: string[];
  starRailDataInfoItems: StarRailDataInfo[];
}

export default function Sidebar({ uidItems, starRailDataInfoItems }: SidebarProps) {
  const isStickySidebar = useMedia(`(min-width: ${theme.breakpoints.values.md}px)`);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none'
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 900,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderRight: '1px solid',
        borderColor: 'divider',
        backgroundColor: { md: '#00000066' },
        // '&::before, &::after': {
        //   content: '""',
        //   position: 'absolute',
        //   bottom: 16,
        //   left: 16,
        //   display: 'block',
        //   width: '100%',
        //   height: '110px',
        //   backgroundSize: 'auto 110px',
        //   backgroundRepeat: 'no-repeat',
        // },
        // '&::before': {
        //   zIndex: -2,
        //   backgroundImage: `url(${STATE.resUrl + 'icon/logo/bg.png'})`,
        // },
        // '&::after': {
        //   zIndex: -1,
        //   backgroundImage: `url(${STATE.resUrl + 'icon/logo/cn.png'})`,
        // }
      }}
    >
      <GlobalStyles
        styles={theme => ({
          ':root': {
            '--Sidebar-width': 'min(calc(100% - 32px), 280px)',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '300px'
            }
          }
        })}
      />
      <Box
        className="SidebarOverlay"
        onClick={closeSidebar}
        sx={{
          position: 'fixed',
          zIndex: 888,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)'
          }
        }}
      />
      <LoginLogout uidItems={uidItems} />
      <NavMenu />
      {isStickySidebar && <div><ElementPathFilter /></div>}
      <Box mt="auto">
        <DataSelect starRailDataInfoItems={starRailDataInfoItems} />
        <ResUrlSelect />
      </Box>
    </Sheet>
  );
}
