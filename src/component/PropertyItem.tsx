import { SxProps } from '@mui/joy/styles/types';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import { imageTheme } from '../common/theme';

interface PropertyItemProps {
  icon: string;
  name: React.ReactNode;
  value: React.ReactNode;
  sx?: SxProps;
}

export default function PropertyItem({ sx = {}, icon, name, value }: PropertyItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 0.5,
        ...sx
      }}
    >
      <Box
        component="span"
        sx={{
          width: imageTheme.propertySize,
          height: imageTheme.propertySize,
          mr: 0.25
        }}
      >
        <img
          src={icon}
          alt=""
          width={imageTheme.propertySize}
          height={imageTheme.propertySize}
        />
      </Box>
      <Typography
        level="body-sm"
        textColor="common.white"
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: 120,
          overflow: 'hidden',
          textWrap: 'nowrap',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
        children={name}
      />
      {value != null && (
        <Typography
          level="body-sm"
          textColor="common.white"
          ml="auto"
          children={value}
        />
      )}
    </Box>
  );
}
