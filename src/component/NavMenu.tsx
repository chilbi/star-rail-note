import { NavLink } from 'react-router-dom';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';

import { STATE } from '../common/state';

export default function NavMenu() {
  return (
    <List sx={{ flexGrow: 0 }}>
      <ListItem>
        <NavLink to="/" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
          {({ isActive }) =>
            <ListItemButton selected={isActive}>
              <img src={STATE.resUrl + 'icon/sign/AvatarIcon.png'} width={32} height={32} />
              <Typography level="title-md">角色图鉴</Typography>
            </ListItemButton>
          }
        </NavLink>
      </ListItem>
      <ListItem>
        <NavLink to="/light-cones" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
          {({ isActive }) =>
            <ListItemButton selected={isActive}>
              <img src={STATE.resUrl + 'icon/deco/DecoIcon2.png'} width={32} height={32} />
              <Typography level="title-md">光锥图鉴</Typography>
            </ListItemButton>
          }
        </NavLink>
      </ListItem>
    </List>
  );
}
