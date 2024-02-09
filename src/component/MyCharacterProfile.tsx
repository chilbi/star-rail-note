import { useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';

import BlackSheet from './BlackSheet';
import CharacterPortrait from './CharacterPortrait';
import CharacterIntro from './CharacterIntro';
import PromotionLevelRank from './PromotionLevelRank';
import MyCharacterProperties from './MyCharacterProperties';
import { STATE } from '../common/state';
import { nickname } from '../data/local';

interface MyCharacterProfileProps {
  character: CharacterInfo;
  onToggle: () => void;
}

export default function MyCharacterProfile({ character, onToggle }: MyCharacterProfileProps) {
  const navigate = useNavigate();

  const handleNameClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    navigate('/character/' + character.id);
  }, [character.id, navigate]);

  return (
    <Box position="relative">
      <CharacterPortrait portrait={character.portrait} />
      <Button
        size="sm"
        variant="soft"
        onClick={onToggle}
        startDecorator={<SyncAltRoundedIcon />}
        children="精简"
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: '8px',
          right: '8px',
        }}
      />
      <BlackSheet sx={{ mt: '256px' }}>
        <CharacterIntro
          name={nickname(character.name)}
          rarity={character.rarity}
          element={character.element.id}
          path={character.path.id}
          onNameClick={handleNameClick}
        />

        <PromotionLevelRank
          promotion={character.promotion}
          level={character.level}
          rankText={character.rank + '星魂'}
        />

        <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>技能等级</Divider>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            px: 3,
            pb: 1,
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
                children={skill.type_text}
                textColor="common.black"
                lineHeight="1.3em"
                sx={{
                  mt: 0.5,
                  px: 0.5,
                  borderRadius: '1em',
                  backgroundColor: '#ffffff'
                }}
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

        <MyCharacterProperties character={character} />
      </BlackSheet>
    </Box>
  );
}
