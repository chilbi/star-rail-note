import { useCallback, useRef, useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { ImageGroup } from 'react-viewer-soda';
import Viewer from 'viewerjs';

import { STATE } from '../common/state';

interface GuideOverviewProps {
  guideOverview: string[];
  name: string;
}

export default function GuideOverview({ guideOverview, name }: GuideOverviewProps) {
  const viewer = useRef<Viewer>(null);
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        size="sm"
        variant="soft"
        onClick={handleOpen}
        sx={{
          position: 'absolute',
          zIndex: 1,
          top: '8px',
          right: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img src={STATE.resUrl + 'icon/sign/IconGuideTypeSystem.png'} alt="" width={36} height={36} />
        <Typography level="body-sm" textColor="common.white">攻略图</Typography>
      </Button>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog variant="outlined" color="primary">
          <ModalClose />
          <DialogTitle>{name}攻略一图流</DialogTitle>
          <DialogContent>
            <ImageGroup
              viewer={viewer}
              options={{
                inline: false,
                title: false,
                navbar: false,
                toolbar: {
                  prev: 'large',
                  zoomOut: 'large',
                  oneToOne: 'large',
                  zoomIn: 'large',
                  next: 'large',
                  play: 0,
                  reset: 0,
                  rotateLeft: 0,
                  rotateRight: 0,
                  flipHorizontal: 0,
                  flipVertical: 0,
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                {guideOverview.map((url, i) => (
                  <Box key={i} sx={{ flexGrow: 1, flexShrink: 1 }}>
                    <img src={STATE.resUrl + url} alt="" width={200} height={240} style={{ objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            </ImageGroup>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
}
