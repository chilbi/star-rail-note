import Box from '@mui/joy/Box';

import BlackSheet from './BlackSheet';
import CharacterPortrait from './CharacterPortrait';
import GuideOverview from './GuideOverview';
import CharacterIntro from './CharacterIntro';
import CharacterPromotion from './CharacterPromotion';
import { nickname } from '../data/local';

interface CharacterProfileProps {
  character: Character;
}

export default function CharacterProfile({ character }: CharacterProfileProps) {
  return (
    <Box position="relative">
      <CharacterPortrait portrait={character.portrait} />
      <GuideOverview value={character} name="角色" />
      <BlackSheet sx={{ mt: '256px' }}>
        <CharacterIntro
          name={nickname(character.name)}
          rarity={character.rarity}
          element={character.element}
          path={character.path}
        />
        <CharacterPromotion character={character} />
      </BlackSheet>
    </Box>
  );
}
