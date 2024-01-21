import { useCallback, useMemo, useState } from 'react';
import { Navigate, useFetcher, useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Snackbar from '@mui/joy/Snackbar';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

import BackButton from '../component/BackButton';
import FlexItem from '../component/FlexItem';
import MyCharacterProfile from '../component/MyCharacterProfile';
import { STATE } from '../common/state';
import { submitForm } from '../common/utils';
import { imageTheme } from '../common/theme';
import { parseInfo } from '../data/parseInfo';
import MyLightCone from '../component/MyLightCone';
import MyRelics from '../component/MyRelics';

export default function MyCharacters() {
  useLoaderData();
  const [activeIndex, setActiveIndex] = useState(0);

  const starRailInfoParsed: StarRailInfoParsed | null = useMemo(() => {
    if (STATE.playerDataIsNull) {
      return null;
    }
    setActiveIndex(0);
    return parseInfo(STATE.playerData, STATE.starRailData, STATE.elements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    STATE.starRailInfo?.detailInfo?.uid,
    STATE.starRailInfo?.detailInfo?.assistAvatarDetail,
    STATE.starRailInfo?.detailInfo?.avatarDetailList
  ]);

  const activeCharacter: CharacterInfo | undefined = useMemo(() => {
    return starRailInfoParsed?.characters[activeIndex];
  }, [activeIndex, starRailInfoParsed]);

  const handleChangeActiveIndex = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setActiveIndex(parseInt(e.currentTarget.getAttribute('data-index')!));
  }, []);

  if (starRailInfoParsed === null) {//应该是logout
    return <Navigate to="/" />;
  }

  if (starRailInfoParsed.characters.length < 1) {
    return <NoCharacters />;
  }

  return (
    <>
      <BackButton />
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          p: 1,
          width: '100%',
          overflow: 'auto hidden'
        }}
      >
        {starRailInfoParsed.characters.map((characterInfo, index) => {
          return (
            <AvatarIcon
              key={index}
              index={index}
              isActive={activeIndex === index}
              rarity={characterInfo.rarity}
              name={characterInfo.name}
              icon={`icon/avatar/${characterInfo.id}.png`}
              onClick={handleChangeActiveIndex}
            />
          );
        })}
      </Box>
      {activeCharacter && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            p: { md: 1 }
          }}
        >
          <FlexItem>
            <MyCharacterProfile character={activeCharacter} />
          </FlexItem>
          {activeCharacter.light_cone && (
            <FlexItem>
              <MyLightCone lightCone={activeCharacter.light_cone} />
            </FlexItem>
          )}
          {activeCharacter.relics.length > 0 && (
            <FlexItem>
              <MyRelics relics={activeCharacter.relics} relicSets={activeCharacter.relic_sets} />
            </FlexItem>
          )}
        </Box>
      )}
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
    <Snackbar
      open={true}
      size="lg"
      variant="outlined"
      color="warning"
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}
    >
      <div>
        <Typography level="title-lg" color="warning">没有展示角色</Typography>
        <Typography level="body-md" sx={{ mt: 1, mb: 2 }}>请在游戏内设置展示角色，<br />设置大约3分钟后重新获取数据。</Typography>
        <Stack direction="row" spacing={2} pt={1}>
          <Button variant="solid" color="primary" onClick={handleClose}>返回首页</Button>
          <Button variant="solid" color="primary" onClick={handleUpdate}>重新获取数据</Button>
        </Stack>
      </div>
    </Snackbar>
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
