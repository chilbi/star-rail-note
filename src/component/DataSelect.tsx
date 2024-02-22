import { useCallback, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import FetchDataErrorMessage from './FetchDataErrorMessage';
import { versionDate } from '../data/local';
import { STATE } from '../common/state';
import { submitForm } from '../common/utils';

interface DataSelectProps {
  starRailDataInfoItems: StarRailDataInfo[];
}

export default function DataSelect({ starRailDataInfoItems }: DataSelectProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, updater] = useState(false);
  const fetcher = useFetcher();

  const handleChange = useCallback((e: React.MouseEvent | null, value: string) => {
    e?.stopPropagation();
    submitForm(fetcher, {
      method: 'POST',
      action: '/',
      type: 'star_rail_data/change',
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
      type: method === 'DELETE' ? 'star_rail_data/delete' : 'star_rail_data/update',
      value: e.currentTarget.value
    });
  }, [fetcher]);

  const handleCloseMessage = useCallback(() => {
    STATE.messageOfFetchData = null;
    updater(prev => !prev);
  }, []);

  const handleCloseError = useCallback(() => {
    STATE.errorOfFetchData = null;
    updater(prev => !prev);
  }, []);

  return (
    <div>
      <Typography level="body-xs" py={1}>数据库版本</Typography>
      <Select
        color="primary"
        value={STATE.starRailData.timestamp}
        startDecorator={<StorageRoundedIcon />}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={handleChange as any}
      >
        {starRailDataInfoItems.map(item => (
          <Option key={item.timestamp} value={item.timestamp}>
            {item.timestamp === STATE.starRailData.timestamp ? (
              <IconButton color="primary" name="PUT" value={item.timestamp} onClick={handleDeleteOrUpdate}>
                <SyncRoundedIcon />
              </IconButton>
            ) : (
              <IconButton color="danger" name="DELETE" value={item.timestamp} onClick={handleDeleteOrUpdate}>
                <DeleteRoundedIcon />
              </IconButton>
            )}
            <span>{`v${item.version} (${versionDate(item.timestamp)})`}</span>
          </Option>
        ))}
      </Select>
      <Modal
        open={STATE.messageOfFetchData !== null}
        onClose={handleCloseMessage}
      >
        <ModalDialog color="primary">
          <Typography level="body-md">{STATE.messageOfFetchData ?? ''}</Typography>
        </ModalDialog>
      </Modal>
      <Modal
        open={STATE.errorOfFetchData !== null}
        onClose={handleCloseError}
      >
        <ModalDialog color="danger">
          {STATE.errorOfFetchData && <FetchDataErrorMessage />}
        </ModalDialog>
      </Modal>
    </div>
  );
}
