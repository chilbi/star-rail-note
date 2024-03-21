import { STATE } from '../common/state';
import { decodeBase64 } from '../common/utils';

let fetchError: Error | null = null;

export function fetchDecoedContent<T>(url: string): Promise<T> {
  return fetch(url)
    .then(response => response.json())
    .then<T>(json => JSON.parse(decodeBase64(json.content)));
}

// 获取用户数据，跨域API无法使用 https://api.mihomo.me/sr_info/{uid}
export async function fetchStarRailInfo(uid: string): Promise<StarRailInfo> {
  if (fetchError !== null) {
    throw fetchError;
  } else {
    try {
      const info = await fetch(STATE.apiUrl + 'sr_info/' + uid)
        .then<StarRailInfo>(response => response.json());
      return info;
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
//       const json = await fetch(STATE.apiUrl + 'sr_info_parsed/' + uid)
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
  return fetchDecoedContent<StarRailDataInfo>(STATE.dataUrl + 'info.json');
  // return fetchJson<StarRailDataInfo>('./mirror/info.json');
}

/** 获取游戏数据 */
export async function fetchStarRailData(starRailDataInfo?: StarRailDataInfo): Promise<StarRailData> {
  const latestStarRailDataInfo = starRailDataInfo ? starRailDataInfo : await fetchStarRailDataInfo();
  const { version, folder, timestamp } = latestStarRailDataInfo;
  const url = STATE.dataUrl + folder + '/cn/';
  return Promise.all([
    fetchDecoedContent<DataRecord<Character>>(url + 'characters.json'),
    fetchDecoedContent<DataRecord<CharacterRank>>(url + 'character_ranks.json'),
    fetchDecoedContent<DataRecord<CharacterPromotion>>(url + 'character_promotions.json'),
    fetchDecoedContent<DataRecord<CharacterSkill>>(url + 'character_skills.json'),
    fetchDecoedContent<DataRecord<CharacterSkillTree>>(url + 'character_skill_trees.json'),

    fetchDecoedContent<DataRecord<LightCone>>(url + 'light_cones.json'),
    fetchDecoedContent<DataRecord<LightConeRank>>(url + 'light_cone_ranks.json'),
    fetchDecoedContent<DataRecord<LightConePromotion>>(url + 'light_cone_promotions.json'),

    fetchDecoedContent<DataRecord<Property>>(url + 'properties.json'),
    fetchDecoedContent<DataRecord<Path>>(url + 'paths.json'),
    fetchDecoedContent<DataRecord<ElementAttack>>(url + 'elements.json'),
    fetchDecoedContent<DataRecord<Item>>(url + 'items.json'),
    fetchDecoedContent<DataRecord<Avatar>>(url + 'avatars.json'),

    fetchDecoedContent<DataRecord<Relic>>(url + 'relics.json'),
    fetchDecoedContent<DataRecord<RelicSet>>(url + 'relic_sets.json'),
    fetchDecoedContent<DataRecord<RelicMainAffix>>(url + 'relic_main_affixes.json'),
    fetchDecoedContent<DataRecord<RelicSubAffix>>(url + 'relic_sub_affixes.json')
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

/** 获取测试数据 */
export function fetchStarRailTest(): Promise<StarRailTest> {
  return fetch(STATE.hsrApiUrl + 'new.json?time=' + new Date().getTime())
    .then(response => response.json());
}

export function fetchStarRailTestData(
  starRailTest: StarRailTest
): Promise<[
  StarRailTestCharacter[],
  StarRailTestLightCone[],
  StarRailTestRelicSet[]
]> {
  return Promise.all([
    Promise.all(starRailTest.character.map(id =>
      fetch(STATE.hsrApiUrl + `data/cn/character/${id}.json?time=${new Date().getTime()}`)
        .then<StarRailTestCharacter>(response => response.json())
        .then(json => {
          json.Id = id;
          return json;
        })
    )),
    Promise.all(starRailTest.lightcone.map(id =>
      fetch(STATE.hsrApiUrl + `data/cn/lightcone/${id}.json?time=${new Date().getTime()}`)
        .then<StarRailTestLightCone>(response => response.json())
        .then(json => {
          json.Id = id;
          return json;
        })
    )),
    Promise.all(starRailTest.relicset.map(id =>
      fetch(STATE.hsrApiUrl + `data/cn/relicset/${id}.json?time=${new Date().getTime()}`)
        .then<StarRailTestRelicSet>(response => response.json())
        .then(json => {
          json.Id = id;
          return json;
        })
    ))
  ]);
}
