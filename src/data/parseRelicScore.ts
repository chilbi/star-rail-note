import Decimal from 'decimal.js';

export const mainAffixTypes: Record<RelicTypes, AffixTypes[]> = {
  'HEAD': ['HPDelta'],//头部固定生命
  'HAND': ['AttackDelta'],//手部固定攻击
  'BODY': [
    'HPAddedRatio',
    'AttackAddedRatio',
    'DefenceAddedRatio',
    'CriticalChanceBase',
    'CriticalDamageBase',
    'HealRatioBase',
    'StatusProbabilityBase'
  ],
  'FOOT': [
    'HPAddedRatio',
    'AttackAddedRatio',
    'DefenceAddedRatio',
    'SpeedDelta'
  ],
  'NECK': [
    'HPAddedRatio',
    'AttackAddedRatio',
    'DefenceAddedRatio',
    'PhysicalAddedRatio',
    'FireAddedRatio',
    'IceAddedRatio',
    'ThunderAddedRatio',
    'WindAddedRatio',
    'QuantumAddedRatio',
    'ImaginaryAddedRatio',
  ],
  'OBJECT': [
    'HPAddedRatio',
    'AttackAddedRatio',
    'DefenceAddedRatio',
    'BreakDamageAddedRatioBase',
    'SPRatioBase'
  ]
};

export const subAffixTypes: AffixTypes[] = [
  'HPDelta',
  'AttackDelta',
  'DefenceDelta',
  'HPAddedRatio',
  'AttackAddedRatio',
  'DefenceAddedRatio',
  'SpeedDelta',
  'CriticalChanceBase',
  'CriticalDamageBase',
  'StatusProbabilityBase',
  'StatusResistanceBase',
  'BreakDamageAddedRatioBase'
];

export type RelicFields = 'hp' | 'atk' | 'def' | 'critRate' | 'critDmg' | 'heal' | 'hit' | 'spd' | 'dmg' | 'bk' | 'sp' | 'res';

export type RecommendRelicFields = {
  [x in RelicFields]?: number;
}

const zeroWeights: Record<RelicFields, number> = {
  'hp': 0,
  'atk': 0,
  'def': 0,
  'spd': 0,
  'critRate': 0,
  'critDmg': 0,
  'bk': 0,
  'heal': 0,
  'sp': 0,
  'hit': 0,
  'res': 0,
  'dmg': 0
};

const fieldTypeMap: Partial<Record<RelicFields, AffixTypes>> = {
  'hp': 'HPAddedRatio',
  'atk': 'AttackAddedRatio',
  'def': 'DefenceAddedRatio',
  'critRate': 'CriticalChanceBase',
  'critDmg': 'CriticalDamageBase',
  'heal': 'HealRatioBase',
  'hit': 'StatusProbabilityBase',
  'spd': 'SpeedDelta',
  'bk': 'BreakDamageAddedRatioBase',
  'sp': 'SPRatioBase',
  'res': 'StatusResistanceBase'
};

const typeFieldMap: Partial<Record<AffixTypes, RelicFields>> = (() => {
  const map: Partial<Record<AffixTypes, RelicFields>> = {};
  Object.entries(fieldTypeMap).forEach(([field, type]) => {
    map[type] = field as RelicFields;
  })
  return map;
})();

export function getFieldType(field: RelicFields, elementId: string): AffixTypes {
  const type = fieldTypeMap[field];
  return type ? type : elementId + 'AddedRatio' as AffixTypes;
}

export function assignWeights(recommendAffixes: RecommendAffix[]): Record<RelicFields, number> {
  const weights = Object.assign({}, zeroWeights);
  recommendAffixes.forEach(({ type, weight }) => {
    const field = typeFieldMap[type];
    if (field) {
      weights[field] = weight;
    } else if (type.indexOf('AddedRatio') > -1) {
      weights['dmg'] = weight;
    }
  });
  return weights;
}

export type RecommedKeys =
  'critRate_critDmg_dmg_spd_atk_sp' |
  'critRate_critDmg_spd_dmg_atk_sp' |
  'critRate_critDmg_spd_dmg_hp_sp' |
  'critRate_critDmg_bk_spd_dmg_atk_sp' |

  'critRate_critDmg_hit_spd_dmg_sp_atk_bk' |

  'hit_spd_dmg_sp_atk_critRate_critDmg' |
  'hit_atk_spd_dmg_sp_bk' |
  'atk_spd_dmg_sp_bk' |

  'spd_sp_hp_atk_def_res' |
  'critDmg_spd_sp_hp_atk_def_res' |
  'atk_spd_sp_hp_atk_def_res' |
  'critRate_critDmg_sp_spd_atk_hp_def_res' |
  'bk_spd_sp_hp_def_res' |

  'def_spd_sp_hit_res_hp' |
  'hp_spd_sp_res_def' |

  'hp_heal_spd_sp_res_def' |
  'atk_heal_spd_sp_res_hp_def';

export type RecommendRelicFieldsRecord = Record<RecommedKeys, RecommendRelicFields>;

export const recommendRelicFieldsRecord: RecommendRelicFieldsRecord = {
  //双爆输出类型
  //毁灭巡猎智识通用类型
  'critRate_critDmg_dmg_spd_atk_sp': {
    'critRate': 1,
    'critDmg': 1,
    'dmg': 1,
    'spd': 0.75,
    'atk': 0.75,
    'sp': 0.75
  },
  //速度类型 希儿1102景元1204
  'critRate_critDmg_spd_dmg_atk_sp': {
    'critRate': 1,
    'critDmg': 1,
    'spd': 1,
    'dmg': 1,
    'atk': 0.75,
    'sp': 0.5,
  },
  //生命类型 刃1205
  'critRate_critDmg_spd_dmg_hp_sp': {
    'critRate': 1,
    'critDmg': 1,
    'spd': 1,
    'dmg': 1,
    'hp': 0.75,
    'sp': 0.5,
  },
  //击破类型 素裳1206雪衣1214
  'critRate_critDmg_bk_spd_dmg_atk_sp': {
    'critRate': 1,
    'critDmg': 1,
    'bk': 1,
    'spd': 1,
    'dmg': 1,
    'atk': 0.75,
    'sp': 0.5
  },

  //命中类型 瓦尔特1004
  'critRate_critDmg_hit_spd_dmg_sp_atk_bk': {
    'critRate': 1,
    'critDmg': 1,
    'hit': 1,
    'spd': 1,
    'dmg': 1,
    'sp': 0.75,
    'atk': 0.75,
    'bk': 0.5
  },

  //虚无通用类型 佩拉1106银狼1006
  'hit_spd_dmg_sp_atk_critRate_critDmg': {
    'hit': 1,
    'spd': 1,
    'dmg': 1,
    'sp': 1,
    'atk': 0.75,
    'critRate': 0.75,
    'critDmg': 0.75
  },
  //dot输出类型 桑博1108卢卡1111桂乃芬1210黑天鹅1307
  'hit_atk_spd_dmg_sp_bk': {
    'hit': 1,
    'atk': 1,
    'spd': 1,
    'dmg': 1,
    'sp': 1,
    'bk': 0.5
  },
  //卡芙卡1005
  'atk_spd_dmg_sp_bk': {
    'atk': 1,
    'spd': 1,
    'dmg': 1,
    'sp': 1,
    'bk': 0.5
  },

  //辅助类型
  //同谐通用类型 艾丝妲1009寒鸦1215
  'spd_sp_hp_atk_def_res': {
    'spd': 1,
    'sp': 1,
    'hp': 0.5,
    'atk': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //爆伤辅助 布洛妮娅1101花火1306
  'critDmg_spd_sp_hp_atk_def_res': {
    'critDmg': 1,
    'spd': 1,
    'sp': 1,
    'hp': 0.5,
    'atk': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //攻击辅助 停云1202
  'atk_spd_sp_hp_atk_def_res': {
    'atk': 1,
    'spd': 1,
    'sp': 1,
    'hp': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //副c辅助 驭空1207
  'critRate_critDmg_sp_spd_atk_hp_def_res': {
    'critRate': 1,
    'critDmg': 1,
    'sp': 1,
    'spd': 0.75,
    'atk': 0.75,
    'hp': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //击破辅助 阮梅1303
  'bk_spd_sp_hp_def_res': {
    'bk': 1,
    'sp': 1,
    'spd': 0.75,
    'hp': 0.5,
    'def': 0.5,
    'res': 0.5
  },

  //生存类型
  //存护通用类型 防御命中类型 杰帕德三月七开拓者火
  'def_spd_sp_hit_res_hp': {
    'def': 1,
    'spd': 1,
    'sp': 1,
    'hit': 0.75,
    'res': 0.75,
    'hp': 0.5
  },
  //生命类型 符玄1208
  'hp_spd_sp_res_def': {
    'hp': 1,
    'spd': 1,
    'sp': 1,
    'res': 0.75,
    'def': 0.5
  },
  
  //丰饶通用类型 生命类型 白露娜塔莎玲可藿藿
  'hp_heal_spd_sp_res_def': {
    'hp': 1,
    'heal': 1,
    'spd': 1,
    'sp': 1,
    'res': 0.75,
    'def': 0.5
  },
  //攻击类型 罗刹1203
  'atk_heal_spd_sp_res_hp_def': {
    'atk': 1,
    'heal': 1,
    'spd': 1,
    'sp': 1,
    'res': 0.75,
    'hp': 0.5,
    'def': 0.5
  }
};

export const recommendCharacterRelicFields: Record<string, RecommedKeys | undefined> = {
  '1102': 'critRate_critDmg_spd_dmg_atk_sp',//希儿
  '1204': 'critRate_critDmg_spd_dmg_atk_sp',//景元
  '1205': 'critRate_critDmg_spd_dmg_hp_sp',//刃
  '1206': 'critRate_critDmg_bk_spd_dmg_atk_sp',//素裳
  '1214': 'critRate_critDmg_bk_spd_dmg_atk_sp',//雪衣
  '1004': 'critRate_critDmg_hit_spd_dmg_sp_atk_bk',//瓦尔特
  '1108': 'hit_atk_spd_dmg_sp_bk',//桑博
  '1111': 'hit_atk_spd_dmg_sp_bk',//卢卡
  '1210': 'hit_atk_spd_dmg_sp_bk',//桂乃芬
  '1307': 'hit_atk_spd_dmg_sp_bk',//黑天鹅
  '1005': 'atk_spd_dmg_sp_bk',//卡芙卡
  '1101': 'critDmg_spd_sp_hp_atk_def_res',//布洛妮娅
  '1306': 'critDmg_spd_sp_hp_atk_def_res',//花火
  '1202': 'atk_spd_sp_hp_atk_def_res',//停云
  '1207': 'critRate_critDmg_sp_spd_atk_hp_def_res',//驭空
  '1303': 'bk_spd_sp_hp_def_res',//阮梅
  '1208': 'hp_spd_sp_res_def',//符玄
  '1203': 'atk_heal_spd_sp_res_hp_def'//罗刹
};

function getRecommendCharacterRelicFields(characterId: string, pathId: string): RecommendRelicFields {
  const key = recommendCharacterRelicFields[characterId];
  if (key) {
    return recommendRelicFieldsRecord[key];
  } else {
    switch (pathId) {
      case 'Shaman':
        return recommendRelicFieldsRecord['spd_sp_hp_atk_def_res'];
      case 'Warlock':
        return recommendRelicFieldsRecord['hit_spd_dmg_sp_atk_critRate_critDmg'];
      case 'Knight':
        return recommendRelicFieldsRecord['def_spd_sp_hit_res_hp'];
      case 'Priest':
        return recommendRelicFieldsRecord['hp_heal_spd_sp_res_def'];
      default:
        return recommendRelicFieldsRecord['critRate_critDmg_dmg_spd_atk_sp'];
    }
  }
}

export function getDefaultWeights(characterId: string, pathId: string): Record<RelicFields, number> {
  const fields = getRecommendCharacterRelicFields(characterId, pathId);
  return Object.assign({}, zeroWeights, fields);
}

export function getDeltaWeights(
  totalProperties: TotalPropertyInfo[],
  starRailData: StarRailData
): Record<AffixTypes, number> {
  let delta: Decimal;
  let addedRatio: Decimal;
  const affixes = starRailData.relic_sub_affixes['5'].affixes;
  const detalWeights = {} as Record<AffixTypes, number>;
  // hp
  delta = new Decimal(affixes['1'].step).mul(2).add(affixes['1'].base);
  addedRatio = new Decimal(affixes['4'].step).mul(2).add(affixes['4'].base);
  detalWeights['HPDelta'] = delta.div(addedRatio.mul(totalProperties[0].base.value)).toNumber();
  // atk
  delta = new Decimal(affixes['2'].step).mul(2).add(affixes['2'].base);
  addedRatio = new Decimal(affixes['5'].step).mul(2).add(affixes['5'].base);
  detalWeights['AttackDelta'] = delta.div(addedRatio.mul(totalProperties[1].base.value)).toNumber();
  // def
  delta = new Decimal(affixes['3'].step).mul(2).add(affixes['3'].base);
  addedRatio = new Decimal(affixes['6'].step).mul(2).add(affixes['6'].base);
  detalWeights['DefenceDelta'] = delta.div(addedRatio.mul(totalProperties[2].base.value)).toNumber();
  return detalWeights;
}

export function getRecommendAffixes(
  characterId: string,
  pathId: string,
  elementId: string,
  localFieldsRecord: Record<string, RecommendRelicFields> | null,
  deltaWeights: Record<AffixTypes, number>
): RecommendAffix[] {
  let deltaWeight: number;
  let fields;
  if (localFieldsRecord) {
    const localFields = localFieldsRecord[characterId];
    if (localFields) {
      fields = localFields;
    } else {
      fields = getRecommendCharacterRelicFields(characterId, pathId);
    }
  } else {
    fields = getRecommendCharacterRelicFields(characterId, pathId);
  }
  const recommendAffixes: RecommendAffix[] = [];
  (Object.entries(fields) as [RelicFields, number][]).forEach(([field, weight]) => {
    let type: AffixTypes;
    switch (field) {
      case 'hp':
        deltaWeight = new Decimal(deltaWeights['HPDelta']).mul(weight).toNumber();
        recommendAffixes.push({ type: 'HPDelta', weight: deltaWeight });
        type = 'HPAddedRatio';
        break;
      case 'atk':
        deltaWeight = new Decimal(deltaWeights['AttackDelta']).mul(weight).toNumber();
        recommendAffixes.push({ type: 'AttackDelta', weight: deltaWeight });
        type = 'AttackAddedRatio';
        break;
      case 'def':
        deltaWeight = new Decimal(deltaWeights['DefenceDelta']).mul(weight).toNumber();
        recommendAffixes.push({ type: 'DefenceDelta', weight: deltaWeight });
        type = 'DefenceAddedRatio';
        break;
      case 'critRate':
        type = 'CriticalChanceBase';
        break;
      case 'critDmg':
        type = 'CriticalDamageBase';
        break;
      case 'heal':
        type = 'HealRatioBase';
        break;
      case 'hit':
        type = 'StatusProbabilityBase';
        break;
      case 'spd':
        type = 'SpeedDelta';
        break;
      case 'bk':
        type = 'BreakDamageAddedRatioBase';
        break;
      case 'sp':
        type = 'SPRatioBase';
        break;
      case 'res':
        type = 'StatusResistanceBase';
        break;
      default:
        type = elementId + 'AddedRatio' as AffixTypes;
    }
    recommendAffixes.push({ type, weight });
  });
  return recommendAffixes.sort((a, b) => b.weight - a.weight);
}

export function getRecommendAffixesText(recommendAffixes: RecommendAffix[], starRailData: StarRailData): string {
  let text = '';
  let prevWeight = 0;
  const exclude = ['HPDelta', 'AttackDelta', 'DefenceDelta'];
  recommendAffixes.forEach(value => {
    if (exclude.indexOf(value.type) < 0) {
      if (prevWeight === 0) {   
        text += `(${value.weight}) `;
      } else {
        text += prevWeight === value.weight ? ' = ' : ` > (${value.weight}) `;  
      }
      text += starRailData.properties[value.type].name;
      prevWeight = value.weight;
    }
  });
  if (text === '') {
    text = '任意属性'
  }
  return text;
}

/*
主词条: 10 * 4 = 40
副词条：9 * 6 = 54
套装效果: 2.725 * 3 = 8.175
*/
export const standardScore = {
  main: 10,
  sub: 9,
  set: 2.725,
  set4: 0.825
};

const levelWeihgt = new Decimal(1).div(17.85);
const baseWeight = levelWeihgt.mul(2.85);
const countWeight = new Decimal(0.8);
const stepWeight = new Decimal(0.1);

/** 获取遗器部位分数 [0, 19] */
export function parseRelicScore(
  relic: RelicInfo,
  recommendAffixes: RecommendAffix[],
  deltaWeights: Record<AffixTypes, number>
): RelicScore {
  let myMainScore = 0;
  let mySubScore = 0;
  let bestMainScore = 0;
  let bestSubScore = 0;
  let isBestMain = true;
  const mainTypes = mainAffixTypes[relic.type];
  const recommendMainAffixes = recommendAffixes.filter(value => mainTypes.some(type => type === value.type));
  const hasRecommendMainAffixes = recommendMainAffixes.length > 0;
  const bestMainAffix = hasRecommendMainAffixes ? recommendMainAffixes[0] : undefined;
  const isHeadOrHand = relic.type === 'HEAD' || relic.type === 'HAND';
  //主词条分数
  if (!isHeadOrHand) {
    bestMainScore = standardScore.main;
    if (bestMainAffix) {
      const myMainAffix = recommendMainAffixes.find(value => value.type === relic.main_affix.type);
      if (myMainAffix != undefined) {
        myMainScore = new Decimal(standardScore.main)
          .mul(levelWeihgt.mul(relic.level).add(baseWeight)).div(levelWeihgt.mul(15).add(baseWeight))
          .mul(myMainAffix.weight).div(bestMainAffix.weight)
          .mul(relic.rarity).div(5)
          .toNumber();
        isBestMain = myMainAffix.weight === bestMainAffix.weight;
      } else {
        isBestMain = false;
      }
    } else {
      myMainScore = new Decimal(standardScore.main)
        .mul(levelWeihgt.mul(relic.level).add(baseWeight)).div(levelWeihgt.mul(15).add(baseWeight))
        .mul(relic.rarity).div(5)
        .toNumber();
    }
  }
  //副词条分数
  const recommendSubAffixes = recommendAffixes.filter(value => subAffixTypes.some(type => type === value.type));
  const bestSubAffixes = recommendSubAffixes.filter(value => value !== bestMainAffix);
  if (bestSubAffixes.length > 0) {
    let _bestSubScore = new Decimal(bestSubAffixes[0].weight).mul(6);
    if (bestSubAffixes[1]) {
      _bestSubScore = _bestSubScore.add(bestSubAffixes[1].weight);
      if (bestSubAffixes[2]) {
        _bestSubScore = _bestSubScore.add(bestSubAffixes[2].weight);
        if (bestSubAffixes[3]) {
          _bestSubScore = _bestSubScore.add(bestSubAffixes[3].weight);
        }
      }
    }
    bestSubScore = _bestSubScore.toNumber();
  }
  if (bestSubScore === 0) {
    bestSubScore = standardScore.sub;
    let _mySubScore = new Decimal(0);
    relic.sub_affix.forEach(subAffix => {
      let weight = deltaWeights[subAffix.type as AffixTypes];
      if (weight == undefined) {
        weight = 1;
      }
      _mySubScore = _mySubScore
        .add(countWeight.mul(subAffix.count).mul(weight))
        .add(stepWeight.mul(subAffix.step).mul(weight));
    });
    mySubScore = _mySubScore.toNumber();
  } else {
    let _mySubScore = new Decimal(0);
    relic.sub_affix.forEach(subAffix => {
      const mySubAffix = recommendSubAffixes.find(value => value.type === subAffix.type);
      if (mySubAffix != undefined) {
        _mySubScore = _mySubScore
          .add(countWeight.mul(subAffix.count).mul(mySubAffix.weight))
          .add(stepWeight.mul(subAffix.step).mul(mySubAffix.weight))
      }
    });
    mySubScore = _mySubScore.toNumber();
  }
  mySubScore = new Decimal(mySubScore)
    .mul(relic.rarity).div(5)
    .div(bestSubScore)
    .mul(standardScore.sub)
    .toNumber();
  bestSubScore = standardScore.sub;
  return {
    myMainScore,
    mySubScore,
    bestMainScore,
    bestSubScore,
    isBestMain,
    isHeadOrHand,
    myMainScoreDisplay: new Decimal(myMainScore).toFixed(2, Decimal.ROUND_DOWN),
    mySubScoreDisplay: new Decimal(mySubScore).toFixed(2, Decimal.ROUND_DOWN),
    bestMainScoreDisplay: new Decimal(bestMainScore).toFixed(2, Decimal.ROUND_DOWN),
    bestSubScoreDisplay: new Decimal(bestSubScore).toFixed(2, Decimal.ROUND_DOWN),
    mainScoreDisplay: isHeadOrHand ? '100%' : new Decimal(myMainScore).div(bestMainScore)
      .mul(100).toFixed(0, Decimal.ROUND_DOWN) + '%',
    subScoreDisplay: new Decimal(mySubScore).div(bestSubScore)
      .mul(100).toFixed(0, Decimal.ROUND_DOWN) + '%',
    scoreDisplay: new Decimal(myMainScore).add(mySubScore)
      .div(new Decimal(bestMainScore).add(bestSubScore))
      .mul(100).toFixed(0, Decimal.ROUND_DOWN) + '%'
  };
}
