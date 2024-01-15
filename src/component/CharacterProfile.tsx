import { Fragment, useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Divider from '@mui/joy/Divider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import BlackSheet from './BlackSheet';
import Rarity from './Rarity';
import CharacterPromotion from './CharacterPromotion';
import { imageTheme } from '../common/theme';
import { STATE } from '../common/state';
import { nickname } from '../data/local';
import GuideOverview from './GuideOverview';

interface CharacterProfileProps {
  character: Character;
}

export default function CharacterProfile({ character }: CharacterProfileProps) {
  return (
    <Box position="relative">
      <CharacterPortrait character={character} />
      <GuideOverview value={character} name="角色" />
      <BlackSheet sx={{ marginTop: '256px' }}>
        <CharacterNameRarityElementPath character={character} />
        <CharacterPromotion character={character} />
      </BlackSheet>
    </Box>
  );
}

/** 角色立绘 */
function CharacterPortrait({ character }: CharacterProfileProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: '50%',
        zIndex: 0,
        width: imageTheme.portraitSize,
        height: imageTheme.portraitSize,
        transform: 'translate(-50%, -10%)',
        '&:active': { zIndex: 2 }
      }}
    >
      <img
        src={STATE.resUrl + character.portrait}
        alt={character.tag}
        width={imageTheme.portraitSize}
        height={imageTheme.portraitSize}
      />
    </Box>
  );
}

/** 角色名、星级、属性、命途 */
function CharacterNameRarityElementPath({ character }: CharacterProfileProps) {
  const [activeTab, setActiveTab] = useState<'element' | 'path' | null>(null);
  const element = STATE.starRailData.elements[character.element];
  const path = STATE.starRailData.paths[character.path];

  const handleOpenElement = useCallback(() => setActiveTab('element'), []);
  const handleOpenPath = useCallback(() => setActiveTab('path'), []);
  const handleClose = useCallback(() => setActiveTab(null), []);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 1.5,
          pb: 1,
          borderTopRightRadius: '24px',
          backgroundImage: `linear-gradient(${imageTheme.previewRarityColors[character.rarity]}72, #00000000)`
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography level="h3">{nickname(character)}</Typography>
          <Rarity rarity={character.rarity} height={16} />
        </Box>
        <img
          src={STATE.resUrl + element.icon}
          alt={element.name}
          width="36px"
          height="36px"
          style={{ cursor: 'pointer' }}
          onClick={handleOpenElement}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          backgroundColor: '#ffffff33',
          cursor: 'pointer'
        }}
        onClick={handleOpenPath}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: '2px' }}>
          <img src={STATE.resUrl + path.icon} alt={path.name} width="24px" height="24px" />
          <Typography level="title-lg" ml={0.5}>{path.name}</Typography>
        </Box>
        <Box
          component="span"
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 0.75,
            transform: 'rotate(180deg)',
            '--Icon-color': '--joy-palette-text-primary'
          }}
        >
          <InfoOutlinedIcon />
        </Box>
      </Box>

      <ElementsPaths
        activeTab={activeTab}
        element={character.element}
        path={character.path}
        onClose={handleClose}
      />
    </>
  );
}

interface ElementsPathsProps {
  activeTab: 'element' | 'path' | null;
  element: string;
  path: string;
  onClose: (e: unknown, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => void;
}

/** 属性命途描述 */
function ElementsPaths({ activeTab, element, path, onClose }: ElementsPathsProps) {
  const elements = STATE.elements.filter(key => key !== element);
  elements.unshift(element);
  const paths = STATE.paths.filter(key => key !== path);
  paths.unshift(path);

  return (
    <Modal open={activeTab !== null} onClose={onClose}>
      <ModalDialog size="lg" color="primary" sx={{ width: '100%', maxWidth: '640px' }}>
        <ModalClose size="lg" />
        <Tabs defaultValue={activeTab}>
          <TabList>
            <Tab value="element">战斗属性</Tab>
            <Tab value="path">命途</Tab>
          </TabList>
          <TabPanelItem
            value="element"
            valueText="战斗属性"
            keys={elements}
            selectedKey={element}
            dataRecord={STATE.starRailData.elements}
          />
          <TabPanelItem
            value="path"
            valueText="命途"
            keys={paths}
            selectedKey={path}
            dataRecord={STATE.starRailData.paths}
          />
        </Tabs>
      </ModalDialog>
    </Modal>
  )
}

interface TabPanelItemProps {
  value: 'element' | 'path';
  valueText: string;
  keys: string[];
  selectedKey: string;
  dataRecord: DataRecord<ElementAttack | Path>;
}

function TabPanelItem({ value, valueText, keys, selectedKey, dataRecord }: TabPanelItemProps) {
  return (
    <TabPanel value={value} sx={{ pt: 1, pb: 0, px: 0, height: '100%', maxHeight: '280px', overflow: 'hidden auto' }}>
      {keys.map((key, index) => {
        const item = dataRecord[key];
        return (
          <Fragment key={key}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                p: 1,
                alignItems: 'center',
                backgroundColor: key === selectedKey ? 'var(--joy-palette-neutral-softBg)' : undefined
              }}
            >
              <img src={STATE.resUrl + item.icon} width={36} height={36} />
              <Box flexGrow={1}>
                <Box display="flex" alignItems="center">
                  <Typography level="title-lg">{item.name}</Typography>
                  {key === selectedKey &&
                    <Typography
                      level="body-sm"
                      variant="solid"
                      color="warning"
                      ml="auto"
                      pt={0.5}
                    >
                      {'当前所选角色' + valueText }
                    </Typography>
                  }
                </Box>
                <Typography level="body-md" mt={1}>{item.desc}</Typography>
              </Box>
            </Box>
            {index !== keys.length - 1 && <Divider sx={{ my: 1 }} />}
          </Fragment>
        );
      })}
    </TabPanel>
  );
}
