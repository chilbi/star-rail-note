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
        zIndex: 900,
        width: 'var(--Sidebar-width)',
        height: '100dvh',
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none'
        },
        transition: 'transform 0.4s, width 0.4s'
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
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          height: '100%',
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: { md: '#00000066' },
          overflow: 'hidden auto'
        }}
      >
        <LoginLogout uidItems={uidItems} />
        <NavMenu />
        {isStickySidebar && <div><ElementPathFilter /></div>}
        <Box mt="auto">
          <DataSelect starRailDataInfoItems={starRailDataInfoItems} />
          <ResUrlSelect />
        </Box>
      </Box>
    </Sheet>
  );
}
