import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Box from '@mui/joy/Box';

interface SubAffixRateProps {
  count: number;
  step: number;
  isRecommend: boolean;
}

export default function SubAffixRate({ count, step, isRecommend }: SubAffixRateProps) {
  return (
    <Box component="span" display="inline-flex" ml="3.5px">
      {Array(count).fill(null).map((_, i) => {
        const rate = step - i * 2;
        const Icon = rate > 1 ? StarRoundedIcon : rate > 0 ? StarHalfRoundedIcon : StarBorderRoundedIcon;
        return (
          <Icon
            key={i}
            sx={{ ml: '-3.5px', width: '12px', height: '12px', color: isRecommend ? 'warning.400' : 'neutral.400' }}
          />
        );
      })}
    </Box>
  );
}
