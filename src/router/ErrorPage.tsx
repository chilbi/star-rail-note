import { useState } from 'react';
import { Link, useRouteError } from 'react-router-dom';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import AspectRatio from '@mui/joy/AspectRatio';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';

import { errorMap } from '../common/utils';
import { STATE } from '../common/state';
import FetchDataErrorMessage from '../component/FetchDataErrorMessage';

export default function ErrorPage() {
  const [open, setOpen] = useState(false);
  const err = useRouteError() as Error;
  const error = err ?? new Error(errorMap['404']);

  let status: string;
  if (error.message.startsWith(errorMap['404'])) {
    status = '404';
  } else if (error?.message?.startsWith(errorMap['405'])) {
    status = '405'
  } else {
    status = '400';
  }

  return (
    <>
      <Card
        size="lg"
        variant="plain"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 'calc(100% - 16px)',
          width: '500px',
          textAlign: 'center',
          overflow: 'auto'
        }}
      >
        <CardOverflow
          variant="solid"
          color="danger"
          sx={{
            flex: '0 0 90px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: 'var(--Card-padding)'
          }}
        >
          <Typography fontSize="xl3" fontWeight="xl" textColor="text.primary">{status}</Typography>
          <Typography textColor="primary.200">{errorMap[status]}</Typography>
        </CardOverflow>
        <CardContent>
          <AspectRatio ratio="1722/1522" objectFit="contain" variant="plain">
            <img src={STATE.resUrl + 'image/simulated_event/HoshinoKami_Herta.png'} alt="" />
          </AspectRatio>
          {error.message.indexOf('starRailData') > -1 ?
            <FetchDataErrorMessage /> :
            <Typography fontSize="md">{error.message}</Typography>
          }
        </CardContent>
        <CardActions>
          {err?.stack && (
            <Button
              children="异常堆栈"
              color="danger"
              onClick={() => setOpen(true)}
              sx={{
                '--variant-borderWidth': '2px',
                borderRadius: 40,
                borderColor: 'primary.500',
                mx: 'auto',
                px: 4
              }}
            />
          )}
          <Button
            children="跳到主页"
            component={Link}
            to="/"
            reloadDocument
            replace
            color="primary"
            sx={{
              '--variant-borderWidth': '2px',
              borderRadius: 40,
              borderColor: 'primary.500',
              mx: 'auto',
              px: 4
            }}
          />
        </CardActions>
      </Card>
      {err?.stack && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog variant="outlined" color="danger">
            <ModalClose />
            <DialogTitle>异常堆栈</DialogTitle>
            <DialogContent>{err?.stack}</DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
}
