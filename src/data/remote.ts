import { STATE } from '../common/state';
import { decodeBase64 } from '../common/utils';

let fetchError: Error | null = null;

const jsonRequest = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
};

export function fetchJson<T>(url: string): Promise<T> {
  return fetch(url, jsonRequest)
    .then(response => response.json())
    .then<T>(json => JSON.parse(decodeBase64(json.content)));
}

// 获取用户数据，跨域API无法使用 https://api.mihomo.me/sr_info/{uid}
export async function fetchStarRailInfo(uid: string): Promise<StarRailInfo> {
  if (fetchError !== null) {
    throw fetchError;
  } else {
    try {
      const json = await fetch(STATE.apiUrl + 'sr_info/' + uid, jsonRequest)
        .then(response => response.json() as StarRailInfo);
      return json;
    } catch (e) {
      fetchError = e as Error;
      throw e;
    }
  }
}

// 跨域API无法使用  https://api.mihomo.me/sr_info_parsed/{uid}
// export async function fetchStarRailInfoParsed(uid: string): Promise<StarRailInfoParsed> {
//   if (fetchError !== null) {
//     throw fetchError;
//   } else {
//     try {
//       const json = await fetch(STATE.apiUrl + 'sr_info_parsed/' + uid, jsonRequest)
//         .then(response => response.json());
//       return json;
//     } catch (e) {
//       fetchError = e as Error;
//       throw e;
//     }
//   }
// }

/** 获取游戏数据的版本信息 */
export function fetchStarRailDataInfo(): Promise<StarRailDataInfo> {
  return fetchJson<StarRailDataInfo>(STATE.dataUrl + 'info.json');
  // return fetchJson<StarRailDataInfo>('./mirror/info.json');
}

/** 获取游戏数据 */
export async function fetchStarRailData(starRailDataInfo?: StarRailDataInfo): Promise<StarRailData> {
  const latestStarRailDataInfo = starRailDataInfo ? starRailDataInfo : await fetchStarRailDataInfo();
  const { version, folder, timestamp } = latestStarRailDataInfo;
  const url = STATE.dataUrl + folder + '/cn/';
  return Promise.all([
    fetchJson<DataRecord<Character>>(url + 'characters.json'),
    fetchJson<DataRecord<CharacterRank>>(url + 'character_ranks.json'),
    fetchJson<DataRecord<CharacterPromotion>>(url + 'character_promotions.json'),
    fetchJson<DataRecord<CharacterSkill>>(url + 'character_skills.json'),
    fetchJson<DataRecord<CharacterSkillTree>>(url + 'character_skill_trees.json'),

    fetchJson<DataRecord<LightCone>>(url + 'light_cones.json'),
    fetchJson<DataRecord<LightConeRank>>(url + 'light_cone_ranks.json'),
    fetchJson<DataRecord<LightConePromotion>>(url + 'light_cone_promotions.json'),

    fetchJson<DataRecord<Property>>(url + 'properties.json'),
    fetchJson<DataRecord<Path>>(url + 'paths.json'),
    fetchJson<DataRecord<ElementAttack>>(url + 'elements.json'),
    fetchJson<DataRecord<Item>>(url + 'items.json'),
    fetchJson<DataRecord<Avatar>>(url + 'avatars.json'),

    fetchJson<DataRecord<Relic>>(url + 'relics.json'),
    fetchJson<DataRecord<RelicSet>>(url + 'relic_sets.json'),
    fetchJson<DataRecord<RelicMainAffix>>(url + 'relic_main_affixes.json'),
    fetchJson<DataRecord<RelicSubAffix>>(url + 'relic_sub_affixes.json')
  ])
    .then<StarRailData>(([
      characters,
      character_ranks,
      character_promotions,
      character_skills,
      character_skill_trees,
      light_cones,
      light_cone_ranks,
      light_cone_promotions,
      properties,
      paths,
      elements,
      items,
      avatars,
      relics,
      relic_sets,
      relic_main_affixes,
      relic_sub_affixes
    ]) => ({
      version,
      timestamp,
      characters,
      character_ranks,
      character_promotions,
      character_skills,
      character_skill_trees,
      light_cones,
      light_cone_ranks,
      light_cone_promotions,
      properties,
      paths,
      elements,
      items,
      avatars,
      relics,
      relic_sets,
      relic_main_affixes,
      relic_sub_affixes
    }));
}
