import { Suspense } from 'react';
import { Await, useLoaderData} from 'react-router-dom';

import Loading from '../component/Loding';
import BackButton from '../component/BackButton';
import LightConeProfile from '../component/LightConeProfile';
import { LightConeDetailData } from './loaders';

export default function LightConeDetail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = useLoaderData() as any;

  return (
    <Suspense fallback={<Loading />}>
      <Await
        resolve={data.lightConeDetailData}
        children={({ lightCone }: LightConeDetailData) => {
          return (
            <>
              <LightConeProfile lightCone={lightCone} />
              <BackButton />
            </>
          );
        }}
      />
    </Suspense>
  );
}
