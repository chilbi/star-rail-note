import Box from '@mui/joy/Box';

interface RarityProps {
  rarity: number;
  height: number;
}

export default function Rarity({ rarity, height }: RarityProps) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        margin: 0.5,
        width: 47 / (52 / height) * rarity,
        height: height,
        backgroundImage: `url(${import.meta.env.BASE_URL}rarity.png)`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `auto ${height}px`
      }}
    />
  );
}
