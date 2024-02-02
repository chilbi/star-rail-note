import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNameClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    navigate('/character/' + character.id);
  }, [character.id, navigate]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <Box position="relative">
      <CharacterPortrait portrait={character.portrait} />
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

        <Modal open={open} onClose={handleClose}>
          <ModalDialog size="lg" color="primary" sx={{ width: '100%', maxWidth: '640px' }}>
            <ModalClose size="lg" />
            <DialogTitle>基础属性</DialogTitle>
            <div>
              {['HP', 'Attack', 'Defence', 'Speed'].map((key, i) => {
                const property = character.totalRecord['Base' + key];
                return (
                  <PropertyItem
                    key={key}
                    icon={STATE.resUrl + property.icon}
                    name={property.name}
                    value={property.display}
                    sx={{ backgroundColor: i % 2 === 0 ? '#ffffff33' : '#ffffff11' }}
                  />
                );
              })}
            </div>
          </ModalDialog>
        </Modal>
        <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>
          <span>属性详情</span>
          <Tooltip title="查看基础属性" color="primary">
            <IconButton onClick={handleOpen} sx={{ ml: 0.5 }}>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Divider>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            pb: 1
          }}
        >
          {character.totalProperties.map((property, i) => (
            <PropertyItem
              key={property.type}
              icon={STATE.resUrl + property.icon}
              name={property.name}
              value={property.display}
              sx={{ backgroundColor: highlightIndeices.some(idx => idx === i) ? '#ffffff33' : '#ffffff11' }}
            />
          ))}
          {character.totalProperties.length % 2 !== 0 && (
            <Box sx={{ backgroundColor: highlightIndeices.some(idx => idx === character.totalProperties.length) ? '#ffffff33' : '#ffffff11' }} />
          )}
        </Box>
      </BlackSheet>
    </Box>
  );
}
