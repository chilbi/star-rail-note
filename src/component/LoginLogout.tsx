/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import MenuButton from '@mui/joy/MenuButton';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Snackbar from '@mui/joy/Snackbar';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import LoginWithJson from './LoginWithJson';
import { headIconUrl } from '../data/local';
import { STATE } from '../common/state';
import { submitForm } from '../common/utils';

interface LoginLogoutProps {
  uidItems: string[];
}

export default function LoginLogout({ uidItems }: LoginLogoutProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updater] = useState(false);
  const [loginUid, setLoginUid] = useState('');
  const fetcher = useFetcher();
  const hasError = STATE.starRailInfo != undefined && STATE.starRailInfo.detail != undefined;

  const handleCloseSnackbar = useCallback(() => {
    STATE.errorOfFetchInfo = null;
    STATE.requestUid = STATE.localUid;
    updater(prev => !prev);
  }, []);

  const handleOpenModal = useCallback(() => {
    setLoginUid(STATE.requestUid ?? STATE.localUid ?? '输入游戏UID');
    handleCloseSnackbar();
  }, [handleCloseSnackbar]);

  const handleCloseModal = useCallback((_: unknown, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => {
    if (reason === 'backdropClick') return;
    setLoginUid('');
  }, []);

  const handleLoginOrLogout = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const value = e.currentTarget.getAttribute('value') ?? '';
    submitForm(fetcher, {
      method: 'POST',
      action: '/',
      type: (value === 'logout' || value === '') ? 'logout' : 'login',
      value: value
    });
  }, [fetcher]);

  const handleDeleteOrUpdate = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const method = e.currentTarget.name as any;
    submitForm(fetcher, {
      method: method,
      action: '/',
      type: method === 'DELETE' ? 'star_rail_info/delete' : 'star_rail_info/update',
      value: e.currentTarget.value
    });
  }, [fetcher]);

  const headIcon = headIconUrl(STATE.starRailInfo?.detailInfo, STATE.starRailData);
  
  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Dropdown>
          <MenuButton
            variant="plain"
            sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'start', paddingInline: 1 }}
            disabled={uidItems.length < 1}
          >
            <Avatar
              size="lg"
              variant={STATE.starRailInfo?.detailInfo != undefined ? 'outlined' : 'solid'}
              color={STATE.starRailInfo?.detailInfo != undefined ? 'neutral' : 'primary'}
              src={headIcon && STATE.resUrl + headIcon}
            />
            <Typography level="title-lg" noWrap textOverflow="ellipsis" maxWidth={140}>
              {STATE.starRailInfo?.detailInfo?.nickname ?? 'Star Rail Note'}
            </Typography>
          </MenuButton>
          <Menu placement="bottom-start" color="primary" variant={uidItems.length < 1 ? 'plain' : 'outlined'}>
            {uidItems.map(uid => {
              const selected = uid === STATE.localUid;
              return (
                <MenuItem
                  key={uid}
                  component="li"
                  color="primary"
                  selected={selected}
                  value={uid}
                  onClick={handleLoginOrLogout}
                >
                  {selected ? (
                    <IconButton color="primary" name="PUT" value={uid} onClick={handleDeleteOrUpdate}>
                      <SyncRoundedIcon />
                    </IconButton>
                  ) : (
                    <IconButton color="danger" name="DELETE" value={uid} onClick={handleDeleteOrUpdate}>
                      <DeleteRoundedIcon />
                    </IconButton>
                  )}
                  <Divider orientation="vertical" />
                  <Typography mx={2}>{uid}</Typography>
                </MenuItem>
              );
            })}
          </Menu>
        </Dropdown>
        <IconButton
          size="sm"
          color={hasError ? 'danger' : 'primary'}
          disabled={STATE.starRailInfo == undefined}
          value="logout"
          onClick={handleLoginOrLogout}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
      <fetcher.Form method="POST" action="/">
        <FormControl error={hasError}>
          <Input
            name="action_value"
            size="sm"
            required
            defaultValue={STATE.localUid ?? undefined}
            placeholder="输入游戏UID"//108791037
            slotProps={{ input: { id : 'login_uid_input' } }}
            endDecorator={
              <IconButton size="sm" color="primary" type="submit" name="action_type" value="login">
                <LoginRoundedIcon />
              </IconButton>
            }
          />
          <FormHelperText>{hasError ? STATE.starRailInfo!.detail : <Box component="span" sx={{ opacity: 0 }}>ERROR</Box>}</FormHelperText>
        </FormControl>
      </fetcher.Form>
      <InfoErrorSnackbar handleCloseSnackbar={handleCloseSnackbar} handleOpenModal={handleOpenModal} />
      <InfoErrorModal loginUid={loginUid} handleCloseModal={handleCloseModal} />
    </>
  );
}

interface InfoErrorSnackbarProps {
  handleCloseSnackbar: () => void;
  handleOpenModal: () => void;
}

function InfoErrorSnackbar({ handleCloseSnackbar, handleOpenModal }: InfoErrorSnackbarProps) {
  return (
  <Snackbar
      open={STATE.errorOfFetchInfo !== null}
      size="lg"
      variant="outlined"
      color="danger"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      onClose={handleCloseSnackbar}
    >
      <div>
        <Typography level="title-lg" color="danger">获取数据失败！</Typography>
        <Typography level="body-md" sx={{ mt: 1, mb: 2 }}>跨域请求被浏览器的安全策略拦截，<br />是否要使用手动复制数据的方法？</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="solid" color="primary" onClick={handleOpenModal}>是</Button>
          <Button variant="outlined" color="primary" onClick={handleCloseSnackbar}>否</Button>
        </Stack>
      </div>
    </Snackbar>
  );
}

interface InfoErrorModalProps {
  loginUid: string;
  handleCloseModal: (e: unknown, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => void;
}

function InfoErrorModal({ loginUid, handleCloseModal }: InfoErrorModalProps) {
  return (
    <Modal open={loginUid !== ''} onClose={handleCloseModal}>
      <ModalDialog size="lg" color="primary">
        <ModalClose size="lg" />
        <DialogTitle>手动复制数据步骤</DialogTitle>
        <DialogContent>
          <LoginWithJson loginUid={loginUid} onClose={handleCloseModal} />
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
