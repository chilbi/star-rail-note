import { Suspense, useCallback } from 'react';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import IconButton from '@mui/joy/IconButton';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import Loading from '../component/Loding';
import LightConeProfile from '../component/LightConeProfile';
import { LightConeDetailData } from './loaders';

export default function LightConeDetail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useLoaderData() as any;
  const navigate = useNavigate();
  const handleBack = useCallback(() => navigate(-1), [navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={data.lightConeDetailData}
        children={({ lightCone }: LightConeDetailData) => {
          return (
            <>
              <LightConeProfile lightCone={lightCone} />

              <IconButton
                variant="solid"
                color="primary"
                onClick={handleBack}
                sx={{
                  position: 'absolute',
                  right: 32,
                  bottom: 32,
                  zIndex: 999
                }}
              >
                <ArrowBackIosNewRoundedIcon />
              </IconButton>
            </>
          );
        }}
      />
    </Suspense>
  );
}
