import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';

import PromotionLevel from './PromotionLevel';
import PromotionMaterialConsume from './PromotionMaterialConsume';
import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { baseStepValue, formatProperty, getPromotionLevel, getTotalPromotionMaterial } from '../data/local';
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
      <PromotionLevel
        promotion={promotion}
        level={level}
        onChange={handleChange}
      />
      
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

      <PromotionMaterialConsume
        promotion={promotion}
        totalMaterial={totalMaterial}
      />
    </>
  );
}
