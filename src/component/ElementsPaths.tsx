import { Fragment } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Divider from '@mui/joy/Divider';

import { STATE } from '../common/state';

interface ElementsPathsProps {
  activeTab: 'element' | 'path' | null;
  element: string;
  path: string;
  onClose: (e: unknown, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => void;
}

/** 属性命途描述 */
export default function ElementsPaths({ activeTab, element, path, onClose }: ElementsPathsProps) {
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
                      children={'当前所选角色' + valueText}
                      ml="auto"
                      pt={0.5}
                    />
                  }
                </Box>
                <Typography level="body-sm" textColor="text.primary" mt={1}>{item.desc}</Typography>
              </Box>
            </Box>
            {index !== keys.length - 1 && <Divider sx={{ my: 1 }} />}
          </Fragment>
        );
      })}
    </TabPanel>
  );
}
