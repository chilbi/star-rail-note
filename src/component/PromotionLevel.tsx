import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Slider from '@mui/joy/Slider';

import Promotion from './Promotion';
import { getPromotionMaxLevel, promotionMarks } from '../data/local';

interface PromotionLevelProps {
  promotion: number;
  level: number;
  onPromotionChagne: (promotion: number) => void;
  onLevelChange: (event: Event, value: number, activeThumb: number) => void;
}

export default function PromotionLevel({ promotion, level, onPromotionChagne, onLevelChange }: PromotionLevelProps) {
  return (
    <>
      <Box px={3} pt={1.5} pb={0.5}>
        <Promotion value={promotion} count={6} onClick={onPromotionChagne} />
        <Box display="flex" alignItems="center">
          <Typography level="title-md" mr={0.5}>等级</Typography>
          <Typography level="title-lg">{level}</Typography>
          <Typography level="body-md">/</Typography>
          <Typography level="body-md" textColor="#ffffff88">{getPromotionMaxLevel(promotion)}</Typography>
        </Box>
      </Box>
      <Box px={3}>
        <Slider
          min={1}
          max={80}
          marks={promotionMarks}
          size="sm"
          // color="neutral"
          value={level}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={onLevelChange as any}
          sx={{ py: 1 }} />
      </Box>
    </>
  );
}
