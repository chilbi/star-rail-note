import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useFetcher, useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Tooltip from '@mui/joy/Tooltip';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';

import BackButton from '../component/BackButton';
import FlexItem from '../component/FlexItem';
import MyCharacterProfile from '../component/MyCharacterProfile';
import MyCharacterSimplified from '../component/MyCharacterSimplified';
import MyLightCone from '../component/MyLightCone';
import MyRelics from '../component/MyRelics';
import { STATE } from '../common/state';
import { backgroundStriped, submitForm } from '../common/utils';
import { imageTheme } from '../common/theme';
import { parseInfo } from '../data/parseInfo';

export default function MyCharacters() {
  useLoaderData();
  const [isDetail, setIsDetail] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [update, updater] = useState(false);
  const activeIndexRef = useRef(activeIndex);

  const starRailInfoParsed: StarRailInfoParsed | null = useMemo(() => {
    if (STATE.playerDataIsNull) {
      return null;
    }
    setActiveIndex(activeIndexRef.current);
    return parseInfo(STATE.playerData, STATE.starRailData, STATE.localFieldsRecord, STATE.elements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    update,
    STATE.starRailInfo?.detailInfo?.uid,
    // STATE.starRailInfo?.detailInfo?.assistAvatarDetail,
    STATE.starRailInfo?.detailInfo?.assistAvatarList,
    STATE.starRailInfo?.detailInfo?.avatarDetailList
  ]);

  const activeCharacter: CharacterInfo | undefined = useMemo(() => {
    return starRailInfoParsed?.characters[activeIndex];
  }, [activeIndex, starRailInfoParsed]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const handleToggleIsDetail = useCallback(() => setIsDetail(prev => !prev), []);

  const handleChangeActiveIndex = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setActiveIndex(parseInt(e.currentTarget.getAttribute('data-index')!));
  }, []);

  const handleDeleteIndex = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    STATE.deleteCharacter(parseInt(e.currentTarget.getAttribute('data-index')!));
    updater(prev => !prev);
  }, []);

  const handleDownIndex = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    STATE.downCharacter(parseInt(e.currentTarget.getAttribute('data-index')!));
    updater(prev => !prev);
  }, []);

  const handleUpIndex = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    STATE.upCharacter(parseInt(e.currentTarget.getAttribute('data-index')!));
    updater(prev => !prev);
  }, []);

  if (starRailInfoParsed === null) {//应该是logout
    return <Navigate to="/" />;
  }

  if (starRailInfoParsed.characters.length < 1) {
    return <NoCharacters />;
  }

  return (
    <>
      <MyCharactersList
        starRailInfoParsed={starRailInfoParsed}
        activeIndex={activeIndex}
        onActiveIndexChange={handleChangeActiveIndex}
        onDeleteIndex={handleDeleteIndex}
        onDownIndex={handleDownIndex}
        onUpIndex={handleUpIndex}
      />

      {activeCharacter && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            p: { md: 1 }
          }}
        >
          {isDetail ? (
            <>
              <FlexItem>
                <MyCharacterProfile character={activeCharacter} onToggle={handleToggleIsDetail} />
              </FlexItem>
              {activeCharacter.light_cone && (
                <FlexItem>
                  <MyLightCone
                    lightCone={activeCharacter.light_cone}
                    characterPath={activeCharacter.path?.id ?? ''}
                  />
                </FlexItem>
              )}
            </>
          ) : (
            <FlexItem>
              <MyCharacterSimplified character={activeCharacter} onToggle={handleToggleIsDetail} />
            </FlexItem>
          )}
          {activeCharacter.relics.length > 0 && (
            <FlexItem>
              <MyRelics character={activeCharacter} updater={updater} />
            </FlexItem>
          )}
        </Box>
      )}

      <BackButton />
    </>
  );
}

function NoCharacters() {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const handleClose = useCallback(() => navigate('/'), [navigate]);

  const handleUpdate = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    submitForm(fetcher, {
      method: 'PUT',
      action: '/',
      type: 'star_rail_info/update',
      value: STATE.starRailInfo?.detailInfo?.uid.toString() ?? ''
    });
  }, [fetcher]);
  return (
    <Modal
      open={true}
      onClose={handleClose}
    >
      <ModalDialog color="warning">
        <div>
          <Typography level="title-lg" color="warning">没有展示角色</Typography>
          <Typography level="body-md" sx={{ mt: 1, mb: 2 }}>请在游戏内设置展示角色，<br />设置大约3分钟后重新获取数据。</Typography>
          <Stack direction="row" spacing={2} pt={1}>
            <Button variant="solid" color="primary" onClick={handleClose}>返回首页</Button>
            <Button variant="solid" color="primary" onClick={handleUpdate}>重新获取数据</Button>
          </Stack>
        </div>
      </ModalDialog>
    </Modal>
  );
}

interface AvatarIconProps {
  index: number;
  isActive: boolean;
  rarity: number;
  name: string;
  icon: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

function AvatarIcon({ index, isActive, rarity, name, icon, onClick }: AvatarIconProps) {
  const size = 48;
  const m = 6;
  const p = 3;

  return (
    <Box
      data-index={index}
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 6 + 'px',
        width: size + m * 2,
        height: size + m * 2,
        borderRadius: '50%',
        cursor: 'pointer',
        '&::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: '50%',
          border: '1px solid #ffffff',
          boxShadow: '0 0 4px #ffffff',
          opacity: isActive ? 1 : 0
        },
        '&:hover::before': {
          opacity: 1
        }
      }}
    >
      <Box
        sx={{
          pl: isActive ? 0 : p + 'px',
          pr: isActive ? + p + 'px' : 0,
          py: p / 2 + 'px',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: imageTheme.previewRarityColors[rarity],
          boxShadow: '0 0 8px ' + imageTheme.previewRarityColors[rarity],
        }}
      >
        <Box
          sx={{
            borderRadius: '50%',
            backgroundColor: isActive ? '#ffffff' : '#000000',
            overflow: 'hidden'
          }}
        >
          <img
            src={STATE.resUrl + icon}
            alt={name}
            width={size - p}
            height={size - p}
            style={{ display: 'block' }}
          />
        </Box>
      </Box>
    </Box>
  );
}

interface MyCharactersListProps {
  starRailInfoParsed: StarRailInfoParsed;
  activeIndex: number;
  onActiveIndexChange: React.MouseEventHandler<HTMLDivElement>;
  onDeleteIndex: React.MouseEventHandler<HTMLButtonElement>;
  onDownIndex: React.MouseEventHandler<HTMLButtonElement>;
  onUpIndex: React.MouseEventHandler<HTMLButtonElement>;
}

function MyCharactersList({
  starRailInfoParsed,
  activeIndex,
  onActiveIndexChange,
  onDeleteIndex,
  onDownIndex,
  onUpIndex
}: MyCharactersListProps) {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleUpdate = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    submitForm(fetcher, {
      method: 'PUT',
      action: '/',
      type: 'star_rail_info/update',
      value: e.currentTarget.value
    });
  }, [fetcher]);

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 891,
          display: 'flex',
          alignItems: 'center',
          // justifyContent: 'center',
          gap: 1,
          py: 1,
          width: '100%',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#00000066',
          overflow: 'auto hidden',
          '&::before, &::after': {
            content: '""',
            display: 'block',
            margin: 'auto'
          }
        }}
      >
        <Tooltip title="更新角色" color="primary" arrow sx={{ mx: 1 }}>
          <IconButton
            variant="solid"
            color="primary"
            value={STATE.localUid!}
            onClick={handleUpdate}
            sx={{
              zIndex: 5,
              position: 'sticky',
              top: 0,
              left: '8px'
            }}
          >
            <SyncRoundedIcon />
          </IconButton>
        </Tooltip>
        {starRailInfoParsed.characters.map((characterInfo, index) => {
          return (
            <AvatarIcon
              key={index}
              index={index}
              isActive={activeIndex === index}
              rarity={characterInfo.rarity}
              name={characterInfo.name}
              icon={`icon/avatar/${characterInfo.id}.png`}
              onClick={onActiveIndexChange}
            />
          );
        })}
        <Tooltip title="管理角色" color="primary" arrow sx={{ mx: 1 }}>
          <IconButton
            variant="solid"
            color="primary"
            onClick={handleOpen}
            sx={{
              zIndex: 5,
              position: 'sticky',
              top: 0,
              right: '8px'
            }}
          >
            <EditRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog size="lg" color="primary" sx={{ width: '100%', maxWidth: '640px' }}>
          <ModalClose size="lg" />
          <DialogTitle>管理角色</DialogTitle>
          <DialogContent>
            {starRailInfoParsed.characters.map((characterInfo, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ...(backgroundStriped(index % 2 === 0))
                  }}
                >
                  <Typography
                    level="title-md"
                    variant="solid"
                    color="neutral"
                    children={index + 1}
                    sx={{
                      mx: 1,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      textAlign: 'center'
                    }}
                  />
                  <img src={STATE.resUrl + characterInfo.icon} alt="" width={42} height={42} />
                  <Typography level="title-md" ml={1} mr="auto">{characterInfo.name}</Typography>
                  <IconButton
                    color="danger"
                    onClick={onDeleteIndex}
                    data-index={index}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                  <IconButton
                    disabled={index === starRailInfoParsed.characters.length - 1}
                    color="primary"
                    onClick={onDownIndex}
                    data-index={index}
                  >
                    <ArrowDownwardRoundedIcon />
                  </IconButton>
                  <IconButton
                    disabled={index === 0}
                    color="primary"
                    onClick={onUpIndex}
                    data-index={index}
                  >
                    <ArrowUpwardRoundedIcon />
                  </IconButton>
                </Box>
              );
            })}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </>
  );
}
