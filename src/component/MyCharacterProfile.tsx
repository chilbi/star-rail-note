import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import BlackSheet from './BlackSheet';
import CharacterPortrait from './CharacterPortrait';
import CharacterIntro from './CharacterIntro';
import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { nickname } from '../data/local';
import { generateHighlightLindeices } from '../common/utils';
import PromotionLevelRank from './PromotionLevelRank';

const highlightIndeices = generateHighlightLindeices(1, 17);

interface MyCharacterProps {
  character: CharacterInfo;
}

export default function MyCharacterProfile({ character }: MyCharacterProps) {
  return (
    <Box position="relative">
      <CharacterPortrait portrait={character.portrait} />
      <BlackSheet sx={{ mt: '256px' }}>
        <CharacterIntro
          name={nickname(character.name)}
          rarity={character.rarity}
          element={character.element.id}
          path={character.path.id}
        />

        <PromotionLevelRank
          promotion={character.promotion}
          level={character.level}
          rankText={character.rank + '星魂'}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            px: 3
          }}
        >
          {character.skills.map(skill => (
            <Box
              key={skill.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <img src={STATE.resUrl + skill.icon} width={28} height={28} />
              <Typography
                level="body-xs"
                textColor="common.black"
                lineHeight="1.3em"
                sx={{
                  mt: 0.5,
                  px: 0.5,
                  borderRadius: '1em',
                  backgroundColor: '#ffffff'
                }}
                children={skill.type_text}
              />
              <Typography
                level="body-xs"
                textColor="common.white"
                pt={1}
                children={'等级' + skill.level + (skill.rankLevelUp ? '+' + skill.rankLevelUp : '')}
              />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            py: 1
          }}
        >
          {character.total_properties.map((property, i) => (
            <PropertyItem
              key={property.type}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={property.display}
              sx={{ backgroundColor: highlightIndeices.some(idx => idx === i) ? '#ffffff33' : '#ffffff11' }}
            />
          ))}
          {character.total_properties.length % 2 !== 0 && (
            <Box sx={{ backgroundColor: highlightIndeices.some(idx => idx === character.total_properties.length) ? '#ffffff33' : '#ffffff11' }} />
          )}
        </Box>
      </BlackSheet>
    </Box>
  );
}
