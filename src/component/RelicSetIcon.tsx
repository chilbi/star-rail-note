import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import { imageTheme } from '../common/theme';
import { STATE } from '../common/state';

interface RelicSetIconProps {
  relicSet: RelicSet;
  onClick: (relicSet: RelicSet) => void;
}

export default function RelicSetIcon({ relicSet, onClick }: RelicSetIconProps) {
  return (
    <Box
      onClick={() => onClick(relicSet)}
      sx={{
        // 稀有度背景颜色
        position: 'relative',
        borderTopRightRadius: '8px',
        backgroundImage: imageTheme.getItemRarityImageColor(5),
        cursor: 'pointer'
      }}
    >
      <Box
        sx={{
          // 内边线
          position: 'absolute',
          zIndex: 0,
          top: '3px',
          right: '3px',
          bottom: '3px',
          left: '3px',
          borderTopRightRadius: '8px',
          border: '1px solid #ffffff55'
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          borderTopRightRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <img
          src={STATE.resUrl + relicSet.icon}
          alt=""
          width={100}
          height={100}
        />
      </Box>
      <Typography
        level="title-sm"
        children={relicSet.name}
        fontSize="10px"
        lineHeight="14px"
        textColor="common.white"
        textAlign="center"
        sx={{
          position: 'absolute',
          zIndex: 2,
          bottom: '1px',
          left: 0,
          right: 0,
          backgroundColor: '#00000099',
          width: '100%',
          overflow: 'hidden',
          textWrap: 'nowrap',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      />
      <Box
        sx={{
          // 鼠标悬浮边框和颜色
          position: 'absolute',
          zIndex: 2,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderTopRightRadius: '8px',
          border: '2px solid',
          borderColor: '#ffffff00',
          backgroundColor: '#eeeeee00',
          '&:hover': {
            borderColor: '#ffffffff',
            backgroundColor: '#eeeeee33'
          }
        }}
      />
    </Box>
  );
}
