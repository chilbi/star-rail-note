import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarHalfRoundedIcon from '@mui/icons-material/StarHalfRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface SubAffixRateProps {
  count: number;
  step: number;
}

export default function SubAffixRate({ count, step }: SubAffixRateProps) {
  return (
    <>
      {Array(count).fill(null).map((_, i) => {
        const rate = step - i * 2;
        const Icon = rate > 1 ? StarRoundedIcon : rate > 0 ? StarHalfRoundedIcon : StarBorderRoundedIcon;
        return (
          <Icon
            key={i}
            color="warning"
            style={{ transform: `translateX(-${3.5 * i}px)` }}
            sx={{  width: '12px', height: '12px' }}
          />
        );
      })}
    </>
  );
}
