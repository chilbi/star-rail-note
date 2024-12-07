import { useCallback } from 'react';
import { useFetcher } from 'react-router-dom';
import IconButton from '@mui/joy/IconButton';
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Typography from '@mui/joy/Typography';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';

import { STATE } from '../common/state';
import { submitForm } from '../common/utils';

export default function ElementPathFilter() {
  const fetcher = useFetcher();

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    submitForm(fetcher, {
      method: 'POST',
      action: '/',
      type: 'Selected_element_path/toggle',
      value: e.currentTarget.getAttribute('data-value') as string,
    })
  }, [fetcher]);

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{
          root: {
            variant: 'plain',
            color: STATE.selectedElementPath.length < 1 ? 'neutral' : 'warning'
          }
        }}
      >
        <FilterAltRoundedIcon />
        <Typography
          level="title-md"
          sx={{
            display: { xs: 'none', md: 'inline-block' },
            mx: 1
          }}
          children="筛选属性和命途"
        />
      </MenuButton>
      <Menu
        sx={{
          '--List-padding': '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)'
        }}
      >
        {STATE.elements.map(key => {
          const element = STATE.starRailData.elements[key];
          return (
            <MenuItem
              key={key}
              orientation="vertical"
              selected={STATE.selectedElementPath.indexOf(key) > -1}
              data-value={key}
              onClick={handleClick}
            >
              <img src={STATE.resUrl + element.icon} width={24} height={24}/>
              <Typography level="body-sm">{element.name}</Typography>
            </MenuItem>
          );
        })}
        {STATE.paths.map(key => {
          const path = STATE.starRailData.paths[key];
          return (
            <MenuItem
              key={key}
              orientation="vertical"
              selected={STATE.selectedElementPath.indexOf(key) > -1}
              data-value={key}
              onClick={handleClick}
            >
              <img src={STATE.resUrl + path?.icon} width={24} height={24} />
              <Typography level="body-sm">{path?.name}</Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Dropdown>
  );
}
