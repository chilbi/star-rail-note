import Box from '@mui/joy/Box';

interface FlexItemProps {
  children?: React.ReactNode;
}

export default function FlexItem(props: FlexItemProps) {
  return (
    <Box
      children={props.children}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 2,
        p: { xs: 1, sm: 2 },
        maxWidth: { xs: '100%', sm: '50%' }
      }}
    />
  );
}
