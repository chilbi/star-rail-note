import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import BlackSheet from './BlackSheet';
import { STATE } from '../common/state';
import { formatProperty, getTotalSkillTreeProperties } from '../data/local';

interface PropertyAdditionSkillsProps {
  skillTrees: CharacterSkillTree[];
}

export default function PropertyAdditionSkills({ skillTrees }: PropertyAdditionSkillsProps) {
  const properties = getTotalSkillTreeProperties(skillTrees);
  return (
    <BlackSheet>
      <Box display="flex">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 3,
            pt: 1.5
          }}
        >
          <Typography level="title-lg">行迹</Typography>
          <Typography
            level="title-sm"
            children="属性加成"
            textColor="common.black"
            sx={{
              mt: 0.5,
              px: 1,
              borderRadius: '1em',
              backgroundColor: '#ffffff'
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly'
        }}
      >
        {properties.map(property => (
          <PropertyItem key={property.type} promotionProperty={property} />
        ))}
      </Box>
    </BlackSheet>
  );
}

interface PropertyItemProps {
  promotionProperty: PromotionProperty;
}

function PropertyItem({ promotionProperty }: PropertyItemProps) {
  const property = STATE.starRailData.properties[promotionProperty.type];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1.5
      }}
    >
      <img src={STATE.resUrl + property.icon} alt="" width={32} height={32} />
      <Typography level="body-sm" textColor="text.primary">{property.name}</Typography>
      <Typography level="body-sm" textColor="text.primary">{formatProperty(promotionProperty.value, property.percent)}</Typography>
    </Box>
  );
}
