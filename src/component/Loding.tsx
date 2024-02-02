import Box from '@mui/joy/Box/Box';
import CircularProgress from '@mui/joy/CircularProgress/CircularProgress';
import Typography from '@mui/joy/Typography/Typography';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        position: 'fixed',
        zIndex: 999,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
      <CircularProgress />
      <Typography level="h4">加载中……</Typography>
    </Box>
  );
}
