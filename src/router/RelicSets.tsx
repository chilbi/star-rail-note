import { useCallback, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';

import RelicSetIcon from '../component/RelicSetIcon';
import { STATE } from '../common/state';

export default function RelicSets() {
  useLoaderData();
  const navigate = useNavigate();
  const relicSets = useMemo(() => {
    return Object.keys(STATE.starRailData.relic_sets)
      .map(id => STATE.starRailData.relic_sets[id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STATE.starRailData, STATE.selectedElementPath.length]);

  const handleClick = useCallback((relicSet: RelicSet) => navigate('/relic-set/' + relicSet.id), [navigate]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, 100px)`,
        justifyContent: 'center',
        gap: 2,
        p: 2
      }}
    >
      {relicSets.map(relicSet => (
        <RelicSetIcon key={relicSet.id} relicSet={relicSet} onClick={handleClick} />
      ))}
    </Box>
  );
}
