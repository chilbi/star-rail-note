import { Fragment, useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Tooltip from '@mui/joy/Tooltip';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Divider from '@mui/joy/Divider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Rarity from './Rarity';
import { STATE } from '../common/state';
import { imageTheme } from '../common/theme';

interface CharacterIntroProps {
  name: string;
  rarity: number;
  element: string;
  path: string;
  onNameClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export default function CharacterIntro({ name, rarity, element, path, onNameClick }: CharacterIntroProps) {
  const [activeTab, setActiveTab] = useState<'element' | 'path' | null>(null);
  const elementData = STATE.starRailData.elements[element];
  const pathData = STATE.starRailData.paths[path];

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
          backgroundImage: `linear-gradient(${imageTheme.previewRarityColors[rarity]}72, #00000000)`
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {onNameClick ? (
            <Tooltip title="查看角色图鉴" color="primary" arrow>
              <Typography
                level="h3"
                onClick={onNameClick}
                children={name}
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
          ) : (
            <Typography level="h3" children={name} />
          )}
          <Rarity rarity={rarity} height={16} />
        </Box>
        <img
          src={STATE.resUrl + elementData.icon}
          alt={elementData.name}
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
          <img src={STATE.resUrl + pathData.icon} alt={pathData.name} width="24px" height="24px" />
          <Typography level="title-lg" ml={0.5}>{pathData.name}</Typography>
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
        element={element}
        path={path}
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
          <DialogTitle>
            <TabList>
              <Tab value="element">战斗属性</Tab>
              <Tab value="path">命途</Tab>
            </TabList>
          </DialogTitle>
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
  );
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
                      {'当前所选角色' + valueText}
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
