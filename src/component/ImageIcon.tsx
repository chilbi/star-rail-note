import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import Rarity from './Rarity';
import { imageTheme } from '../common/theme';
import { STATE } from '../common/state';
import { ImageLike } from '../data/local';

interface ImageIconProps<T extends ImageLike> {
  value: T;
  name: string;
  onClick: (value: T) => void;
}

export default function ImageIcon<T extends ImageLike>({ value, name, onClick }: ImageIconProps<T>) {
  return (
    <Box
      onClick={() => onClick(value)}
      sx={{
        // 稀有度背景颜色
        position: 'relative',
        borderTopRightRadius: '8px',
        backgroundImage: imageTheme.getPreviewRarityColor(value.rarity),
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
          src={STATE.resUrl + value.icon}
          alt=""
          width={imageTheme.iconSize}
          height={imageTheme.iconSize}
        />
      </Box>
      <Box
        sx={{
          // 属性和命途图标
          position: 'absolute',
          zIndex: 1,
          top: 0,
          left: 0,
          ...(value.element ? ({
            '&::before, &::after': {
              content: '""',
              display: 'block',
              mt: 0.5,
              ml: 0.5,
              width: imageTheme.iconElementSize,
              height: imageTheme.iconElementSize,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imageTheme.iconElementSize}px ${imageTheme.iconElementSize}px`
            },
            '&::before': {
              backgroundImage: `url(${STATE.resUrl + STATE.starRailData.elements[value.element].icon})`
            },
            '&::after': {
              backgroundImage: `url(${STATE.resUrl + STATE.starRailData.paths[value.path].icon})`
            }
          }) : ({
            '&::after': {
              content: '""',
              display: 'block',
              mt: 0.5,
              ml: 0.5,
              width: imageTheme.iconElementSize,
              height: imageTheme.iconElementSize,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imageTheme.iconElementSize}px ${imageTheme.iconElementSize}px`,
              backgroundImage: `url(${STATE.resUrl + STATE.starRailData.paths[value.path].icon})`
            }
          }))
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          bottom: '4px',
          left: 0,
          right: 0,
          textAlign: 'center'
        }}
      >
        <Rarity rarity={value.rarity} height={12} />
      </Box>
      <Typography
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
          backgroundColor: '#000000',
          width: '100%',
          overflow: 'hidden',
          textWrap: 'nowrap',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
        {name}
      </Typography>
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
