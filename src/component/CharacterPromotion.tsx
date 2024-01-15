import { useCallback, useState } from 'react';
import { SxProps } from '@mui/joy/styles/types';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';

import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import { formatProperty, getPromotionLevel, getPromotionMaxLevel, getTotalPromotionMaterial, promotionMarks } from '../data/local';

function generateHighlightLindeices(firstStep: 1 | 3, length: number) {
  const result = [];
  let value = 0;
  let step = firstStep;
  let i = length;
  while (i-- > 0) {
    result.push(value);
    value += step;
    step = step === 1 ? 3 : 1;
  }
  return result;
}

const highlightIndeices = generateHighlightLindeices(1, 4);

interface CharacterPromotionProps {
  character: Character;
}

export default function CharacterPromotion({ character }: CharacterPromotionProps) {
  const [level, setLevel] = useState(80);
  const characterPromotion = STATE.starRailData.character_promotions[character.id];
  const promotionLevel = getPromotionLevel(level)
  const promotion = characterPromotion.values[promotionLevel];
  const totalMaterial = getTotalPromotionMaterial(promotionLevel, characterPromotion.materials);

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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          py: 1
        }}
      >
        {([
          ['BaseHP', promotion.hp],
          ['BaseAttack', promotion.atk],
          ['BaseDefence', promotion.def],
          ['BaseSpeed', promotion.spd],
          ['CriticalChanceBase', promotion.crit_rate],
          ['CriticalDamageBase', promotion.crit_dmg]
        ] as [string, PromotionBaseStep][]).map(([key, value], i) => {
          const property = STATE.starRailData.properties[key];
          return (
            <PropertyItem
              key={key}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={formatProperty(value.base + value.step * (level - 1), property.percent)}
              sx={{ backgroundColor: highlightIndeices.some(idx => idx === i) ? '#ffffff33' : '#ffffff11' }}
            />
          );
        })}
        <PropertyItem
          key="Taunt"
          name="嘲讽"
          value={promotion.taunt.base + promotion.taunt.step * (level - 1)}
          sx={{ backgroundColor: '#ffffff11' }}
          icon="/IconTaunt.png"
        />
        <PropertyItem
          key="MaxSP"
          icon={STATE.resUrl + STATE.starRailData.properties['MaxSP'].icon}
          name={STATE.starRailData.properties['MaxSP'].name}
          value={character.max_sp}
          sx={{ backgroundColor: '#ffffff11' }}
        />
      </Box>

      <Typography level="title-lg" textColor="warning.300" px={3} py={0.5}>
        {`晋阶材料 ${promotionLevel}/${characterPromotion.values.length - 1}`}
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
