import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '@mui/joy/Stepper';
import StepIndicator from '@mui/joy/StepIndicator';
import Step from '@mui/joy/Step';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Textarea from '@mui/joy/Textarea';
import Avatar from '@mui/joy/Avatar';
import Skeleton from '@mui/joy/Skeleton';

import { headIconUrl, updateStarRailInfoWithJson } from '../data/local';
import { STATE } from '../common/state';

interface LoginWithJsonProps {
  loginUid: string;
  onClose: (e: unknown, reason: 'backdropClick' | 'escapeKeyDown' | 'closeClick') => void;
}

export default function LoginWithJson({ loginUid, onClose }: LoginWithJsonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const jsonRef = useRef<StarRailInfo | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState(isNaN(parseInt(loginUid)) ? '' : loginUid);
  const [jsonStr, setJsonStr] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const url = STATE.apiUrl + 'sr_info/';

  const handleChangeUid = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUid(e.currentTarget.value);
  }, []);

  const handleChangeJsonStr = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonStr(e.currentTarget.value);
    setError(false);
  }, []);

  const checkJson = useCallback(() => {
    try {
      const json = JSON.parse(jsonStr) as StarRailInfo;
      if (json && json.detailInfo && json.detailInfo.uid.toString() === uid.trim()) {
        jsonRef.current = json;
        setStep(prev => prev + 1);
      } else {
        jsonRef.current = undefined;
        setError(true);
      }
    } catch {
      jsonRef.current = undefined;
      setError(true);
    }
  }, [jsonStr, uid]);

  const handleLogin = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (jsonRef.current) {
      updateStarRailInfoWithJson(jsonRef.current).then(() => {
        const uidStr = jsonRef.current!.detailInfo!.uid.toString();
        STATE.requestUid = uidStr;
        STATE.setLocalUid(uidStr, jsonRef.current!);
        onClose(e, 'closeClick');
        navigate('/', { replace: true });
      });
    }
  }, [navigate, onClose]);

  const handleNextStep = useCallback(() => setStep(prev => prev + 1), []);

  const handlePrevStep = useCallback(() => setStep(prev => prev - 1), []);

  useEffect(() => {
    if (step === 1) {
      inputRef.current?.focus();
    } else if (step === 2) {
      textareaRef.current?.focus();
    }
  }, [step]);

  const headIcon = headIconUrl(jsonRef.current?.detailInfo, STATE.starRailData);

  return (
    <>
      <Stepper orientation="vertical">
        <Step indicator={<StepIndicator variant="solid" color={step === 1 ? 'primary' : 'neutral'}>1</StepIndicator>}>
          <Typography level="title-md" py={1}>输入游戏UID</Typography>
          <Stack direction="column" spacing={2} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Input
              disabled={step !== 1}
              value={uid}
              onChange={handleChangeUid}
              startDecorator={<Typography sx={{ display: { xs: 'none', md: 'inline-block' } }}>{url}</Typography>}
              slotProps={{ input: { ref: inputRef } }}
            />
            <Button
              color="primary"
              variant="solid"
              disabled={step !== 1}
              component="a"
              href={url + uid.trim()}
              target="_blank"
              onClick={handleNextStep}
            >
              打开链接后复制数据
            </Button>
          </Stack>
        </Step>

        <Step indicator={<StepIndicator variant="solid" color={step === 2 ? 'primary' : 'neutral'}>2</StepIndicator>}>
          <Typography level="title-md" py={1}>粘贴JSON数据</Typography>
          <Stack direction="column" spacing={1} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Textarea
              placeholder="粘贴JSON数据到此处"
              disabled={step !== 2}
              error={error}
              value={jsonStr}
              onChange={handleChangeJsonStr}
              slotProps={{ textarea: { ref: textareaRef } }}
              sx={{ height: '5em', maxHeight: '5em' }}
            />
            <ButtonGroup color="primary" buttonFlex={1}>
              <Button disabled={step !== 2} onClick={handlePrevStep}>上一步</Button>
              <Button disabled={step !== 2} variant="solid" onClick={checkJson}>验证数据</Button>
            </ButtonGroup>
          </Stack>
        </Step>

        <Step indicator={<StepIndicator variant="solid" color={step === 3 ? 'primary' : 'neutral'}>3</StepIndicator>}>
          <Typography level="title-md" py={1}>登录</Typography>
          <Stack direction="column" spacing={1} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <Avatar src={headIcon && STATE.resUrl + headIcon} />
              <Typography level="title-sm">
                {jsonRef.current ? jsonRef.current.detailInfo?.nickname : <Skeleton animation={false}>游戏玩家的昵称</Skeleton>}
              </Typography>
            </Stack>
            <ButtonGroup color="primary" buttonFlex={1}>
              <Button disabled={step !== 3} onClick={handlePrevStep}>上一步</Button>
              <Button variant="solid" disabled={step !== 3} onClick={handleLogin}>登录</Button>
            </ButtonGroup>
          </Stack>
        </Step>
      </Stepper>
    </>
  );
}
