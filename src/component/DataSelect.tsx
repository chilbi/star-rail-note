import { useCallback, useState } from 'react';
import { useFetcher } from 'react-router-dom';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Snackbar from '@mui/joy/Snackbar';
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
      <Typography level="body-xs" mb={1}>数据库版本</Typography>
      <Select
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
      <Snackbar
        open={STATE.messageOfFetchData !== null}
        size="md"
        variant="outlined"
        color="primary"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handleCloseMessage}
      >
        <Typography level="body-md">{STATE.messageOfFetchData ?? ''}</Typography>
      </Snackbar>
      <Snackbar
        open={STATE.errorOfFetchData !== null}
        size="md"
        variant="outlined"
        color="danger"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handleCloseError}
      >
        {STATE.errorOfFetchData && <FetchDataErrorMessage />}
      </Snackbar>
    </div>
  );
}
