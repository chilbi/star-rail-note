import { NavLink } from 'react-router-dom';
import { styled } from '@mui/joy/styles';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';

import { STATE } from '../common/state';

export default function NavMenu() {
  return (
    <List sx={{ flexGrow: 0 }}>
      {!STATE.playerDataIsNull && <NavMenuItem to="/my-characters" icon="icon/sign/AvatarIcon.png" text="我的角色" />}
      <NavMenuItem to="/" icon="icon/sign/NoviceAvatarIcon.png" text="角色图鉴" />
      <NavMenuItem to="/light-cones" icon="icon/deco/DecoIcon2.png" text="光锥图鉴" />
    </List>
  );
}

const StyledNavLink = styled(NavLink)({ display: 'block', width: '100%', textDecoration: 'none' });

interface NavMenuItemProps {
  to: string;
  icon: string;
  text: string;
}

function NavMenuItem({ to, icon, text }: NavMenuItemProps) {
  return (
    <ListItem>
      <StyledNavLink to={to}>
        {({ isActive }) =>
          <ListItemButton color="primary" selected={isActive}>
            <img src={STATE.resUrl + icon} width={32} height={32} />
            <Typography level="title-md">{text}</Typography>
          </ListItemButton>
        }
      </StyledNavLink>
    </ListItem>
  )
}
