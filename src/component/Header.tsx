import useMedia from 'react-use/lib/useMedia';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import ElementPathFilter from './ElementPathFilter';
import { toggleSidebar } from '../common/utils';
import { theme } from '../common/theme';

export default function Header() {
  const isStickySidebar = useMedia(`(min-width: ${theme.breakpoints.values.md}px)`);

  return (
    <Sheet
      className="Header"
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        width: '100vw',
        height: 'var(--Header-height)',
        zIndex: 895,
        p: 2,
        gap: 1,
        borderBottom: '1px solid',
        borderColor: 'background.level1',
        boxShadow: 'sm'
      }}
    >
      <GlobalStyles
        styles={theme => ({
          ':root': {
            '--Header-height': '52px',
            [theme.breakpoints.up('md')]: {
              '--Header-height': '0px',
            }
          }
        })}
      />
      <Typography level="title-md">Star Rail Note</Typography>
      <Box ml="auto" mr={1}>
        {!isStickySidebar && <ElementPathFilter />}
      </Box>
      <IconButton
        onClick={toggleSidebar}
        variant="outlined"
        color="neutral"
        size="sm"
      >
        <MenuIcon />
      </IconButton>
    </Sheet>
  );
}
