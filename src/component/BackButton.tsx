import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/joy/IconButton';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

export default function BackButton() {
  const navigate = useNavigate();
  const handleBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <IconButton
      variant="solid"
      color="primary"
      onClick={handleBack}
      sx={{
        position: 'absolute',
        right: 32,
        bottom: 32,
        zIndex: 999
      }}
    >
      <ArrowBackIosNewRoundedIcon />
    </IconButton>
  );
}
