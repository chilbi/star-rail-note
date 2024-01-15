import Typography from '@mui/joy/Typography';
import { STATE } from '../common/state';

export default function FetchDataErrorMessage() {
  return (
    <div>
      <Typography component="p" level="body-md">{STATE.errorOfFetchData?.message}</Typography>
      <Typography component="p" level="body-md">
        <Typography component="a" href="https://docs.github.com/en/rest" target="_blank">GitHub API</Typography> 请求失败，请稍后重试。
      </Typography>
      <Typography component="p" >
        或者使用网络加速器等方法，比如 <Typography component="a" href="https://steampp.net/" target="_blank">Watt Toolkit</Typography>。
      </Typography>
    </div>
  );
}
