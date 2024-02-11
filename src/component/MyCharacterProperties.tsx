import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import Divider from '@mui/joy/Divider';
import Tooltip from '@mui/joy/Tooltip';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import PropertyItem from './PropertyItem';
import { STATE } from '../common/state';
import { backgroundStriped, generateHighlightLindeices } from '../common/utils';
import { addedValue } from '../data/local';

const highlightIndeices = generateHighlightLindeices(1, 17);

interface MyCharacterPropertiesProps {
  character: CharacterInfo;
}

export default function MyCharacterProperties({ character }: MyCharacterPropertiesProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog size="lg" color="primary" sx={{ width: '100%', maxWidth: '640px' }}>
          <ModalClose size="lg" />
          <DialogTitle>基础属性</DialogTitle>
          <div>
            {character.totalProperties.slice(0, 4).map((property, i) => {
              return (
                <PropertyItem
                  key={property.type}
                  icon={STATE.resUrl + property.icon}
                  name={property.name}
                  value={
                    <>
                      {property.base.display}
                      <Typography textColor="#0692ce" display="inline-block" width="80px" textAlign="right">{'+' + addedValue(property)}</Typography>
                    </>
                  }
                  sx={backgroundStriped(i % 2 === 0)}
                />
              );
            })}
          </div>
        </ModalDialog>
      </Modal>
      <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>
        <span>属性详情</span>
        <Tooltip title="查看基础属性" color="primary" arrow>
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
            textColor={character.recommendAffixes.some(value =>
              [property.base.type, property.addedRatio?.type, property.delta?.type].some(type => type === value.type)
            ) ? 'warning.400' : undefined}
            sx={backgroundStriped(highlightIndeices.some(idx => idx === i))}
          />
        ))}
        {character.totalProperties.length % 2 !== 0 && (
          <Box sx={backgroundStriped(highlightIndeices.some(idx => idx === character.totalProperties.length))} />
        )}
      </Box>
    </>
  );
}
