import { Mark } from '@mui/base/useSlider';

import Database from './Database';
import { fetchDecoedContent, fetchStarRailData, fetchStarRailDataInfo, fetchStarRailInfo, fetchStarRailTest, fetchStarRailTestData } from './remote';
import Decimal from 'decimal.js';
import { parseTest } from './parseTest';

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

// 修复数据
starRailDataDB.keys().then(keys => {
  keys.forEach(key => {
    starRailDataDB.get(key).then(data => {
      if (data && data.character_skill_trees == undefined && data['character_skill_tress' as 'character_skill_trees'] != undefined) {
        data.character_skill_trees = data['character_skill_tress' as 'character_skill_trees'];
        starRailDataDB.set(key, data);
      }
      if (data && data.avatars == undefined) {
        fetchStarRailDataInfo().then(info => {
          fetchDecoedContent<DataRecord<Avatar>>(
            `https://api.github.com/repos/Mar-7th/StarRailRes/contents/${info.folder}/cn/avatars.json`
          ).then(avatars => {
            data.avatars = avatars;
            starRailDataDB.set(key, data);
          });
        });
      }
    });
  });
});

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

/** 合并新旧的支援角色，存在旧的就替换，否则新添加进去 */
function mergeCharacters(oldData: PlayerData | undefined, newData: PlayerData): CharacterDetailData[] {
  const mergedList: CharacterDetailData[] = [];
  if (oldData) {
    if (oldData.avatarDetailList && oldData.avatarDetailList.length > 0) {
      oldData.avatarDetailList.forEach(data => {
        const index = mergedList.findIndex(value => value.avatarId === data.avatarId);
        if (index > -1) {
          mergedList[index] = data;
        } else {
          mergedList.push(data);
        }
      });
    }
    if (oldData.assistAvatarDetail) {
      const index = mergedList.findIndex(value => value.avatarId === oldData.assistAvatarDetail!.avatarId);
      if (index > -1) {
        mergedList[index] = oldData.assistAvatarDetail;
      } else {
        mergedList.push(oldData.assistAvatarDetail);
      }
    }
    if (oldData.assistAvatarList && oldData.assistAvatarList.length > 0) {
      oldData.assistAvatarList.forEach(data => {
        const index = mergedList.findIndex(value => value.avatarId === data.avatarId);
        if (index > -1) {
          mergedList[index] = data;
        } else {
          mergedList.push(data);
        }
      });
    }
  }
  if (newData.avatarDetailList && newData.avatarDetailList.length > 0) {
    newData.avatarDetailList.forEach(data => {
      const index = mergedList.findIndex(value => value.avatarId === data.avatarId);
      if (index > -1) {
        mergedList[index] = data;
      } else {
        mergedList.push(data);
      }
    });
  }
  if (newData.assistAvatarDetail) {
    const index = mergedList.findIndex(value => value.avatarId === newData.assistAvatarDetail!.avatarId);
    if (index > -1) {
      mergedList[index] = newData.assistAvatarDetail;
    } else {
      mergedList.push(newData.assistAvatarDetail);
    }
  }
  if (newData.assistAvatarList && newData.assistAvatarList.length > 0) {
    newData.assistAvatarList.forEach(data => {
      const index = mergedList.findIndex(value => value.avatarId === data.avatarId);
      if (index > -1) {
        mergedList[index] = data;
      } else {
        mergedList.push(data);
      }
    });
  }
  return mergedList;
}

/** 从远程获取用户数据，更新indexedDB中的用户数据，并更新内存缓存的用户数据 */
export function updateStarRailInfo(uid: string): Promise<StarRailInfo | undefined> {
  return Promise.all([starRailInfoDB.get(uid), fetchStarRailInfo(uid)])
    .then(([oldData, newData]) => {
      if (newData?.detailInfo?.uid === parseInt(uid)) {
        // 合并新旧数据，把assistAvatarList都添加在avatarDetailList了
        newData.detailInfo.avatarDetailList = mergeCharacters(oldData?.detailInfo, newData.detailInfo);
        return starRailInfoDB.set(uid, newData)
          .then(() => {
            cache.starRailInfo[uid] = newData;
            return newData;
          });
      }
      return newData;
    });
}

/** 跨域远程获取用户数据失败的解决方法，由用户手动复制json更新用户数据 */
export function updateStarRailInfoWithJson(json: StarRailInfo): Promise<StarRailInfo> {
  const uid = json.detailInfo!.uid.toString();
  return starRailInfoDB.get(uid)
    .then(oldData => {
      // 合并新旧数据，把assistAvatarList都添加在avatarDetailList了
      json.detailInfo!.avatarDetailList = mergeCharacters(oldData?.detailInfo, json.detailInfo!);
      return starRailInfoDB.set(uid, json)
        .then(() => json);
    });
}

export function modifyStarRailInfo(starRailInfo: StarRailInfo): Promise<void> {
  const uid = starRailInfo.detailInfo!.uid.toString();
  return starRailInfoDB.set(uid, starRailInfo);
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

export async function getStarRailTest(starRailData: StarRailData): Promise<StarRailTest | null> {
  try {
    const starRailTest = await fetchStarRailTest();
    if (starRailTest == undefined) return null;
    if (starRailTest.version !== starRailData.test_version) {
      const starRailTestData = await fetchStarRailTestData(starRailTest);
      const starRailTestParsed = parseTest(starRailTest, starRailTestData, starRailData);
      await starRailDataDB.set(starRailTestParsed.timestamp, starRailTestParsed)
        .then(() => {
          cache.starRailData[starRailTestParsed.timestamp] = starRailTestParsed;
        });
    }
    return starRailTest;
  } catch {
    return null;
  }
}

// *************************************************************************
// 处理游戏数据的一些方法
// *************************************************************************

/** 游戏数据的版本时间格式化 */
export function versionDate(timestamp: number): string {
  return new Date(new Decimal(timestamp).mul(1000).toNumber()).toLocaleDateString();
}

function percentValue(value: number): number {
  return new Decimal(value).mul(10000).round().div(100).toNumber();
}

function toFixed(decimal: Decimal, decimalPlaces: number): string {
  return decimal.toFixed(decimalPlaces, Decimal.ROUND_DOWN);
}

/** 格式化显示属性值，百分比和非百分比的值都保留两位小数 */
export function formatProperty(
  value: number,
  percent: boolean,
  percentDecimalPlaces: number = 2,
  NonPercentDecimalPlaces: number = 2
): string {
  return percent
    ? toFixed(new Decimal(value).mul(100), percentDecimalPlaces) + '%'
    : toFixed(new Decimal(value), NonPercentDecimalPlaces);
}

export function baseStepValue(baseStep: PromotionBaseStep, level: number): number {
  return new Decimal(baseStep.base).add(
    new Decimal(baseStep.step).mul(level - 1)
  ).toNumber();
}

export function relicMainValue(mainAffix: MainAffix, level: number): number {
  return new Decimal(mainAffix.base).add(
    new Decimal(mainAffix.step).mul(level)
  ).toNumber();
}

export function relicMainValueFormula(mainAffix: MainAffix, level: number, percent: boolean): string {
  const base = formatProperty(mainAffix.base, percent, 2, 2);
  const step = formatProperty(mainAffix.step, percent, 2, 2);
  return `${base} + ${step} × ${level} = `;
}

export function relicSubValue(subAffix: SubAffix, cnt: number, step: number): number {
  return new Decimal(subAffix.base)
    .mul(cnt)
    .add(new Decimal(subAffix.step).mul(step))
    .toNumber();
}

export function relicSubValueFormula(subAffix: SubAffix, cnt: number, step: number, percent: boolean): string {
  const base = formatProperty(subAffix.base, percent, 2, 2);
  const subStep = formatProperty(subAffix.step, percent, 2, 2);
  return `${base} × ${cnt} + ${subStep} × ${step} = `;
}

export function addedValue(property: TotalPropertyInfo): string {
  return formatProperty(
    new Decimal(property.value).sub(new Decimal(property.base.value)).toNumber(),
    property.percent
  );
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
    value = param.percent ? percentValue(param.value) : new Decimal(param.value).round().toNumber();
  } else if (param.format.startsWith('f')) {
    value = param.percent ? percentValue(param.value) : param.value;
    const fractionDigits = parseInt(param.format.slice(1));
    value = toFixed(new Decimal(value), isNaN(fractionDigits) ? 0 : fractionDigits);
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
  isTest?: boolean;
}

const nicknameRegExp = /{NICKNAME}/gi;

/** 处理开拓者的名称 */
export function nickname(desc: string, name = '开拓者'): string {
  return desc.replace(nicknameRegExp, name);
}

interface HeadIconLike {
  headIcon: number;
}

/** 处理用户头像 */
export function headIconUrl(playerData: HeadIconLike | undefined, starRailData: StarRailData): string | undefined {
  const headIcon = playerData?.headIcon;
  if (headIcon) {
    if (starRailData.avatars) {
      const avatar = starRailData.avatars[headIcon];
      if (avatar) {
        return avatar.icon;
      }
    }
    let icon: number | string;
    const headIconNum = parseInt(headIcon as unknown as string);
    if (isNaN(headIconNum)) {
      icon = headIcon;
    } else {// 角色头像ID处理
      const iconId = headIconNum - 200000;
      icon = (iconId > 1000 && iconId < 2000) || (iconId > 8000 && iconId < 9000) ? iconId : headIcon;
    }
    return `icon/avatar/${icon}.png`;
  }
  return undefined;
}

/** 晋阶的等级分割点 */
export const promotionLevels: number[] = [20, 30, 40, 50, 60, 70];

/** 给Slider组件的marks属性使用 */
export const promotionMarks: Mark[] = promotionLevels.map(value => ({ value }));

/** 根据晋阶等级获取角色或光锥等级 */
export function getLevel(promotion: number): number {
  if (promotion < 1) {
    return 0;
  }
  return promotion * 10 + 10;
}

/** 根据角色或光锥等级获取晋阶等级 */
export function getPromotion(level: number): number {
  if (level < 21) {
    return 0;
  }
  return Math.ceil(level / 10 - 2);
}

/** 获取当前晋阶的最高等级 */
export function getPromotionMaxLevel(promotionLevel: number): number {
  return promotionLevel * 10 + 20;
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
          result[index].value = new Decimal(result[index].value).add(property.value).toNumber();
        } else {
          result.push(Object.assign({}, property));
        }
      });
    }
  });
  return result;
}

const ratioTypes = ['HPAddedRatio', 'AttackAddedRatio', 'DefenceAddedRatio'];

export function showPercent(type: string): string {
  return ratioTypes.indexOf(type) < 0 ? '' : '百分比';
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

export const relicTypeMap: Record<RelicTypes, string> = {
  'HEAD': '头部',
  'HAND': '手部',
  'BODY': '躯干',
  'FOOT': '脚部',
  'NECK': '位面球',
  'OBJECT': '连接绳'
};

export const setMap: Record<number, string> = {
  1: '一件套：',
  2: '二件套：',
  3: '三件套：',
  4: '四件套：',
  5: '五件套：',
  6: '六件套：',
  7: '七件套：'
};
