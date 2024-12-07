interface LevelInfo {
  id: string;
  level: number;
}

interface AvatarInfo {
  id: string;
  name: string;
  icon: string;
}

interface PathInfo {
  id: string;
  name: string;
  icon: string;
}

interface ElementInfo {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface SkillInfo {
  id: string;
  name: string;
  level: number;
  max_level: number;
  element?: ElementInfo;
  type: string;
  type_text: string;
  effect: string;
  effect_text: string;
  simple_desc: string;
  desc: string;
  icon: string;
  rankLevelUp?: number;
}

interface SkillTreeInfo {
  id: string;
  level: number;
  anchor: string;
  max_level: number;
  icon: string;
  parent?: string;
}

interface AttributeInfo extends Property {
  from: string;
  type: string;
  field: string;
  name: string;
  icon: string;
  value: number;
  display: string;
  percent: boolean;
}

interface PropertyInfo extends AttributeInfo {}

interface SubAffixInfo extends PropertyInfo {
  count: number;
  step: number;
}

interface RelicInfo {
  id: string;
  name: string;
  type: RelicTypes;
  set_id: string;
  set_name: string;
  rarity: number;
  level: number;
  icon: string;
  main_affix: PropertyInfo;
  sub_affix: SubAffixInfo[];
}

interface RelicSetInfo {
  id: string;
  name: string;
  icon: string;
  num: number;
  desc: string;
  properties: PropertyInfo[];
}

interface LightConeInfo {
  id: string;
  name: string;
  rarity: number;
  rank: number;
  level: number;
  promotion: number;
  desc: string;
  icon: string;
  preview: string;
  portrait: string;
  path: PathInfo | undefined;
  attributes: AttributeInfo[];
  properties: PropertyInfo[];
}

interface MemoryInfo {
  level: number;
  chaos_id: number;
  chaos_level: number;
}

interface SpaceInfo {
  memory_data?: MemoryInfo;
  universe_level: number;
  light_cone_count: number;
  avatar_count: number;
  achievement_count: number;
}

interface PlayerInfo {
  uid: string;
  nickname: string;
  level: number;
  world_level: number;
  friend_count: number;
  avatar?: AvatarInfo;
  signature: string;
  is_display: boolean;
  space_info?: SpaceInfo;
}

interface TotalPropertyInfo extends PropertyInfo {
  base: PropertyInfo;
  addedRatio?: PropertyInfo;
  delta?: PropertyInfo;
}

interface RecommendAffix {
  type: AffixTypes;
  weight: number;
}

interface RelicScore {
  myMainScore: number;
  mySubScore: number;
  bestMainScore: number;
  bestSubScore: number;
  isBestMain: boolean;
  isHeadOrHand: boolean;
  myMainScoreDisplay: string;
  mySubScoreDisplay: string;
  bestMainScoreDisplay: string;
  bestSubScoreDisplay: string;
  mainScoreDisplay: string;
  subScoreDisplay: string;
  scoreDisplay: string;
}

interface RecommendPropertiesGroup {
  weight: number;
  properties: Property[];
}

interface TotalRelicScore {
  myMainScore: number;
  mySubScore: number;
  mySetScore: number;
  bestMainScore: number;
  bestSubScore: number;
  bestSetScore: number;
  // recommendAffixesText: string;
  recommendPropertiesGroups: RecommendPropertiesGroup[];
  myMainScoreDisplay: string;
  mySubScoreDisplay: string;
  mySetScoreDisplay: string;
  bestMainScoreDisplay: string;
  bestSubScoreDisplay: string;
  bestSetScoreDisplay: string;
  mainScoreDisplay: string;
  subScoreDisplay: string;
  setScoreDisplay: string;
  scoreDisplay: string;
}

interface CharacterInfo {
  id: string;
  name: string;
  rarity: number;
  rank: number;
  level: number;
  promotion: number;
  icon: string;
  preview: string;
  portrait: string;
  rank_icons: string[];
  path: PathInfo | undefined;
  element: ElementInfo;
  skills: SkillInfo[];
  skill_trees: SkillTreeInfo[];
  light_cone?: LightConeInfo;
  relics: RelicInfo[];
  relic_sets: RelicSetInfo[];
  attributes: AttributeInfo[];
  additions: AttributeInfo[];
  properties: PropertyInfo[];
  relicsProperties: PropertyInfo[];
  totalProperties: TotalPropertyInfo[];
  totalRecord: Record<string, PropertyInfo>;

  recommendAffixes: RecommendAffix[];
  relicScoreRecord: Record<RelicTypes, RelicScore>;
  totalRelicScore: TotalRelicScore;
}

/** https://api.mihomo.me/sr_info_parsed/{uid}?lang=cn&version=v2 */
interface StarRailInfoParsed {
  player: PlayerInfo;
  characters: CharacterInfo[];
}
