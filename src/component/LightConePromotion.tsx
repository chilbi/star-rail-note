import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';

import PromotionLevel from './PromotionLevel';
import PropertyItem from './PropertyItem';
import PromotionMaterialConsume from './PromotionMaterialConsume';
import { STATE } from '../common/state';
import { baseStepValue, formatProperty, getPromotionLevel, getTotalPromotionMaterial } from '../data/local';

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
      <PromotionLevel
        promotion={promotion}
        level={level}
        onChange={handleChange}
      />

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

      <PromotionMaterialConsume
        promotion={promotion}
        totalMaterial={totalMaterial}
      />
    </>
  );
}
