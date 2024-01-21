import { Fragment } from 'react';
import Box from '@mui/joy/Box';
import BlackSheet from './BlackSheet';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';

import Rarity from './Rarity';
import PromotionLevelRank from './PromotionLevelRank';
import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import { formatParam, formatSkill, nickname } from '../data/local';

interface MyLightConeProps {
  lightCone: LightConeInfo;
}

export default function MyLightCone({ lightCone }: MyLightConeProps) {
  const lightConeRank = STATE.starRailData.light_cone_ranks[lightCone.id];
  
  return (
    <BlackSheet>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderTopRightRadius: '24px',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: 3,
            width: '100%',
            height: '100%',
            borderTopRightRadius: '24px'
          }
        }}
      >
        <img
          src={STATE.resUrl + lightCone.portrait}
          alt=""
          style={{
            position: 'absolute',
            zIndex: 1,
            top: '50%',
            left: '50%',
            width: '586.3px',
            minWidth: '120%',
            objectFit: 'cover',
            transform: 'translate(-50%, -20%)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            bottom: '5px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: '3px',
            backgroundColor: '#00000099',
            '&::before': {
              content: '""',
              position: 'absolute',
              zIndex: -1,
              top: '2px',
              bottom: '2px',
              left: 0,
              width: '50%',
              backgroundImage: `linear-gradient(90deg, ${imageTheme.previewRarityColors[lightCone.rarity]}99, #00000000)`
            }
          }}
        >
          <Box sx={{ position: 'absolute', bottom: '100%', left: '4px', height: '26px' }}>
            <Rarity rarity={lightCone.rarity} height={18} />
          </Box>
          <Typography level="title-lg">{lightCone.name}</Typography>
          <Box display="flex" alignItems="center">
            <img src={STATE.resUrl + lightCone.path.icon} alt="" width="24px" height="24px" />
            <Typography level="title-md" ml={0.5}>{lightCone.path.name}</Typography>
          </Box>
        </Box>
      </Box>

      <PromotionLevelRank
        promotion={lightCone.promotion}
        level={lightCone.level}
        rankText={'叠影' + lightCone.rank}
      />

      <Box py={1}>
        {lightCone.attributes.map((property, i) => {
          return (
            <PropertyItem
              key={property.type}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={property.display}
              sx={{ backgroundColor: i === 1 ? '#ffffff11' : '#ffffff33' }}
            />
          );
        })}
      </Box>

      <Divider sx={{ '--Divider-childPosition': '24px', mt: 1 }}>光锥技能</Divider>
      <Box px={3}>
        <Typography component="h5" level="title-md" pt={1} pb={0.5}>{lightConeRank.skill}</Typography>
        {lightConeRank.desc !== '' &&
          <Typography component="p" level="body-md" textColor="#18ffcd" lineHeight="2em">
            {formatSkill(lightConeRank, lightCone.rank).map((descChunk, index) => (
              <Fragment key={index}>
                {descChunk.param === null ? (
                  descChunk.text
                ) : descChunk.param === '\n' ? (
                  <br />
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <Typography color="warning">{formatParam(descChunk.param as any)}</Typography>
                )}
              </Fragment>
            ))}
          </Typography>
        }
      </Box>

      <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>光锥故事</Divider>
      <Box px={3}>
        {nickname(lightCone.desc).split('\n').map((text, i) => (
          <Typography key={i} level="body-sm" lineHeight="2.5em">{text}</Typography>
        ))}
      </Box>
    </BlackSheet>
  );
}
