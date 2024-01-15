import { Mark } from '@mui/base/useSlider';

import Database from './Database';
import { fetchStarRailData, fetchStarRailInfo } from './remote';
import { STATE } from '../common/state';

interface DataCache {
  starRailData: Record<number/*timestamp*/, StarRailData | undefined>;
  starRailInfo: Record<string/*uid*/, StarRailInfo | undefined>;
}

/** 内存缓存 */
const cache: DataCache = {
  starRailData: {},
  starRailInfo: {}
};

/** 游戏数据库，版本时间戳作为主键 */
const starRailDataDB = new Database<number, StarRailData>('star_rail_data_db', 'star_rail_data');
/** 用户数据库，用户ID作为主键 */
const starRailInfoDB = new Database<string, StarRailInfo>('star_rail_info_db', 'star_rail_info');

/** 获取indexedDB中的所有游戏数据的版本信息 */
export function getStarRailDataInfoItems(): Promise<StarRailDataInfo[]> {
  const items: StarRailDataInfo[] = [];
  return starRailDataDB.eachStoreCursor(cursor => {
    const { version, timestamp } = cursor.value as StarRailData;
    items.push({ version, timestamp, folder: '' });
  }).then(() => items);
}

/** 删除指定版本的游戏数据 */
export async function deleteStarRailDataInfo(timestamp: number): Promise<void> {
  return starRailDataDB.del(timestamp);
}

/* 从远程获取游戏数据，更新indexedDB中的游戏数据，并更新内存缓存的游戏数据 */
export function updateStarRailData(starRailDataInfo?: StarRailDataInfo): Promise<StarRailData | undefined> {
  return fetchStarRailData(starRailDataInfo)
    .then(data => {
      return starRailDataDB.set(data.timestamp, data)
        .then(() => {
          cache.starRailData[data.timestamp] = data;
          return data;
        });
    });
}

/** 获取游戏数据，优先级：内存缓存 > indexedDB > 远程数据 */
export async function getStarRailData(timestamp?: number | null): Promise<StarRailData | undefined> {
  if (timestamp) {
    if (cache.starRailData[timestamp]) {
      return cache.starRailData[timestamp];
    }
    return starRailDataDB.get(timestamp)
      .then(data => {
        if (data) {
          cache.starRailData[timestamp] = data;
          return data;
        }
        return updateStarRailData();
      });
  }
  const cacheKeys = Object.keys(cache.starRailData);
  if (cacheKeys.length > 0) {
    return cache.starRailData[Math.max(...cacheKeys.map(key => parseInt(key)))];
  }
  return starRailDataDB.keys()
    .then(keys => {
      if (keys.length > 0) {
        return starRailDataDB.get(Math.max(...keys));
      }
      return updateStarRailData();
    });
}

/** 获取indexedDB中的所有用户的uid */
export function getUidItems(): Promise<string[]> {
  return starRailInfoDB.keys();
}

/** 删除指定uid的用户数据 */
export function deleteStarRailInfo(uid: string): Promise<void> {
  return starRailInfoDB.del(uid);
}

/** 从远程获取用户数据，更新indexedDB中的用户数据，并更新内存缓存的用户数据 */
export function updateStarRailInfo(uid: string): Promise<StarRailInfo | undefined> {
  return fetchStarRailInfo(uid)
    .then(info => {
      if (info?.detailInfo?.uid === parseInt(uid)) {
        return starRailInfoDB.set(uid, info)
          .then(() => {
            cache.starRailInfo[uid] = info;
            return info;
          });
      }
      return info;
    });
}

/** 跨域远程获取用户数据失败的解决方法，由用户手动复制json更新用户数据 */
export function updateStarRailInfoWithJson(json: StarRailInfo): Promise<StarRailInfo> {
  return starRailInfoDB.set(json.detailInfo!.uid.toString(), json)
    .then(() => json);
}

/** 获取用户数据，优先级：内存缓存 > indexedDB > 远程数据 */
export async function getStarRailInfo(uid: string): Promise<StarRailInfo | undefined> {
  if (cache.starRailInfo[uid]) {
    return cache.starRailInfo[uid];
  }
  return starRailInfoDB.get(uid)
    .then(info => {
      if (info) {
        return info;
      }
      return updateStarRailInfo(uid);
    });
}

// *************************************************************************
// 处理游戏数据的一些方法
// *************************************************************************

/** 游戏数据的版本时间格式化 */
export function versionDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

function percentValue(value: number): number {
  return parseFloat((value * 1000000).toFixed()) / 10000;
}

/** 格式化显示属性值，百分比最高保留两位小数，非百分比向下取整 */
export function formatProperty(value: number, percent: boolean): string | number {
  return percent ? Math.floor(parseFloat((value * 10000).toFixed())) / 100 + '%' : Math.floor(value);
}

interface ReplacementParam {
  index: number;
  value: number;//原始值
  format: string;//格式化为int整数: i, 或者float小数: f1, f2, ...
  percent: boolean;//百分比
}

/** 格式化显示技能参数 */
export function formatParam(param: ReplacementParam): string {
  let value: number | string;
  if (param.format === 'i') {
    value = param.percent ? percentValue(param.value) : param.value;
  } else if (param.format.startsWith('f')) {
    value = param.percent ? percentValue(param.value) : param.value;
    const fractionDigits = parseInt(param.format.slice(1));
    const pow = Math.pow(10, isNaN(fractionDigits) ? 0 : fractionDigits);
    value = Math.floor(value * pow) / pow;
  } else {
    throw new Error('unkonw format: ' + param.format);
  }
  if (param.percent) {
    value = value + '%';
  }
  return value.toString();
}

interface DescChunk {
  text: string;
  param: ReplacementParam | string | null;
}

// 分割指定参数
function splitToChunks(str: string, placeholder: string, param: ReplacementParam | string): DescChunk[] {
  const index = str.indexOf(placeholder);
  if (index > -1) {
    const start = str.slice(0, index);
    const end = str.slice(index + placeholder.length);
    const result: DescChunk[] = [
      { text: start, param: null },
      { text: placeholder, param }
    ];
    result.push(...splitToChunks(end, placeholder, param));
    return result;
  }
  return [{ text: str, param: null }];
}

interface SplitedChunks {
  index: number;
  chunks: DescChunk[];
}

// 分割所有参数
function toDescChunk(desc: string, descParam: DescParam): DescChunk[] {
  let descChunks: DescChunk[] = [{ text: desc, param: null }];
  const len = descParam.length;
  for (let i = 1; i <= len; i++) {
    const regExpExecArray = new RegExp(`#${i}\\[([^\\]]+?)\\](%?)`).exec(desc);
    if (regExpExecArray) {
      const placeholder = regExpExecArray[0];
      const param: ReplacementParam = {
        index: i -1,
        value: descParam[i - 1],
        format: regExpExecArray[1],
        percent: regExpExecArray[2] === '%'
      };
      const splitedChunksArr: SplitedChunks[] = [];
      descChunks.forEach((chunk, index) => {
        if (chunk.param === null) {
          splitedChunksArr.push({
            index,
            chunks: splitToChunks(chunk.text, placeholder, param)
          });
        }
      });
      if (splitedChunksArr.length > 0) {
        const nestDescChunks: (DescChunk | DescChunk[])[] = descChunks.slice();
        splitedChunksArr.forEach(splitedChunks => {
          nestDescChunks.splice(splitedChunks.index, 1, splitedChunks.chunks);
        });
        descChunks = nestDescChunks.flat();
      }
    }
  }
  return descChunks;
}

// 分割换行
function breakDescChunk(descChunks: DescChunk[]): DescChunk[] {
  const placeholder = '\n';
  const splitedChunksArr: SplitedChunks[] = [];
  descChunks.forEach((chunk, index) => {
    if (chunk.param === null) {
      splitedChunksArr.push({
        index,
        chunks: splitToChunks(chunk.text, placeholder, placeholder)
      });
    }
  });
  if (splitedChunksArr.length > 0) {
    const nestDescChunks: (DescChunk | DescChunk[])[] = descChunks.slice();
    splitedChunksArr.forEach(splitedChunks => {
      nestDescChunks.splice(splitedChunks.index, 1, splitedChunks.chunks);
    });
    descChunks = nestDescChunks.flat();
  }
  return descChunks;
}

interface SkillLike {
  desc: string;
  params: DescParam[];
}

/** 格式化技能描述 */
export function formatSkill(skill: SkillLike, level: number): DescChunk[] {
  let descChunks: DescChunk[];
  if (skill.params.length > 0) {
    descChunks = toDescChunk(skill.desc, skill.params[level - 1]);
  } else {
    descChunks = [{ text: skill.desc, param: null }]
  }
  return breakDescChunk(descChunks);
}

/** 映射数据记录 */
export function mapDataRecord<T, U>(
  dataRecord: DataRecord<T>,
  callback: (key: string, value: T) => U
): U[] {
  return Object.keys(dataRecord)
    .map(key => callback(key, dataRecord[key]));
}

export interface ImageLike {
  id: string;
  name: string;
  rarity: number;
  icon: string;
  preview: string;
  path: string;
  element?: string;
}

/** 处理开拓者的名称 */
export function nickname(value: ImageLike, name = '开拓者'): string {
  return value.name === '{NICKNAME}' ? name : value.name;
}

/** 处理用户头像 */
export function headIconUrl(starRailInfo?: StarRailInfo | undefined | null): string | undefined {
  const headIcon = starRailInfo?.detailInfo?.headIcon;
  if (headIcon) {
    let icon: number | string;
    const headIconNum = parseInt(headIcon as unknown as string);
    if (isNaN(headIconNum)) {
      icon = headIcon;
    } else {// 角色头像ID处理
      const iconId = headIconNum - 200000;
      icon = (iconId > 1000 && iconId < 2000) || (iconId > 8000 && iconId < 9000) ? iconId : headIcon;
    }
    return `${STATE.resUrl}icon/avatar/${icon}.png`;
  }
  return undefined;
}

/** 晋阶的等级分割点 */
export const promotionLevels: number[] = [20, 30, 40, 50, 60, 70];

/** 给Slider组件的marks属性使用 */
export const promotionMarks: Mark[] = promotionLevels.map(value => ({ value }));

/** 获取晋阶等级 */
export function getPromotionLevel(level: number): number {
  let index, value, i;
  const len = promotionLevels.length;
  for (i = 0; i < len; i++) {
    index = len - 1 - i;
    value = promotionLevels[index];
    if (level > value) return index + 1;
  }
  return 0;
}

/** 获取当前晋阶的最高等级 */
export function getPromotionMaxLevel(level: number): number {
  const len = promotionLevels.length;
  for (let i = 0; i < len; i++) {
    const value = promotionLevels[len - 1 - i];
    if (level > value) return value + 10;
  }
  return promotionLevels[0];
}

/** 获取累计晋阶所需的材料 */
export function getTotalPromotionMaterial(promotionIndex: number, promotionMaterials: PromotionMaterials[]): MaterialConsume[] {
  let i = promotionIndex < 1 ? 0 : promotionIndex - 1;
  const result = promotionMaterials[i].map(item => Object.assign({}, item));
  while (i-- > 0) {
    promotionMaterials[i].forEach(item => {
      const index = result.findIndex(value => value.id === item.id);
      if (index > -1) {
        result[index].num += item.num;
      } else {
        result.splice(1, 0, Object.assign({}, item));
      }
    });
  }
  if (promotionIndex < 1) return result.map(item => Object.assign(item, { num: 0 }));
  return result;
}

/** 归类同类型技能 */
export function getCategorizedSkills(
  skillIds: string[],
  characterSkills: DataRecord<CharacterSkill>
): Record<SkillType, CharacterSkill[]> {
  const result: Record<SkillType, CharacterSkill[]> = {
    'Normal': [],
    'BPSkill': [],
    'Ultra': [],
    'Talent': [],
    'Maze': [],
    'MazeNormal': []
  };
  for (const skillId of skillIds) {
    const skill = characterSkills[skillId];
    result[skill.type].push(skill);
  }
  return result;
}

type SkillTreeType = 'ExtraCapacity' | 'PropertyAddition';

/** 归类同类型技能树 */
export function getCategorizedSkillTrees(
  skillTreeIds: string[],
  characterSkillTrees: DataRecord<CharacterSkillTree>
): Record<SkillTreeType, CharacterSkillTree[]> {
  const result: Record<SkillTreeType, CharacterSkillTree[]> = {
    'ExtraCapacity': [],
    'PropertyAddition': []
  };
  for (const skillTreeId of skillTreeIds) {
    const skillTree = characterSkillTrees[skillTreeId];
    const point = parseInt(skillTree.anchor.slice('Point'.length));
    if (point > 5 && point < 9) {//678
      result['ExtraCapacity'].push(skillTree);
    } else if (point > 8) {//9-18
      result['PropertyAddition'].push(skillTree);
    }
  }
  return result;
}

export function getTotalSkillTreeProperties(skillTrees: CharacterSkillTree[]): PromotionProperty[] {
  const result: PromotionProperty[] = [];
  skillTrees.forEach(skillTree => {
    if (skillTree.levels.length > 0) {
      skillTree.levels[0].properties.forEach(property => {
        const index = result.findIndex(item => item.type === property.type);
        if (index > -1) {
          result[index].value += property.value;
        } else {
          result.push(Object.assign({}, property));
        }
      });
    }
  });
  return result;
}

/** 默认技能最大等级 */
export const skillDefaultMaxLevelMap: Record<SkillType, number> = {
  'Normal': 6,
  'BPSkill': 10,
  'Ultra': 10,
  'Talent': 10,
  'Maze': 1,
  'MazeNormal': 1
};
