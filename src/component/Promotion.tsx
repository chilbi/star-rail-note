import Box from '@mui/joy/Box';

interface PromotionProps {
  value: number;
  count: number;
}

export default function Promotion({ value, count }: PromotionProps) {
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
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
