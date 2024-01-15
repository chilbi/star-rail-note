import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { STATE } from '../common/state';
import ImageList from '../component/ImageList';

const characterOrderList: number[] = [
  1305, 1303, 1214,//1.6真理阮梅血衣
  1302, 1217, 1215,//1.5银枝藿藿寒鸦
  1112, 1212, 1210,//1.4托帕静流桂乃芬
  1208, 1213, 1110,//1.3符玄饮月玲可
  1005, 1205, 1111,//1.2卡芙卡刃卢卡
  1006, 1203, 1207,//1.1银狼罗刹驭空
  1204, 1102,//1.0景元希儿
  1211, 1209, 1206, 1202, 1201,//仙舟
  1109, 1108, 1107, 1106, 1105, 1104, 1103, 1101,//雅俐洛
  1013, 1009, 1008,//黑塔组
  1004, 1003, 1002, 1001,//列车组
  8004, 8003, 8002, 8001
];

export default function Characters() {
  const navigate = useNavigate();
  const characters = useMemo(() => {
    const list = characterOrderList.slice();
    Object.keys(STATE.starRailData.characters).forEach(key => {
      const id = parseInt(key);
      if (list.indexOf(id) < 0) {
        list.unshift(id);
      }
    });
    const sortedList = list.map(id => STATE.starRailData.characters[id]);
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
    const filteredList = sortedList.filter(character => {
      const matchedElement = selectedElement.length === 0 || selectedElement.some(key => key === character.element);
      const matchedPath = selectedPath.length === 0 || selectedPath.some(key => key === character.path);
      return matchedElement && matchedPath;
    });
    return filteredList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STATE.starRailData, STATE.selectedElementPath.length]);

  const handleClick = useCallback((character: Character) => navigate('/character/' + character.id), [navigate]);

  return (
    <ImageList values={characters} onClick={handleClick} />
  );
}
