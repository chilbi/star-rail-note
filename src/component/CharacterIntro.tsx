import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Tooltip from '@mui/joy/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Rarity from './Rarity';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import ElementsPaths from './ElementsPaths';

interface CharacterIntroProps {
  name: string;
  rarity: number;
  element: string;
  path: string;
  onNameClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export default function CharacterIntro({ name, rarity, element, path, onNameClick }: CharacterIntroProps) {
  const [activeTab, setActiveTab] = useState<'element' | 'path' | null>(null);
  const elementData = STATE.starRailData.elements[element];
  const pathData = STATE.starRailData.paths[path];

  const handleOpenElement = useCallback(() => setActiveTab('element'), []);
  const handleOpenPath = useCallback(() => setActiveTab('path'), []);
  const handleClose = useCallback(() => setActiveTab(null), []);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 1.5,
          pb: 1,
          borderTopRightRadius: '24px',
          backgroundImage: `linear-gradient(${imageTheme.previewRarityColors[rarity]}72, #00000000)`
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {onNameClick ? (
            <Tooltip title="查看角色图鉴" color="primary" arrow>
              <Typography
                level="h3"
                onClick={onNameClick}
                children={name}
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
          ) : (
            <Typography level="h3" children={name} />
          )}
          <Rarity rarity={rarity} height={16} />
        </Box>
        <img
          src={STATE.resUrl + elementData.icon}
          alt={elementData.name}
          width="36px"
          height="36px"
          style={{ cursor: 'pointer' }}
          onClick={handleOpenElement}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          backgroundColor: '#ffffff33',
          cursor: 'pointer'
        }}
        onClick={handleOpenPath}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: '2px' }}>
          <img src={STATE.resUrl + pathData?.icon} alt={pathData?.name} width="24px" height="24px" />
          <Typography level="title-lg" ml={0.5}>{pathData?.name}</Typography>
        </Box>
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 0.75,
            transform: 'rotate(180deg)',
            '--Icon-color': '--joy-palette-text-primary'
          }}
        >
          <InfoOutlinedIcon />
        </Box>
      </Box>

      <ElementsPaths
        activeTab={activeTab}
        element={element}
        path={path}
        onClose={handleClose}
      />
    </>
  );
}
