import Box from '@mui/joy/Box';

interface PromotionProps {
  value: number;
  count: number;
  onClick?: (promotion: number) => void;
}

export default function Promotion({ value, count, onClick }: PromotionProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        py: 0.5
      }}
    >
      {Array(count).fill(null).map((_, i) => (
        <Box
          key={i}
          onClick={onClick ? (() => {
            onClick(i + 1 === value ? i : i + 1);
          }) : undefined}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            cursor: onClick ? 'pointer' : 'default',
            '&::before, &::after': {
              content: '""',
              display: 'block',
              border: '5px solid transparent'
            },
            '&::before': {
              borderTopWidth: 0,
              borderBottom: '8px solid ' + (i < value ? '#ffdf99' : '#7f7050'),
            },
            '&::after': {
              borderBottomWidth: 0,
              borderTop: '8px solid ' + (i < value ? '#ffdf99' : '#7f7050'),
            }
          }}
        />
      ))}
    </Box>
  );
}
