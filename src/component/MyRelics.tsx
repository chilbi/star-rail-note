import { useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Tooltip from '@mui/joy/Tooltip';
import IconButton from '@mui/joy/IconButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import BlackSheet from './BlackSheet';
import PropertyItem from './PropertyItem';
import SubAffixRate from './SubAffixRate';
import { STATE } from '../common/state';
import { relicTypeMap, setMap, showPercent } from '../data/local';
import { imageTheme } from '../common/theme';

interface MyRelicsProps {
  character: CharacterInfo;
}

export default function MyRelics({ character }: MyRelicsProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  
  const setIds: string[] = [];

  return (
    <BlackSheet>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog size="lg" color="primary" sx={{ width: '100%', maxWidth: '640px' }}>
          <ModalClose size="lg" />
          <DialogTitle>遗器总属性</DialogTitle>
          <div>
            {character.relicsProperties.map((property, i) => (
              <PropertyItem
                key={property.type}
                icon={STATE.resUrl + property.icon}
                name={property.name + showPercent(property.type)}
                value={property.display}
                sx={{ backgroundColor: i % 2 === 0 ? '#ffffff33' : '#ffffff11' }}
              />
            ))}
          </div>
        </ModalDialog>
      </Modal>

      <Divider sx={{ '--Divider-childPosition': '24px', mt: 2, mb: 1 }}>遗器词条完成度</Divider>
      <Box display="flex" alignItems="center">
        <Typography level="body-sm" textColor="text.primary" px={3}>{character.totalRelicScore.recommendAffixesText}</Typography>
        <Typography level="h3" color="danger" ml="auto" mr={3}>{character.totalRelicScore.display}</Typography>
      </Box>

      <Divider sx={{ '--Divider-childPosition': '24px', mt: 2, mb: 1 }}>
        <span>遗器属性详情</span>
        <Tooltip title="查看遗器总属性" color="primary">
          <IconButton onClick={handleOpen} sx={{ ml: 0.5 }}>
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Divider>
      <Box
        sx={{
          // display: 'flex',
          // flexWrap: 'wrap',
          // pb: 1
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: { xs: 0.5, md: 1 }
        }}
      >
        {character.relics.map(relic => (
          <MyRelic
            key={relic.id}
            relic={relic}
            relicScore={character.relicScoreRecord[relic.type]}
            recommendAffixes={character.recommendAffixes}
          />
        ))}
      </Box>

      {character.relic_sets.length > 0 && (
        <>
          <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>遗器套装效果</Divider>
          <div>
            {character.relic_sets.map((relicSet, i) => {
              const notExistingSet = setIds.indexOf(relicSet.id) < 0;
              setIds.push(relicSet.id);
              return (
                <Box key={i} p={1}>
                  {notExistingSet && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <img src={STATE.resUrl + relicSet.icon} width={36} height={36} />
                      <Typography level="title-md" ml={1}>{relicSet.name}</Typography>
                    </Box>
                  )}
                  <Typography level="body-sm" textColor="#18ffcd" pl={2} pr={1}>{setMap[relicSet.num] + relicSet.desc}</Typography>
                </Box>
              );
            })}
          </div>
        </>
      )}
    </BlackSheet>
  );
}

interface MyRelicProps {
  relic: RelicInfo;
  relicScore: RelicScore;
  recommendAffixes: RecommendAffix[];
}

function MyRelic({ relic, relicScore, recommendAffixes }: MyRelicProps) {
  return (
    <Box mb={1}>
      <Box display="flex" gap={0.5} mb={0.5}>
        <Box
          sx={{
            width: 33,
            height: 33,
            p: '3px',
            borderRadius: '50%',
            backgroundImage: imageTheme.getItemRarityImageColor(relic.rarity)
          }}
        >
          <img src={STATE.resUrl + relic.icon} alt="" width="100%" height="100%" />
        </Box>
        <Box flexGrow={1}>
          <Typography level="title-sm">{relic.name}</Typography>
          <Box display="flex" alignItems="center">
            <Typography level="body-sm">{relicTypeMap[relic.type]}</Typography>
            <Typography level="body-xs" color="warning" ml={0.25}>{'+' + relic.level}</Typography>
            <Typography level="body-xs" color="danger" ml="auto">{relicScore.display}</Typography>
          </Box>
        </Box>
      </Box>

      <div>
        <PropertyItem
          icon={STATE.resUrl + relic.main_affix.icon}
          name={relic.main_affix.name}
          value={relic.main_affix.display}
          textColor={!relicScore.isHeadOrHand && recommendAffixes.some(value => value.type === relic.main_affix.type) ? 'warning.400' : undefined }
          sx={{ backgroundColor: imageTheme.previewRarityColors[relic.rarity] + '66' }}
        />
        {relic.sub_affix.map((affix, i) => (
          <PropertyItem
            key={i}
            icon={STATE.resUrl + affix.icon}
            name={<>{affix.name}<SubAffixRate count={affix.count} step={affix.step} /></>}
            value={affix.display}
            textColor={recommendAffixes.some(value => value.type === affix.type) ? 'warning.400' : undefined}
            sx={{ backgroundColor: i % 2 === 0 ? '#ffffff11' : '#ffffff33' }}
          />
        ))}
      </div>
    </Box>
  );
}
