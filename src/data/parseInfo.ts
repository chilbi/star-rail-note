import Decimal from 'decimal.js';
import { baseStepValue, formatProperty, headIconUrl, relicMainValue, relicSubValue } from './local';
import { RecommendRelicFields, getDeltaWeights, getRecommendAffixes, getRecommendAffixesText, parseRelicScore, standardScore } from './parseRelicScore';

export function parseInfo(
  playerData: PlayerData,
  starRailData: StarRailData,
  localFieldsRecord: Record<string, RecommendRelicFields> | null,
  elements: string[]
): StarRailInfoParsed {
  let avatar: Avatar | undefined = undefined;
  if (starRailData.avatars) {
    avatar = starRailData.avatars[playerData.headIcon];
  }
  if (avatar == undefined){
    const chara = starRailData.characters[playerData.headIcon];
    avatar = {
      id: playerData.headIcon.toString(),
      name: chara ? chara.name : '',
      icon: headIconUrl(playerData, starRailData) || ''
    };
  }

  const player: PlayerInfo = {
    uid: playerData.uid.toString(),
    nickname: playerData.nickname,
    level: playerData.level,
    world_level: playerData.worldLevel || 0,
    friend_count: playerData.friendCount || 0,
    signature: playerData.signature || '',
    is_display: playerData.isDisplayAvatar,
    avatar,
  };

  let characters: CharacterInfo[] = [];

  if (playerData.avatarDetailList && playerData.avatarDetailList.length > 0) {
    characters = playerData.avatarDetailList.map(characterDetailData =>
      parseCharacterInfo(characterDetailData, starRailData, localFieldsRecord, elements)
    );
  }
  
  return { player, characters };
}

const skillTypeAnchor: Record<SkillType, string> = {
  'Normal': 'Point01',
  'BPSkill': 'Point02',
  'Ultra': 'Point03',
  'Talent': 'Point04',
  'Maze': 'Point05',
  'MazeNormal': 'Point05'
};

function parseCharacterInfo(
  characterDetailData: CharacterDetailData,
  starRailData: StarRailData,
  localFieldsRecord: Record<string, RecommendRelicFields> | null,
  elements: string[]
): CharacterInfo {
  const characterId = characterDetailData.avatarId.toString();
  const character = starRailData.characters[characterId];
  if (character == undefined) {
    throw new Error(`数据库中查找不到id为${characterId}的角色，请尝试更新数据库。`);
  }
  const characterLevel = characterDetailData.level || 1;
  const characterRank = characterDetailData.rank || 0;
  const characterPromotion = characterDetailData.promotion || 0;

  const rank_icons: string[] = [];
  const rankLevelUpSkills: LevelUpSkill[] = [];
  character.ranks.forEach(rankId => {
    const rank = starRailData.character_ranks[rankId];
    rank_icons.push(rank.icon);
    if (rank.rank <= characterRank) {
      rank.level_up_skills.forEach(levelUp => {
        const existingLevelUp = rankLevelUpSkills.find(value => value.id === levelUp.id);
        if (existingLevelUp) {
          existingLevelUp.num += levelUp.num;
        } else {
          rankLevelUpSkills.push(Object.assign({}, levelUp));
        }
      });
    }
  });
  
  const pickSkills: string[] = ['Normal', 'BPSkill', 'Ultra', 'Talent'].map(type => {
    return character.skills.find(skillId => starRailData.character_skills[skillId].type === type)!;
  });
  const skills: SkillInfo[] = pickSkills.map(skillId => {
    const skill = starRailData.character_skills[skillId];
    const anchor = skillTypeAnchor[skill.type];
    const skilltreeData = characterDetailData.skillTreeList.find(value => {
      const skillTree = starRailData.character_skill_trees[value.pointId];
      return skillTree.anchor === anchor;
    });
    return Object.assign({}, skill, {
      level: skilltreeData ? skilltreeData.level : 1,
      element: starRailData.elements[skill.element],
      rankLevelUp: rankLevelUpSkills.find(value => value.id === skillId)?.num
    });
  });

  const skill_trees: SkillTreeInfo[] = characterDetailData.skillTreeList.map(skillTreeData => {
    const skillTree = starRailData.character_skill_trees[skillTreeData.pointId];
    return Object.assign({}, skillTree, { level: skillTreeData.level });
  });

  const light_cone = parseLightConeInfo(characterDetailData, character.path, starRailData);

  let relics: RelicInfo[] = [];
  let relic_sets: RelicSetInfo[] = [];
  if (characterDetailData.relicList && characterDetailData.relicList.length > 0) {
    relics = characterDetailData.relicList.map(relicData => parseRelicInfo(relicData, starRailData));
    relic_sets = parseRelicSetInfoList(characterDetailData.relicList, starRailData);
  }

  const characterPromotionValue = starRailData.character_promotions[characterId]
    .values[characterPromotion];
  const attributes: AttributeInfo[] = ([
    ['BaseHP', characterPromotionValue.hp],
    ['BaseAttack', characterPromotionValue.atk],
    ['BaseDefence', characterPromotionValue.def],
    ['BaseSpeed', characterPromotionValue.spd],
    ['CriticalChanceBase', characterPromotionValue.crit_rate],
    ['CriticalDamageBase', characterPromotionValue.crit_dmg]
  ] as [string, PromotionBaseStep][]).map(([type, baseStep]) => {
    const property = starRailData.properties[type];
    const value = baseStepValue(baseStep, characterLevel);
    const display = formatProperty(value, property.percent);
    return Object.assign({}, property, {
      value,
      display,
      from: 'CHARACTER_PROMOTION'
    });
  });

  const additions: AttributeInfo[] = [];
  characterDetailData.skillTreeList.forEach(skillTreeData => {
    if (skillTreeData.level > 0) {
      const skillTree = starRailData.character_skill_trees[skillTreeData.pointId];
      const properties = skillTree.levels[skillTreeData.level - 1].properties;
      if (properties.length > 0) {
        properties.forEach(({ type, value }) => {
          const property = starRailData.properties[type];
          const display = formatProperty(value, property.percent);
          additions.push(Object.assign({}, property, {
            value,
            display,
            from: 'SKILL_TREE_' + skillTreeData.pointId
          }));
        });
      }
    }
  });

  const totalRecord: Record<string, PropertyInfo> = {};
  const totalRelicsRecord: Record<string, PropertyInfo> = {};
  const spRatioBase = starRailData.properties['SPRatioBase'];
  totalRecord[spRatioBase.type] = Object.assign({}, spRatioBase, {
    value: 1.0,
    display: formatProperty(1.0, spRatioBase.percent),
    from: 'CHARACTER_PROMOTION'
  });
  forEachPut(totalRecord, attributes);
  if (light_cone) {
    forEachPut(totalRecord, light_cone.attributes);
    forEachPut(totalRecord, light_cone.properties);
  }
  forEachPut(totalRecord, additions);
  relics.forEach(relic => {
    forEachPut(totalRecord, [relic.main_affix]);
    forEachPut(totalRecord, relic.sub_affix);
    forEachPut(totalRelicsRecord, [relic.main_affix], 2, 2);
    forEachPut(totalRelicsRecord, relic.sub_affix, 2, 2);
  });
  relic_sets.forEach(relicSet => {
    forEachPut(totalRecord, relicSet.properties);
    forEachPut(totalRelicsRecord, relicSet.properties, 2, 2);
  });

  const properties: PropertyInfo[] = Object.keys(totalRecord).map(type => totalRecord[type]);

  let relicsProperties: PropertyInfo[] = Object.keys(totalRelicsRecord).map(type => totalRelicsRecord[type]);
  relicsProperties = relicsProperties.sort((a, b) => a.order - b.order);

  let totalProperties: TotalPropertyInfo[] = totalBaseProperties(totalRecord, starRailData.properties);
  totalProperties.push(...totalAdvancedProperies(totalRecord, starRailData.properties));
  totalProperties.push(...totalElementProperties(totalRecord, starRailData.properties, elements))
  const maxSP: PropertyInfo = Object.assign({}, starRailData.properties['MaxSP'], {
    value: character.max_sp,
    display: character.max_sp.toString(),
    from: 'CHARACTER_PROMOTION'
  });
  totalProperties.push(Object.assign({}, maxSP, { base: maxSP }));
  const allDamageType = totalRecord['AllDamageTypeAddedRatio'];
  if (allDamageType) {
    totalProperties.push(Object.assign({}, allDamageType, { base: allDamageType }));
  }
  totalProperties = totalProperties.sort((a, b) => a.order - b.order);

  const deltaWeights = getDeltaWeights(totalProperties, starRailData);

  const recommendAffixes = getRecommendAffixes(
    characterId,
    character.path,
    character.element,
    localFieldsRecord,
    deltaWeights
  );

  let myMainScore = new Decimal(0);
  let mySubScore = new Decimal(0);
  let mySetScore = new Decimal(standardScore.set).mul(relic_sets.length);
  if (relic_sets.some(value => value.num === 4)) {
    mySetScore = mySetScore.add(standardScore.set4);
  }
  const bestMainScore = new Decimal(standardScore.main).mul(4);
  const bestSubScore = new Decimal(standardScore.sub).mul(6);
  const bestSetScore = new Decimal(standardScore.set).mul(3).add(standardScore.set4);
  const relicScoreRecord = {} as Record<RelicTypes, RelicScore>;
  relics.forEach(relic => {
    const relicScore = parseRelicScore(relic, recommendAffixes, deltaWeights);
    relicScoreRecord[relic.type] = relicScore;
    myMainScore = myMainScore.add(relicScore.myMainScore);
    mySubScore = mySubScore.add(relicScore.mySubScore);
    myMainScore
  });
  const totalRelicScore: TotalRelicScore = {
    myMainScore: myMainScore.toNumber(),
    mySubScore: mySubScore.toNumber(),
    mySetScore: mySetScore.toNumber(),
    bestMainScore: bestMainScore.toNumber(),
    bestSubScore: bestSubScore.toNumber(),
    bestSetScore: bestSetScore.toNumber(),
    recommendAffixesText: getRecommendAffixesText(recommendAffixes, starRailData),
    myMainScoreDisplay: myMainScore.toFixed(2, Decimal.ROUND_DOWN),
    mySubScoreDisplay: mySubScore.toFixed(2, Decimal.ROUND_DOWN),
    mySetScoreDisplay: mySetScore.toFixed(2, Decimal.ROUND_DOWN),
    bestMainScoreDisplay: bestMainScore.toFixed(2, Decimal.ROUND_DOWN),
    bestSubScoreDisplay: bestSubScore.toFixed(2, Decimal.ROUND_DOWN),
    bestSetScoreDisplay: bestSetScore.toFixed(2, Decimal.ROUND_DOWN),
    mainScoreDisplay: myMainScore.div(bestMainScore)
      .mul(100).toFixed(0, Decimal.ROUND_DOWN) + '%',
    subScoreDisplay: mySubScore.div(bestSubScore)
      .mul(100).toFixed(0, Decimal.ROUND_DOWN) + '%',
    setScoreDisplay: mySetScore.div(bestSetScore)
      .mul(100).toFixed(0, Decimal.ROUND_DOWN) + '%',
    scoreDisplay: myMainScore.add(mySubScore).add(mySetScore)
      .div(bestMainScore.add(bestSubScore).add(bestSetScore))
      .mul(100).toFixed(0, Decimal.ROUND_DOWN) + '%'
  };

  return {
    id: characterId,
    name: character.name,
    rarity: character.rarity,
    rank: characterRank,
    level: characterLevel,
    promotion: characterPromotion,
    icon: character.icon,
    preview: character.preview,
    portrait: character.portrait,
    rank_icons,
    path: starRailData.paths[character.path],
    element: starRailData.elements[character.element],
    skills,
    skill_trees,
    light_cone,
    relics,
    relic_sets,
    attributes,
    additions,
    properties,
    relicsProperties,
    totalProperties,
    totalRecord,

    recommendAffixes,
    relicScoreRecord,
    totalRelicScore
  };
}

function parseLightConeInfo(
  characterDetailData: CharacterDetailData,
  characterPath: string,
  starRailData: StarRailData
): LightConeInfo | undefined {
  let lightConeInfo: LightConeInfo | undefined = undefined;
  if (characterDetailData.equipment && characterDetailData.equipment.tid) {
    const lightConeId = characterDetailData.equipment.tid.toString();
    const lightCone = starRailData.light_cones[lightConeId];
    if (lightCone == undefined) {
      throw new Error(`数据库中查找不到id为${lightCone}的光锥，请尝试更新数据库。`);
    }
    const lightConeLevel = characterDetailData.equipment.level || 1;
    const lightConeRank = characterDetailData.equipment.rank || 1;
    const lightConePromotion = characterDetailData.equipment.promotion || 0;
    const lightConePromotionValue = starRailData.light_cone_promotions[lightConeId]
      .values[lightConePromotion];
    const lightConeAttributes: AttributeInfo[] = ([
      ['BaseHP', lightConePromotionValue.hp],
      ['BaseAttack', lightConePromotionValue.atk],
      ['BaseDefence', lightConePromotionValue.def]
    ] as [string, PromotionBaseStep][]).map(([type, baseStep]) => {
      const property = starRailData.properties[type];
      const value = baseStepValue(baseStep, lightConeLevel);
      const display = formatProperty(value, property.percent);
      return Object.assign({}, property, {
        value,
        display,
        from: 'LIGHT_CONE_PROMOTION'
      });
    });
    const lightConeProperties: PropertyInfo[] = characterPath === lightCone.path ? toPropertyInfoList(
      starRailData.light_cone_ranks[lightConeId].properties[lightConeRank - 1],
      starRailData,
      'LIGHT_CONE_RANK'
    ) : [];
    lightConeInfo = {
      id: lightConeId,
      name: lightCone.name,
      rarity: lightCone.rarity,
      rank: lightConeRank,
      level: lightConeLevel,
      promotion: lightConePromotion,
      desc: lightCone.desc,
      icon: lightCone.icon,
      preview: lightCone.preview,
      portrait: lightCone.portrait,
      path: starRailData.paths[lightCone.path],
      attributes: lightConeAttributes,
      properties: lightConeProperties
    };
  }
  return lightConeInfo;
}

function parseRelicInfo(relicData: RelicData, starRailData: StarRailData): RelicInfo {
  const relic = starRailData.relics[relicData.tid];
  if (relic == undefined) {
    throw new Error(`数据库中查找不到id为${relicData.tid}的遗器，请尝试更新数据库。`);
  }
  const relicLevel = relicData.level || 0;
  const relicSet = starRailData.relic_sets[relic.set_id];
  const relicSubAffixes = starRailData.relic_sub_affixes[relic.sub_affix_id].affixes;
  const mainAffix = starRailData.relic_main_affixes[relic.main_affix_id].affixes[relicData.mainAffixId];
  const mainProperty = starRailData.properties[mainAffix.property];
  const mainValue = relicMainValue(mainAffix, relicLevel);
  const mainDisplay = formatProperty(mainValue, mainProperty.percent, 2, 2);
  const main_affix: PropertyInfo = Object.assign({}, mainProperty, {
    value: mainValue,
    display: mainDisplay,
    from: 'RELIC_' + relic.type
  });
  const sub_affix: SubAffixInfo[] = relicData.subAffixList.map(subAffixData => {
    const subStep = subAffixData.step || 0;
    const subAffix = relicSubAffixes[subAffixData.affixId];
    const subProperty = starRailData.properties[subAffix.property];
    const subValue = relicSubValue(subAffix, subAffixData.cnt, subStep);
    const subDisplay = formatProperty(subValue, subProperty.percent, 2, 2);
    return Object.assign({}, subProperty, {
      value: subValue,
      display: subDisplay,
      from: 'RELIC_' + relic.type,
      count: subAffixData.cnt,
      step: subStep
    });
  });
  // sub_affix = sub_affix.sort((a, b) => b.order - a.order);
  return {
    id: relic.id,
    name: relic.name,
    type: relic.type,
    set_id: relic.set_id,
    set_name: relicSet.name,
    rarity: relic.rarity,
    level: relicLevel,
    icon: relic.icon,
    main_affix,
    sub_affix
  };
}

function parseRelicSetInfoList(relicList: RelicData[], starRailData: StarRailData): RelicSetInfo[] {
  let relicSetInfoList: RelicSetInfo[] = [];
  relicList.forEach(relicData => {
    const relic = starRailData.relics[relicData.tid];
    if (relic == undefined) {
      throw new Error(`数据库中查找不到id为${relicData.tid}的遗器，请尝试更新数据库。`);
    }
    const relicSet = starRailData.relic_sets[relic.set_id];
    const existingSet = relicSetInfoList.find(info => info.id === relicSet.id);
    if (existingSet) {
      existingSet.num += 1;
    } else {
      relicSetInfoList.push(Object.assign({}, relicSet, { num: 1, desc: '', properties: [] }));
    }
  });
  relicSetInfoList.slice().forEach(info => {
    if (info.num > 3) {
      const relicSet = starRailData.relic_sets[info.id];
      info.desc = relicSet.desc[1];
      info.properties = toPropertyInfoList(relicSet.properties[1], starRailData, 'RELIC_SET_' + relicSet.id);
      const index = relicSetInfoList.findIndex(value => value.id === info.id);
      const relicSet2: RelicSetInfo = Object.assign({}, info, {
        num: 2,
        desc: relicSet.desc[0],
        properties: toPropertyInfoList(relicSet.properties[0], starRailData, 'RELIC_SET_' + relicSet.id)
      });
      relicSetInfoList.splice(index, 0, relicSet2);
    } else if (info.num > 1) {
      const relicSet = starRailData.relic_sets[info.id];
      info.desc = relicSet.desc[0];
      info.properties = toPropertyInfoList(relicSet.properties[0], starRailData, 'RELIC_SET_' + relicSet.id);
    }
  });
  relicSetInfoList = relicSetInfoList.filter(item => item.desc !== '');
  return relicSetInfoList;
}

function toPropertyInfoList(
  promotionPropertyList: PromotionProperty[],
  starRailData: StarRailData,
  from: string
): PropertyInfo[] {
  return promotionPropertyList.map(({ type, value }) => {
    const property = starRailData.properties[type];
    const display = formatProperty(value, property.percent);
    return Object.assign({}, property, { value, display, from });
  });
}

function forEachPut(
  totalRecord: Record<string, PropertyInfo>,
  infoList: AttributeInfo[] | PropertyInfo[],
  percentDecimalPlaces: number = 1,
  NonPercentDecimalPlaces: number = 0
): void {
  infoList.forEach(info => {
    const exitingInfo = totalRecord[info.type];
    if (exitingInfo) {
      exitingInfo.value += info.value;
      exitingInfo.display = formatProperty(
        exitingInfo.value,
        exitingInfo.percent,
        percentDecimalPlaces,
        NonPercentDecimalPlaces
      );
      exitingInfo.from += ', ' + info.from;
    } else {
      totalRecord[info.type] = Object.assign({}, info);
    }
  });
}

function totalBaseProperties(
  totalRecord: Record<string, PropertyInfo>,
  properties: DataRecord<Property>
): TotalPropertyInfo[] {
  return ['HP', 'Attack', 'Defence', 'Speed'].map(name => {
    const property = properties[name === 'HP' ? 'MaxHP' : name];
    const base = totalRecord['Base' + name];
    const addedRatio = totalRecord[name + 'AddedRatio'];
    const delta = totalRecord[name + 'Delta'];
    let value = base.value;
    let from = base.from;
    if (addedRatio) {
      value += base.value * addedRatio.value;
      from += ', ' + addedRatio.from;
    }
    if (delta) {
      value += delta.value;
      from += ', ' + delta.from;
    }
    const display = formatProperty(value, property.percent);
    return Object.assign({}, property, {
      value,
      display,
      from,
      base,
      addedRatio,
      delta
    });
  });
}

function totalAdvancedProperies(
  totalRecord: Record<string, PropertyInfo>,
  properties: DataRecord<Property>
): TotalPropertyInfo[] {
  const totalProperties: TotalPropertyInfo[] = [];
  [
    'CriticalChance',
    'CriticalDamage',
    'BreakDamageAddedRatio',
    'HealRatio',
    'SPRatio',
    'StatusProbability',
    'StatusResistance'
  ].forEach(name => {
    const base = totalRecord[name + 'Base'];
    if (base) {
      const property = properties[name];
      totalProperties.push(Object.assign({}, property, {
        percent: base.percent,
        value: base.value,
        display: formatProperty(base.value, base.percent),
        from: base.from,
        base
      }));
    }
  });
  return totalProperties;
}

function totalElementProperties(
  totalRecord: Record<string, PropertyInfo>,
  properties: DataRecord<Property>,
  elements: string[]
): TotalPropertyInfo[] {
  const totalProperties: TotalPropertyInfo[] = [];
  elements.forEach(element => {
    const base = totalRecord[element + 'AddedRatio'];
    if (base) {
      totalProperties.push(Object.assign({}, base, { base }));
    }
  });
  elements.forEach(element => {
    const base = totalRecord[element + 'Resistance'];
    if (base) {
      totalProperties.push(Object.assign({}, properties[element + 'ResistanceDelta'], {
        value: base.value,
        display: base.display,
        from: base.from,
        base
      }));
    }
  });
  return totalProperties;
}
