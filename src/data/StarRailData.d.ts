/** 成就 */
interface Achievement {
  id: string;
  series_id: string;
  title: string;
  desc: string;
  hide_desc: string;
  hide: boolean;
}

/** 头像 */
interface Avatars {
  id: string;
  name: string;
  icon: string;
  rarity?: number;
}

interface PromotionBaseStep {
  base: number;
  step: number;
}

interface CharacterPromotionValue {
  hp: PromotionBaseStep;
  atk: PromotionBaseStep;
  def: PromotionBaseStep;
  spd: PromotionBaseStep;
  taunt: PromotionBaseStep;
  crit_rate: PromotionBaseStep;
  crit_dmg: PromotionBaseStep;
}

interface MaterialConsume {
  id: string;
  num: number;
}

type PromotionMaterials = MaterialConsume[];

/** 角色晋阶 */
interface CharacterPromotion {
  id: string;
  values: CharacterPromotionValue[];
  materials: PromotionMaterials[];
}

interface LevelUpSkill {
  id: string;
  num: number;
}

/** 星魂 */
interface CharacterRank {
  id: string;
  name: string;
  rank: number;
  desc: string;
  materials: MaterialConsume[];
  level_up_skills: LevelUpSkill[];
  icon: string;
}

type DescParam = number[];

interface PromotionProperty {
  type: string;
  value: number;
}

interface SkillPromotion {
  promotion: number;
  level: number;
  properties: PromotionProperty[];
  materials: MaterialConsume[];
  icon: string;
}

/** 行迹 */
interface CharacterSkillTree {
  id: string;
  name: string;
  max_level: number;
  desc: string;
  params: DescParam[];
  anchor: string;
  pre_potint: string[];
  level_up_skills: LevelUpSkill[];
  levels: SkillPromotion[];
  icon: string;
}

/** 技能类型 */
type SkillType = 'Normal' | 'BPSkill' | 'Ultra' | 'Talent' | 'Maze' | 'MazeNormal';

/** 技能 */
interface CharacterSkill {
  id: string;
  name: string;
  max_level: number;
  element: string;
  type: SkillType;
  type_text: string;
  effect: string;
  effect_text: string;
  simple_desc: string;
  desc: string;
  params: DescParam[];
  icon: string;
}

/** 角色 */
interface Character {
  id: string;
  name: string;
  tag: string;
  rarity: number;
  path: string;
  element: string;
  max_sp: number;
  ranks: string[];
  skills: string[];
  skill_trees: string[];
  icon: string;
  preview: string;
  portrait: string;
  guide_overview: string[];
  guide_material: string[];
  isTest?: boolean;
}

/** 描述 */
interface Description {
  id: string;
  title: string;
  desc: string;
}

/** 属性 */
interface ElementAttack {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
}

/** 道具 */
interface Item {
  id: string;
  name: string;
  type: string;
  sub_type: string;
  rarity: number;
  icon: string;
  come_from: string[];
}

interface Avatar {
  id: string;
  name: string;
  icon: string;
}

interface LightConePromotionValue {
  hp: PromotionBaseStep;
  atk: PromotionBaseStep;
  def: PromotionBaseStep;
}

/** 光锥晋阶 */
interface LightConePromotion {
  id: string;
  values: LightConePromotionValue[];
  materials: PromotionMaterials[];
}

/** 光锥叠影 */
interface LightConeRank {
  id: string;
  skill: string;
  desc: string;
  params: DescParam[];
  properties: PromotionProperty[][];
}

/** 光锥 */
interface LightCone {
  id: string;
  name: string;
  rarity: number;
  path: string;
  desc: string;
  icon: string;
  preview: string;
  portrait: string;
  guide_overview: string[];
  isTest?: boolean;
}

/** 别名 */
interface Nickname {
  characters: Record<string, string[]>;
  light_cones: Record<string, string[]>;
  relic_sets: Record<string, string[]>;
}

/** 命途 */
interface Path {
  id: string;
  text: string;
  name: string;
  desc: string;
  icon: string;
}

type AffixTypes =
  'HPDelta' |
  'HPAddedRatio' |
  'AttackDelta' |
  'AttackAddedRatio' |
  'DefenceDelta' |
  'DefenceAddedRatio' |
  'SpeedDelta' |

  'CriticalChanceBase' |
  'CriticalDamageBase' |
  'BreakDamageAddedRatioBase' |
  'HealRatioBase' |
  'SPRatioBase' |
  'StatusProbabilityBase' |
  'StatusResistanceBase' |

  'PhysicalAddedRatio' |
  'FireAddedRatio' |
  'IceAddedRatio' |
  'ThunderAddedRatio' |
  'WindAddedRatio' |
  'QuantumAddedRatio' |
  'ImaginaryAddedRatio';

/** 属性 */
interface Property {
  type: AffixTypes | string;
  name: string;
  field: string;
  affix: boolean;
  ratio: boolean;
  percent: boolean;
  order: number;
  icon: string;
}

// value = base + step * info.level;
interface MainAffix {
  affix_id: string;
  property: AffixTypes;
  base: number;
  step: number;
}

/** 遗器主词条 */
interface RelicMainAffix {
  id: string;// 第1个数表示星数，第2个数表示部位
  affixes: Record<string, MainAffix>;
}

// value = base * info.cnt + step * info.step;
// info.cnt 取值范围为 [1, 6]，且4条副词条的cnt合计最大为9
// info.step 取值范围为 [info.cnt * 0, info.cnt * 2]
interface SubAffix {
  affix_id: string;
  property: AffixTypes;
  base: number;
  step: number;
  step_num: number;
}

/** 遗器副词条 */
interface RelicSubAffix {
  id: string;// 代表星数
  affixes: Record<string, SubAffix>;
}

/** 遗器套装效果 */
interface RelicSet {
  id: string;
  name: string;
  desc: string[];
  properties: PromotionProperty[][];
  icon: string;
  guide_overview: string;
  isTest?: boolean;
}

type RelicTypes = 'HEAD' | 'HAND' | 'BODY' | 'FOOT' | 'NECK' | 'OBJECT';

/** 遗器 */
interface Relic {
  id: string;
  set_id: string;
  name: string;
  rarity: number;
  type: RelicTypes;
  max_level: number;
  main_affix_id: string;
  sub_affix_id: string;
  icon: string;
  isTest?: boolean;
}

/** 模拟宇宙祝福 */
interface SimulatedBlessing {
  id: string;
  name: string;
  desc: string;
  enhanced_desc: string;
}

/** 模拟宇宙区域 */
interface SimulatedBlock {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
}

/** 模拟宇宙奇物 */
interface SimulatedCurio {
  id: string;
  name: string;
  desc: string;
  bg_desc: string;
  icon: string;
}

/** 模拟宇宙事件 */
interface SimulatedEvent {
  id: string;
  name: string;
  type: string;
  image: string;
}

type DataRecord<T> = Record<string, T>;

/** 游戏数据的版本信息 */
interface StarRailDataInfo {
  version: string;
  folder: string;
  timestamp: number;// 乘以1000
}

interface StarRailData {
  test_version?: string;
  version: string;
  timestamp: number;
  characters: DataRecord<Character>;
  character_ranks: DataRecord<CharacterRank>;
  character_promotions: DataRecord<CharacterPromotion>;
  character_skills: DataRecord<CharacterSkill>;
  character_skill_trees: DataRecord<CharacterSkillTree>;
  light_cones: DataRecord<LightCone>;
  light_cone_ranks: DataRecord<LightConeRank>;
  light_cone_promotions: DataRecord<LightConePromotion>;
  properties: DataRecord<Property>;
  paths: DataRecord<Path | undefined>;
  elements: DataRecord<ElementAttack>;
  items: DataRecord<Item>;
  avatars: DataRecord<Avatar>;
  relics: DataRecord<Relic>;
  relic_sets: DataRecord<RelicSet>;
  relic_main_affixes: DataRecord<RelicMainAffix>;
  relic_sub_affixes: DataRecord<RelicSubAffix>;
}
