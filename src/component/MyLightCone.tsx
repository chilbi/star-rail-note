import { Fragment, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import BlackSheet from './BlackSheet';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Tooltip from '@mui/joy/Tooltip';

import Rarity from './Rarity';
import PromotionLevelRank from './PromotionLevelRank';
import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import { formatParam, formatSkill, nickname } from '../data/local';
import { backgroundStriped } from '../common/utils';

interface MyLightConeProps {
  lightCone: LightConeInfo;
  characterPath: string;
}

export default function MyLightCone({ lightCone, characterPath }: MyLightConeProps) {
  const navigate = useNavigate();
  const lightConeRank = STATE.starRailData.light_cone_ranks[lightCone.id];
  
  const handleNameClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    navigate('/light-cone/' + lightCone.id);
  }, [lightCone.id, navigate]);

  const handlePathClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    STATE.selectedElementPath = [lightCone.path?.id ?? ''];
    navigate('/light-cones');
  }, [lightCone.path?.id, navigate]);
  
  return (
    <BlackSheet>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderTopRightRadius: '24px',
          overflow: 'hidden'
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
          <Box sx={{ position: 'absolute', bottom: '100%', left: '4px', height: '26px', cursor: 'pointer' }}>
            <Rarity rarity={lightCone.rarity} height={18} />
          </Box>
          <Tooltip title="查看光锥图鉴" color="primary" arrow>
            <Typography
              level="title-lg"
              onClick={handleNameClick}
              children={lightCone.name}
              sx={{ cursor: 'pointer' }}
            />
          </Tooltip>
          <Tooltip title={`查看所有${lightCone.path?.name}光锥图鉴`} color="primary" arrow>
            <Box
              onClick={handlePathClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <img src={STATE.resUrl + lightCone.path?.icon} alt="" width="24px" height="24px" />
              <Typography level="title-md" ml={0.5}>{lightCone.path?.name}</Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <PromotionLevelRank
        promotion={lightCone.promotion}
        level={lightCone.level}
        rankText={`叠影${lightCone.rank}阶`}
      />

      <Box py={1}>
        {lightCone.attributes.map((property, i) => {
          return (
            <PropertyItem
              key={property.type}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={property.display}
              sx={backgroundStriped(i !== 1)}
            />
          );
        })}
      </Box>

      {characterPath === lightCone.path?.id && (
        <>
          <Divider sx={{ '--Divider-childPosition': '24px', mt: 1 }}>光锥技能</Divider>
          <Box px={3}>
            <Typography component="h5" level="title-md" pt={1} pb={0.5}>{lightConeRank.skill}</Typography>
            {lightConeRank.desc !== '' &&
              <Typography component="p" level="body-sm" textColor={imageTheme.rankColor} lineHeight="2em">
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
        </>
      )}

      <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>光锥故事</Divider>
      <Box px={3}>
        {nickname(lightCone.desc).split('\n').map((text, i) => (
          <Typography key={i} level="body-xs" textColor="text.secondary" lineHeight="2em">{text}</Typography>
        ))}
      </Box>
    </BlackSheet>
  );
}
