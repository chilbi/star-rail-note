import { useCallback, useState } from 'react';
import { SxProps } from '@mui/joy/styles/types';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';

import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import { formatProperty, getPromotionLevel, getPromotionMaxLevel, getTotalPromotionMaterial, promotionMarks } from '../data/local';

interface LightConePromotionProps {
  lightCone: LightCone;
}

export default function LightConePromotion({ lightCone }: LightConePromotionProps) {
  const [level, setLevel] = useState(80);
  const lightConePromotion = STATE.starRailData.light_cone_promotions[lightCone.id];
  const promotionLevel = getPromotionLevel(level)
  const promotion = lightConePromotion.values[promotionLevel];
  const totalMaterial = getTotalPromotionMaterial(promotionLevel, lightConePromotion.materials);

  const handleChange = useCallback((_: Event, value: number) => {
    setLevel(value);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 3,
          pt: 1.5,
          pb: 0.5
        }}
      >
        <Typography level="title-md" mr={0.5}>等级</Typography>
        <Typography level="title-lg">{level}</Typography>
        <Typography level="body-md">/</Typography>
        <Typography level="body-md" textColor="#ffffff88">{getPromotionMaxLevel(level)}</Typography>
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
          ['BaseHP', promotion.hp],
          ['BaseAttack', promotion.atk],
          ['BaseDefence', promotion.def]
        ] as [string, PromotionBaseStep][]).map(([key, value], i) => {
          const property = STATE.starRailData.properties[key];
          return (
            <PropertyItem
              key={key}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={formatProperty(value.base + value.step * (level - 1), property.percent)}
              sx={{ backgroundColor: i === 1 ? '#ffffff11' : '#ffffff33' }}
            />
          );
        })}
      </Box>

      <Typography level="title-lg" textColor="warning.300" px={3} py={0.5}>
        {`晋阶材料 ${promotionLevel}/${lightConePromotion.values.length - 1}`}
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
                  backgroundImage: imageTheme.getPreviewRarityColor(itemData.rarity)
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

interface PropertyItemProps {
  sx?: SxProps;
  icon: string;
  name: string;
  value: string | number;
}

function PropertyItem({ sx = {}, icon, name, value }: PropertyItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        ...sx
      }}
    >
      <Box
        component="span"
        sx={{
          width: imageTheme.propertySize,
          height: imageTheme.propertySize,
          mr: 0.25
        }}
      >
        <img
          src={icon}
          alt=""
          width={imageTheme.propertySize}
          height={imageTheme.propertySize}
        />
      </Box>
      <Typography level="body-sm" textColor="common.white">{name}</Typography>
      <Typography level="body-sm" textColor="common.white" ml="auto">{value}</Typography>
    </Box>
  );
}
