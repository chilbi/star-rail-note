import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';

interface PromotionMaterialConsumeProps {
  promotion: number;
  totalMaterial: MaterialConsume[];
}

export default function PromotionMaterialConsume({ promotion, totalMaterial }: PromotionMaterialConsumeProps) {
  return (
    <>
      <Typography
        level="title-md"
        textColor="warning.300"
        children={`晋阶材料 ${promotion}/6`}
        px={3}
        py={0.5}
      />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: 0.5,
          px: 2,
          py: 1
        }}
      >
        {totalMaterial.map(item => {
          let itemData = STATE.starRailData.items[item.id];
          if (itemData == undefined) {
            itemData = {
              rarity: 1,
              icon: 'icon/path/None.png',
            } as Item;
          }
          return (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Box
                key={item.id}
                sx={{
                  px: 0.5,
                  pt: 0.5,
                  borderTopRightRadius: '8px',
                  backgroundImage: imageTheme.getItemRarityImageColor(itemData.rarity)
                }}
              >
                <img
                  src={STATE.resUrl + itemData.icon}
                  alt={'item' + item.id}
                  width={imageTheme.materialSize}
                  height={imageTheme.materialSize}
                />
              </Box>
              <Typography level="body-xs" textColor="text.primary">{item.num}</Typography>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
