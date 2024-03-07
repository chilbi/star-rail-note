import { extendTheme } from '@mui/joy/styles';

export const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500
    }
  },
  fontFamily: {
    body: '-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif',
    display: '-apple-system,BlinkMacSystemFont,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif'
  },
  fontWeight: {
    xs: 300,
    sm: 400,
    md: 600,
    lg: 700,
    xl: 800
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          '50': '#f5f3ff',
          '100': '#ede9fe',
          '200': '#ddd6fe',
          '300': '#c4b5fd',
          '400': '#a78bfa',
          '500': '#8b5cf6',
          '600': '#7c3aed',
          '700': '#6d28d9',
          '800': '#5b21b6',
          '900': '#4c1d95'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          '50': '#f5f3ff',
          '100': '#ede9fe',
          '200': '#ddd6fe',
          '300': '#c4b5fd',
          '400': '#a78bfa',
          '500': '#8b5cf6',
          '600': '#7c3aed',
          '700': '#6d28d9',
          '800': '#5b21b6',
          '900': '#4c1d95'
        }
      }
    }
  }
});

export const imageTheme = {
  previewWidth: 140,
  previewElementSize: 24,
  portraitSize: 512,
  propertySize: 18,
  materialSize: 36,
  iconSize: 72,
  iconElementSize: 14,
  rankColor: '#18ffcd',
  itemRarityColors: [
    ['#494b58', '#878790'],
    ['#3f4f66', '#418183'],
    ['#41456d', '#497ab9'],
    ['#484969', '#9465c5'],
    ['#90655e', '#cdaa77'],
    ['#000000', '#000000']
  ],
  previewRarityColors: {
    1: '#878790',
    2: '#418183',
    3: '#497ab9',
    4: '#af86fe',
    5: '#ffcf70',
    6: '#ffffff'
  } as Record<number, string>,
  getItemRarityImageColor: (rarity: number) =>
    `linear-gradient(${imageTheme.itemRarityColors[rarity - 1][0]}, ${imageTheme.itemRarityColors[rarity - 1][1]})`
};
