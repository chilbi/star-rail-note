import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import ImageList from '../component/ImageList';
import { STATE } from '../common/state';

export default function Characters() {
  const navigate = useNavigate();
  const lightCones = useMemo(() => {
    const list = Object.keys(STATE.starRailData.light_cones)
      .map(id => STATE.starRailData.light_cones[id]);
    const sortedList = list.reverse().sort((a, b) => b.rarity - a.rarity);
    if (STATE.selectedElementPath.length < 1) {
      return sortedList;
    }
    const selectedElement: string[] = [];
    const selectedPath: string[] = [];
    STATE.selectedElementPath.forEach(key => {
      if (STATE.elements.indexOf(key) > -1) {
        selectedElement.push(key);
      } else {
        selectedPath.push(key);
      }
    });
    const filteredList = sortedList.filter(lightCone => {
      const matchedPath = selectedPath.length === 0 || selectedPath.some(key => key === lightCone.path);
      return matchedPath;
    });
    return filteredList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STATE.starRailData, STATE.selectedElementPath.length]);

  const handleClick = useCallback((lightCone: LightCone) => navigate('/light-cone/' + lightCone.id), [navigate]);

  return (
    <ImageList values={lightCones} onClick={handleClick} />
  );
}
