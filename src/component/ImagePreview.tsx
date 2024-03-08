import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

import Rarity from './Rarity';
import { imageTheme } from '../common/theme';
import { STATE } from '../common/state';
import { ImageLike } from '../data/local';

interface ImagePreviewProps<T extends ImageLike> {
  value: T;
  name: string;
  onClick: (value: T) => void;
}

export default function ImagePreview<T extends ImageLike>({ value, name, onClick }: ImagePreviewProps<T>) {
  return (
    <Box
      onClick={() => onClick(value)}
      sx={{
        // 透明背景颜色
        position: 'relative',
        width: imageTheme.previewWidth,
        borderTopRightRadius: '10px',
        backgroundColor: '#00000033',
        cursor: 'pointer',
        // 鼠标悬浮边框和颜色
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderTopRightRadius: '10px',
          border: '2px solid',
          borderColor: '#ffffff00',
          backgroundColor: '#eeeeee00'
        },
        '&:hover::after': {
          borderColor: '#ffffffff',
          backgroundColor: '#eeeeee33'
        }
      }}
    >
      <AspectRatio ratio="374/512" variant="plain" sx={{ borderTopRightRadius: '10px', overflow: 'hidden' }}>
        <img src={(value.isTest ? STATE.hsrApiUrl : STATE.resUrl) + value.preview} alt="" loading="lazy" />
      </AspectRatio>
      {value.isTest && (
        <Typography
          component="span"
          level="title-sm"
          variant="solid"
          color="danger"
          children={'ver.' + STATE.starRailData.test_version!.slice(-1)}
          sx={{
            position: 'absolute',
            zIndex: 1,
            top: '10px',
            right: '10px',
            display: 'inline-block'
          }}
        />
      )}
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
              width: imageTheme.previewElementSize,
              height: imageTheme.previewElementSize,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imageTheme.previewElementSize}px ${imageTheme.previewElementSize}px`
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
              width: imageTheme.previewElementSize,
              height: imageTheme.previewElementSize,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imageTheme.previewElementSize}px ${imageTheme.previewElementSize}px`,
              backgroundImage: `url(${STATE.resUrl + STATE.starRailData.paths[value.path].icon})`
            }
          }))
        }}
      />
      <Box
        sx={{
          // 稀有度背景颜色
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          textAlign: 'center',
          '&::before, &::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            width: '100%'
          },
          '&::before': {
            height: '100%',
            backgroundImage: `linear-gradient(#00000000, ${imageTheme.previewRarityColors[value.rarity]}72)`
          },
          '&::after': {
            bottom: 0,
            height: '5px',
            backgroundColor: imageTheme.previewRarityColors[value.rarity]
          },
        }}
      >
        <Typography level="title-md" textColor="common.white">{name}</Typography>
        <Rarity rarity={value.rarity} height={16} />
      </Box>
    </Box>
  );
}
