import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

import { STATE } from '../common/state';

export default function ResUrlSelect() {
  const navigate = useNavigate();
  const handleChange = useCallback((e: React.MouseEvent | null, value: string) => {
    e?.stopPropagation();
    STATE.setLocalResUrl(value);
    navigate(0);
  }, [navigate]);
  
  return (
    <div>
      <Typography level="body-xs" mb={1}>图片来源</Typography>
      <Select
        value={STATE.localResUrl ?? STATE.resUrlArr[0]}
        startDecorator={<ImageRoundedIcon />}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={handleChange as any}
      >
        {STATE.resUrlArr.map(url => (
          <Option key={url} value={url}>{url}</Option>
        ))}
      </Select>
    </div>
  );
}
