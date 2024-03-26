import { formatParam, formatSkill } from './local';

function replaceDesc(desc: string): string {
  return desc.replace(/<[^>]+>/g, '').replace(/\\n/g, '\n');
}

const skillTypeTextMap: Record<SkillType, string> = {
  'Normal': '普攻',
  'BPSkill': '战技',
  'Ultra': '终结技',
  'Talent': '天赋',
  'MazeNormal': 'dev_连携',
  'Maze': '秘技'
};


const skillEffectTextMap: Record<string, string> = {
  'SingleAttack': '单攻',
  'Blast': '扩散',
  'Bounce': '弹射',
  'AoEAttack': '群攻',
  'Enhance': '强化',
  'Support': '辅助',
  'Impair': '妨害',
  'Defence': '防御',
  'Restore': '回复',
  'MazeAttack': ''
};

const relicPartTypeMap: Record<string, RelicTypes> = {
  '1': 'HEAD',
  '2': 'HAND',
  '3': 'BODY',
  '4': 'FOOT',
  '5': 'NECK',
  '6': 'OBJECT'
};

export function parseTest(
  starRailTest: StarRailTest,
  starRailTestData: [
    StarRailTestCharacter[],
    StarRailTestLightCone[],
    StarRailTestRelicSet[]
  ],
  starRailData: StarRailData
): StarRailData {
  starRailTestData[0].forEach(item => parseCharacter(item, starRailData));
  starRailTestData[1].forEach(item => parseLightCone(item, starRailData));
  starRailTestData[2].forEach(item => parseRelicSet(item, starRailData));
  starRailData.test_version = starRailTest.version;
  return starRailData;
}

function parseCharacter(
  testCharacter: StarRailTestCharacter,
  starRailData: StarRailData
) {
  const characterId = testCharacter.Id.toString();
  let character = starRailData.characters[characterId];
  if (character != undefined && character.isTest == undefined) {
    return;
  }

  if (character == undefined) {
    character = {
      guide_overview: [],
      guide_material: []
    } as unknown as Character;
  }

  const rarity = parseInt(testCharacter.Rarity.slice(-1));

  const ranks: string[] = [];
  Object.entries(testCharacter.Ranks).forEach(([rank, testRank]) => {
    const rankId = testRank.Id.toString();
    ranks.push(rankId);
    let characterRank = starRailData.character_ranks[rankId];
    if (characterRank == undefined) {
      characterRank = {
        materials: [],
        level_up_skills: [],
        icon: 'icon/path/None.png'
      } as unknown as CharacterRank;
    }
    const descChunks = formatSkill({
      desc: replaceDesc(testRank.Desc),
      params: [testRank.ParamList]
    }, 1);
    let desc = '';
    descChunks.forEach(descChunk => {
      desc += descChunk.param === null ?
        descChunk.text : descChunk.param === '\n' ?
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          '\n' : formatParam(descChunk.param as any);
    });
    starRailData.character_ranks[rankId] = Object.assign(characterRank, {
      id: rankId,
      name: testRank.Name,
      rank: parseInt(rank),
      desc: desc
    });
  });

  const skills: string[] = [];
  Object.entries(testCharacter.Skills).forEach(([skillId, testSkill]) => {
    skills.push(skillId);
    let characterSkill = starRailData.character_skills[skillId];
    if (characterSkill == undefined) {
      characterSkill = {
        element: '',
        simple_desc: '',
        icon: 'icon/path/None.png'
      } as CharacterSkill;
    }
    const params: DescParam[] = [];
    Object.values(testSkill.Level).forEach(testSkillLevel => {
      params.push(testSkillLevel.ParamList);
    });
    const type = testSkill.Type == null ? 'Talent' : testSkill.Type as unknown as SkillType;
    const effect = testSkill.Tag;
    starRailData.character_skills[skillId] = Object.assign(characterSkill, {
      id: skillId,
      name: testSkill.Name,
      max_level: params.length,
      type: type,
      type_text: skillTypeTextMap[type],
      effect: effect,
      effect_text: skillEffectTextMap[effect],
      desc: replaceDesc(testSkill.Desc),
      params: params,
    });
  });

  const skill_trees: string[] = [];
  Object.values(testCharacter.SkillTrees).forEach(testSkillTreeRecord => {
    const testSkillTree = testSkillTreeRecord['1'];
    const skillTreeId = testSkillTree.PointID.toString()
    skill_trees.push(skillTreeId);
    let characterSkillTree = starRailData.character_skill_trees[skillTreeId];
    if (characterSkillTree == undefined) {
      characterSkillTree = {
        icon: 'icon/path/None.png'
      } as CharacterSkillTree;
    }
    const params: DescParam[] = [];
    const levels: SkillPromotion[] = [];
    Object.values(testSkillTreeRecord).forEach(testSkillTreeItem => {
      params.push(testSkillTree.ParamList);
      levels.push({
        promotion: testSkillTreeItem.AvatarPromotionLimit ?? 0,
        level: testSkillTreeItem.AvatarLevelLimit ?? 0,
        properties: testSkillTreeItem.StatusAddList
          .map<PromotionProperty>(item => ({ type: item.PropertyType, value: item.Value })),
        materials: testSkillTreeItem.MaterialList
          .map<MaterialConsume>(item => ({ id: item.ItemID?.toString() ?? '0', num: item.ItemNum })),
        icon: 'icon/path/None.png'
      });
    });
    starRailData.character_skill_trees[skillTreeId] = Object.assign(characterSkillTree, {
      id: skillTreeId,
      name: testSkillTree.PointName,
      max_level: testSkillTree.MaxLevel,
      desc: testSkillTree.PointDesc == null ? '' : replaceDesc(testSkillTree.PointDesc),
      params: params,
      anchor: testSkillTree.Anchor,
      pre_potint: testSkillTree.PrePoint,
      level_up_skills: testSkillTree.LevelUpSkillID
        .map<LevelUpSkill>(upId => ({ id: upId.toString(), num: 1 })),
      levels: levels
    });
  });

  let characterPromotion = starRailData.character_promotions[characterId];
  if (characterPromotion == undefined) {
    characterPromotion = {} as CharacterPromotion;
  }
  const promotionValues: CharacterPromotionValue[] = [];
  const promotionMaterials: PromotionMaterials[] = [];
  Object.values(testCharacter.Stats).forEach(testStat => {
    promotionValues.push({
      hp: { base: testStat.HPBase, step: testStat.HPAdd },
      atk: { base: testStat.AttackBase, step: testStat.AttackAdd },
      def: { base: testStat.DefenceBase, step: testStat.DefenceAdd },
      spd: { base: testStat.SpeedBase, step: 0 },
      taunt: { base: testStat.BaseAggro, step: 0 },
      crit_rate: { base: testStat.CriticalChance, step: 0 },
      crit_dmg: { base: testStat.CriticalDamage, step: 0 }
    });
    promotionMaterials.push(testStat.Cost.map(item => ({
      id: item.ItemID?.toString() ?? '0',
      num: item.ItemNum
    })));
  });
  starRailData.character_promotions[characterId] = Object.assign(characterPromotion, {
    id: characterId,
    values: promotionValues,
    materials: promotionMaterials
  });

  starRailData.characters[characterId] = Object.assign(character, {
    id: characterId,
    name: testCharacter.Name,
    tag: testCharacter.AvatarVOTag,
    rarity: Number.isNaN(rarity) ? 5 : rarity,
    path: testCharacter.BaseType,
    element: testCharacter.DamageType,
    max_sp: testCharacter.SPNeed,
    ranks: ranks,
    skills: skills,
    skill_trees: skill_trees,
    icon: `UI/avataricon/${characterId}.webp`,
    preview: `UI/avatarshopicon/${characterId}.webp`,
    portrait: `UI/avatardrawcard/${characterId}.webp`,
    isTest: true
  });
}

function parseLightCone(
  testLightCone: StarRailTestLightCone,
  starRailData: StarRailData
) {
  const lightConeId = testLightCone.Id.toString();
  let lightCone = starRailData.light_cones[lightConeId];
  if (lightCone != undefined && lightCone.isTest == undefined) {
    return;
  }
  if (lightCone == undefined) {
    lightCone = {
      guide_overview: []
    } as unknown as LightCone;
  }

  const rarity = parseInt(testLightCone.Rarity.slice(-1));

  let lightConeRank = starRailData.light_cone_ranks[lightConeId];
  if (lightConeRank == undefined) {
    lightConeRank = {} as LightConeRank;
  }
  const params: DescParam[] = [];
  const properties: PromotionProperty[][] = [];
  Object.values(testLightCone.Refinements.Level).forEach(testRefinementsLevel => {
    params.push(testRefinementsLevel.ParamList);
    properties.push([]);//找不到属性字段
  });
  starRailData.light_cone_ranks[lightConeId] = Object.assign(lightConeRank, {
    id: lightConeId,
    skill: testLightCone.Refinements.Name,
    desc: replaceDesc(testLightCone.Refinements.Desc),
    params: params,
    properties: properties
  });

  let lightConePromotion = starRailData.light_cone_promotions[lightConeId];
  if (lightConePromotion == undefined) {
    lightConePromotion = {} as LightConePromotion;
  }
  const promotionValues: LightConePromotionValue[] = [];
  const promotionMaterials: PromotionMaterials[] = [];
  testLightCone.Stats.forEach(testStat => {
    promotionValues.push({
      hp: { base: testStat.BaseHP, step: testStat.BaseHPAdd },
      atk: { base: testStat.BaseAttack, step: testStat.BaseAttackAdd },
      def: { base: testStat.BaseDefence, step: testStat.BaseDefenceAdd }
    });
    console.log(testStat.PromotionCostList)
    promotionMaterials.push(testStat.PromotionCostList.map(item => ({
      id: item.ItemID?.toString() ?? '0',
      num: item.ItemNum
    })));
  });
  starRailData.light_cone_promotions[lightConeId] = Object.assign(lightConePromotion, {
    id: lightConeId,
    values: promotionValues,
    materials: promotionMaterials
  });

  starRailData.light_cones[lightConeId] = Object.assign(lightCone, {
    id: lightConeId,
    name: testLightCone.Name,
    rarity: Number.isNaN(rarity) ? 5 : rarity,
    path: testLightCone.BaseType,
    desc: replaceDesc(testLightCone.Desc),
    icon: `UI/lightconemediumicon/${lightConeId}.webp`,
    preview: `UI/lightconemediumicon/${lightConeId}.webp`,
    portrait: `UI/lightconemaxfigures/${lightConeId}.webp`,
    isTest: true
  });
}

function parseRelicSet(
  testRelicSet: StarRailTestRelicSet,
  starRailData: StarRailData
) {
  const relicSetId = testRelicSet.Id.toString();
  let relicSet = starRailData.relic_sets[relicSetId];
  if (relicSet != undefined && relicSet.isTest == undefined) {
    return;
  }

  if (relicSet == undefined) {
    relicSet = {
      guide_overview: []
    } as unknown as RelicSet;
  }

  let icon = '';
  const iconIdExecArr = /\d+/.exec(testRelicSet.Icon);
  if (iconIdExecArr != null) {
    icon = `UI/itemfigures/${iconIdExecArr[0]}.webp`;
  }

  const effectDesc: string[] = [];
  Object.values(testRelicSet.RequireNum).forEach(testEffect => {
    const descChunks = formatSkill({
      desc: replaceDesc(testEffect.Desc),
      params: [testEffect.ParamList]
    }, 1);
    let desc = '';
    descChunks.forEach(descChunk => {
      desc += descChunk.param === null ?
        descChunk.text : descChunk.param === '\n' ?
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          '\n' : formatParam(descChunk.param as any);
    });
    effectDesc.push(desc);
  });

  Object.entries(testRelicSet.Parts).forEach(([partId, relicPart]) => {
    const partNum = partId.slice(-1);
    const relicId = `6${relicSetId}${partNum}`;
    let relic = starRailData.relics[relicId];
    if (relic == undefined || relic.isTest) {
      if (relic == undefined) {
        relic = {} as Relic;
      }
      starRailData.relics[relicId] = Object.assign(relic, {
        id: relicId,
        set_id: relicSetId,
        name: relicPart.Name,
        rarity: 5,
        type: relicPartTypeMap[partNum],
        max_level: 15,
        main_affix_id: '5' + partNum,
        sub_affix_id: '5',
        icon: `UI/relicfigures/IconRelic_${relicSetId}_${partNum}.webp`,
        isTest: true
      });
    }
  });

  starRailData.relic_sets[relicSetId] = Object.assign(relicSet, {
    id: relicSetId,
    name: testRelicSet.Name,
    desc: effectDesc,
    properties: [],//找不到属性字段
    icon: icon,
    isTest: true
  });
}
