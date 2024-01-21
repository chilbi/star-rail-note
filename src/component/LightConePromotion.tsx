import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';

import Promotion from './Promotion';
import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import { baseStepValue, formatProperty, getPromotionLevel, getPromotionMaxLevel, getTotalPromotionMaterial, promotionMarks } from '../data/local';

interface LightConePromotionProps {
  lightCone: LightCone;
}

export default function LightConePromotion({ lightCone }: LightConePromotionProps) {
  const [level, setLevel] = useState(80);
  const lightConePromotion = STATE.starRailData.light_cone_promotions[lightCone.id];
  const promotion = getPromotionLevel(level);
  const promotionValue = lightConePromotion.values[promotion];
  const totalMaterial = getTotalPromotionMaterial(promotion, lightConePromotion.materials);

  const handleChange = useCallback((_: Event, value: number) => {
    setLevel(value);
  }, []);

  return (
    <>
      <Box px={3} pt={1.5} pb={0.5}>
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
          onChange={handleChange as any}
          sx={{ py: 1 }}
        />
      </Box>
      <Box py={1}>
        {([
          ['BaseHP', promotionValue.hp],
          ['BaseAttack', promotionValue.atk],
          ['BaseDefence', promotionValue.def]
        ] as [string, PromotionBaseStep][]).map(([type, baseStep], i) => {
          const property = STATE.starRailData.properties[type];
          return (
            <PropertyItem
              key={type}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={formatProperty(baseStepValue(baseStep, level), property.percent)}
              sx={{ backgroundColor: i === 1 ? '#ffffff11' : '#ffffff33' }}
            />
          );
        })}
      </Box>

      <Typography level="title-lg" textColor="warning.300" px={3} py={0.5}>
        {`晋阶材料 ${promotion}/${lightConePromotion.values.length - 1}`}
      </Typography>

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
          const itemData = STATE.starRailData.items[item.id];
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
              <Typography level="body-sm" textColor="common.white">{item.num}</Typography>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
