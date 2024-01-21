import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Typography from '@mui/joy/Typography';

import Promotion from './Promotion';
import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import { baseStepValue, formatProperty, getPromotionLevel, getPromotionMaxLevel, getTotalPromotionMaterial, promotionMarks } from '../data/local';
import { generateHighlightLindeices } from '../common/utils';

const highlightIndeices = generateHighlightLindeices(1, 4);

interface CharacterPromotionProps {
  character: Character;
}

export default function CharacterPromotion({ character }: CharacterPromotionProps) {
  const [level, setLevel] = useState(80);
  const characterPromotion = STATE.starRailData.character_promotions[character.id];
  const promotion = getPromotionLevel(level);
  const promotionValue = characterPromotion.values[promotion];
  const totalMaterial = getTotalPromotionMaterial(promotion, characterPromotion.materials);

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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          py: 1
        }}
      >
        {([
          ['BaseHP', promotionValue.hp],
          ['BaseAttack', promotionValue.atk],
          ['BaseDefence', promotionValue.def],
          ['BaseSpeed', promotionValue.spd],
          ['CriticalChanceBase', promotionValue.crit_rate],
          ['CriticalDamageBase', promotionValue.crit_dmg]
        ] as [string, PromotionBaseStep][]).map(([type, baseStep], i) => {
          const property = STATE.starRailData.properties[type];
          return (
            <PropertyItem
              key={type}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={formatProperty(baseStepValue(baseStep, level), property.percent)}
              sx={{ backgroundColor: highlightIndeices.some(idx => idx === i) ? '#ffffff33' : '#ffffff11' }}
            />
          );
        })}
        <PropertyItem
          key="Taunt"
          name="嘲讽"
          value={baseStepValue(promotionValue.taunt, level)}
          sx={{ backgroundColor: '#ffffff11' }}
          icon={import.meta.env.BASE_URL + 'IconTaunt.png'}
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
        {`晋阶材料 ${promotion}/6`}
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
