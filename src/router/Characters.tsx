import { useCallback, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { STATE } from '../common/state';
import ImageList from '../component/ImageList';

const characterOrderList: number[] = [
  1306, 1307, 1312,//2.0花火黑天鹅米沙
  1305, 1303, 1214,//1.6真理阮梅雪衣
  1215, 1302, 1217,//1.5寒鸦银枝藿藿
  1210, 1112, 1212,//1.4桂乃芬托帕静流
  1110, 1208, 1213,//1.3玲可符玄饮月
  1111, 1005, 1205,//1.2卢卡卡芙卡刃
  1207, 1203, 1006,//1.1驭空罗刹银狼
  1204, 1102,//1.0景元希儿
  1004, 1003, 1101, 1104, 1107, 1209, 1211,//瓦尔特姬子布洛妮娅杰帕德克拉拉彦卿白露
  1201, 1206, 1202,//青雀素裳停云
  1109, 1105, 1106, 1103, 1108, //雅俐洛
  1013, 1009, 1008,//黑塔艾丝妲阿兰
  1002, 1001,//丹恒三月七
  8004, 8003, 8002, 8001//开拓者
];

export default function Characters() {
  useLoaderData();
  const navigate = useNavigate();
  const characters = useMemo(() => {
    const list = characterOrderList.slice();
    Object.keys(STATE.starRailData.characters).forEach(key => {
      const id = parseInt(key);
      if (list.indexOf(id) < 0) {
        list.unshift(id);
      }
    });
    const sortedList = list.map(id => {
      const character = STATE.starRailData.characters[id];
      if (character == undefined) {
        throw new Error(`数据库中查找不到id为${id}的角色，请尝试更新数据库。`);
      }
      return character;
    });
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
