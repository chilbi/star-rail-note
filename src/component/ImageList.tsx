import Box from '@mui/joy/Box';
import useMedia from 'react-use/lib/useMedia';

import ImageIcon from './ImageIcon';
import ImagePreview from './ImagePreview';
import { imageTheme, theme } from '../common/theme';
import { ImageLike, nickname } from '../data/local';

interface ImageListProps<T extends ImageLike> {
  values: T[];
  onClick: (value: T) => void;
}

export default function ImageList<T extends ImageLike>({ values, onClick }: ImageListProps<T>) {
  const isUpSmall = useMedia(`(min-width: ${theme.breakpoints.values.sm}px)`);
  const ImagePreviewOrIcon = isUpSmall ? ImagePreview : ImageIcon;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, ${isUpSmall ? imageTheme.previewWidth : imageTheme.iconSize}px)`,
        justifyContent: 'center',
        gap: 2,
        p: 2
      }}
    >
      {values.map(value => (
        <ImagePreviewOrIcon key={value.id} value={value} name={nickname(value.name)} onClick={onClick} />
      ))}
    </Box>
  );
}
