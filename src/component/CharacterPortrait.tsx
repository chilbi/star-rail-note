import Box from '@mui/joy/Box';

import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';

interface CharacterPortraitProps {
  portrait: string;
}

export default function CharacterPortrait({ portrait }: CharacterPortraitProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: '50%',
        zIndex: 0,
        width: imageTheme.portraitSize,
        height: imageTheme.portraitSize,
        transform: 'translate(-50%, -10%)',
        '&:active': { zIndex: 2 }
      }}
    >
      <img
        src={STATE.resUrl + portrait}
        alt=""
        width={imageTheme.portraitSize}
        height={imageTheme.portraitSize}
      />
    </Box>
  );
}
