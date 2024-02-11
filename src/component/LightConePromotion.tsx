import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';

import PromotionLevel from './PromotionLevel';
import PropertyItem from './PropertyItem';
import PromotionMaterialConsume from './PromotionMaterialConsume';
import { STATE } from '../common/state';
import { baseStepValue, formatProperty, getLevel, getPromotion, getTotalPromotionMaterial } from '../data/local';
import { backgroundStriped } from '../common/utils';

interface LightConePromotionProps {
  lightCone: LightCone;
}

export default function LightConePromotion({ lightCone }: LightConePromotionProps) {
  const [level, setLevel] = useState(80);
  const [promotion, setPromotion] = useState(6);
  const lightConePromotion = STATE.starRailData.light_cone_promotions[lightCone.id];
  const promotionValue = lightConePromotion.values[promotion];
  const totalMaterial = getTotalPromotionMaterial(promotion, lightConePromotion.materials);

  const handlePromotionChange = useCallback((value: number) => {
    setPromotion(value);
    setLevel(getLevel(value));
  }, []);

  const handleLevelChange = useCallback((_: Event, value: number) => {
    setLevel(value);
    setPromotion(getPromotion(value));
  }, []);

  return (
    <>
      <PromotionLevel
        promotion={promotion}
        level={level}
        onPromotionChagne={handlePromotionChange}
        onLevelChange={handleLevelChange}
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
              sx={backgroundStriped(i !== 1)}
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
