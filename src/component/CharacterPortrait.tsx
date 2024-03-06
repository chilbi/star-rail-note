import Box from '@mui/joy/Box';

import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';

interface CharacterPortraitProps {
  portrait: string;
  isTest?: boolean;
}

export default function CharacterPortrait({ portrait, isTest }: CharacterPortraitProps) {
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
        src={(isTest ? STATE.hsrApiUrl : STATE.resUrl) + portrait}
        alt=""
        width={imageTheme.portraitSize}
        height={imageTheme.portraitSize}
      />
    </Box>
  );
}
