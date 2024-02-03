import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';

import FlexItem from '../component/FlexItem';
import BlackSheet from '../component/BlackSheet';
import Rarity from '../component/Rarity';
import LightConePromotion from './LightConePromotion';
import LightConeRanks from './LightConeRanks';
import GuideOverview from './GuideOverview';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';
import { nickname } from '../data/local';

interface LightConeProfileProps {
  lightCone: LightCone;
}

export default function LightConeProfile({ lightCone }: LightConeProfileProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        p: { md: 1 }
      }}
    >
      <FlexItem>
        <LightConePortrait lightCone={lightCone} />
        {lightCone.guide_overview.length > 0 && <GuideOverview guideOverview={lightCone.guide_overview} name="光锥" />}
      </FlexItem>
      <FlexItem>
        <BlackSheet>
          <LightConeNameRarityPath lightCone={lightCone} />
          <LightConePromotion lightCone={lightCone} />
          <LightConeRanks lightCone={lightCone} />
          <LightConeDesc lightCone={lightCone} />
        </BlackSheet>
      </FlexItem>
    </Box>
  );
}

/** 光锥立绘 */
function LightConePortrait({ lightCone }: LightConeProfileProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        mx: 'auto',
        width: '100%',
        maxWidth: 280,
        transform: 'rotateZ(8deg)',
        '&::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          zIndex: -1,
          top: '16px',
          left: '16px',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff11',
          transform: 'skewY(-2deg)'
        },
        '&::after': {
          content: '""',
          display: 'block',
          width: '100%',
          pb: 1260 / 904 * 100 + '%'
        }
      }}
    >
      <img
        src={STATE.resUrl + lightCone.portrait}
        alt={lightCone.name}
        style={{
          position: 'absolute',
          display: 'block',
          width: '100%',
          objectFit: 'cover'
        }}
      />
    </Box>
  );
}


/** 光锥名、星级、命途 */
function LightConeNameRarityPath({ lightCone }: LightConeProfileProps) {
  const path = STATE.starRailData.paths[lightCone.path];

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          px: 3,
          pt: 1.5,
          pb: 1,
          borderTopRightRadius: '24px',
          backgroundImage: `linear-gradient(${imageTheme.previewRarityColors[lightCone.rarity]}72, #00000000)`
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography level="h3">{lightCone.name}</Typography>
          <Rarity rarity={lightCone.rarity} height={16} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          backgroundColor: '#ffffff33'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: '2px' }}>
          <img src={STATE.resUrl + path.icon} alt={path.name} width="24px" height="24px" />
          <Typography level="title-lg" ml={0.5}>{path.name}</Typography>
        </Box>
      </Box>
    </>
  );
}

/** 光锥故事 */
function LightConeDesc({ lightCone }: LightConeProfileProps) {
  return (
    <>
      <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>光锥故事</Divider>
      <Box px={3}>
        {nickname(lightCone.desc).split('\n').map((text, i) => (
          <Typography key={i} level="body-sm" lineHeight="2.5em">{text}</Typography>
        ))}
      </Box>
    </>
  );
}
