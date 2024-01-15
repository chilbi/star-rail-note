import { Fragment, useCallback, useState } from 'react';
import Box from '@mui/joy/Box';
import Slider from '@mui/joy/Slider';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import { Mark } from '@mui/base/useSlider';

import { STATE } from '../common/state';
import { formatParam, formatSkill } from '../data/local';

const marks: Mark[] = [2, 3, 4].map(value => ({ value }));

interface LightConeRanksProps {
  lightCone: LightCone;
}

export default function LightConeRanks({ lightCone }: LightConeRanksProps) {
  const [level, setLevel] = useState(1);
  const lightConeRank = STATE.starRailData.light_cone_ranks[lightCone.id];

  const handleChange = useCallback((_: Event, value: number) => {
    setLevel(value);
  }, []);

  return (
    <>
      <Divider sx={{ '--Divider-childPosition': '24px', my: 1 }}>光锥技能</Divider>
      <Box px={3}>
        <Slider
          min={1}
          max={5}
          size="sm"
          marks={marks}
          // color="neutral"
          value={level}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={handleChange as any}
          sx={{ py: 1 }}
        />
      </Box>
      <Box px={3}>
        <Typography level="title-lg" textColor="warning.300">叠影{level}阶</Typography>
        <Typography component="h5" level="title-lg" pt={1} pb={0.5}>{lightConeRank.skill}</Typography>
        {lightConeRank.desc !== '' &&
          <Typography component="p" level="body-md" textColor="#18ffcd" lineHeight="2em">
            {formatSkill(lightConeRank, level).map((descChunk, index) => (
              <Fragment key={index}>
                {descChunk.param === null ? (
                  descChunk.text
                ) : descChunk.param === '\n' ? (
                  <br />
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <Typography color="warning">{formatParam(descChunk.param as any)}</Typography>
                )}
              </Fragment>
            ))}
          </Typography>
        }
      </Box>
    </>
  );
}
