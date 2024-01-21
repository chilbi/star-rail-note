import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import Promotion from './Promotion';
import { getPromotionMaxLevel } from '../data/local';

interface PromotionLevelRankProps {
  promotion: number;
  level: number;
  rankText: string;
}

export default function PromotionLevelRank({ promotion, level, rankText }: PromotionLevelRankProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        pt: 1.5,
        pb: 0.5
      }}
    >
      <div>
        <Promotion value={promotion} count={6} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography level="title-md" mr={0.5}>等级</Typography>
          <Typography level="title-lg">{level}</Typography>
          <Typography level="body-md">/</Typography>
          <Typography level="body-md" textColor="#ffffff88">{getPromotionMaxLevel(promotion)}</Typography>
        </Box>
      </div>
      <Typography
        level="title-sm"
        textColor="common.black"
        lineHeight="1.4em"
        sx={{
          px: 0.5,
          borderRadius: '4px',
          backgroundColor: '#ffffff'
        }}
        children={rankText}
      />
    </Box>
  );
}
