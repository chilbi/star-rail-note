// https://api.hakush.in/hsr/new.json
interface StarRailTest {
  character: number[];
  lightcone: number[];
  relicset: number[];
  version: string;
  previous: string[];//之前的版本
}

interface StarRailTestRank {
  Id: number;
  Name: string;
  Desc: string;//<unbreak>#1[i]%</unbreak>
  ParamList: number[];
}

interface StarRailTestSkillLevel {
  Level: number;
  ParamList: number[];
}

interface StarRailTestSkill {
  Name: string;
  Desc: string;//<color=#f29e38ff><unbreak>#1[i]%</unbreak></color>
  Type: string | null;//Normal, BPSkill, Ultra, null/*天赋*/, MazeNormal, Maze
  Tag: string;//SingleAttack, Blast, AoEAttack, Enhance, MazeAttack, Bounce
  SPBase: number | null;
  ShowStanceList: number[];
  SkillComboValueDelta: null;
  Level: Record<string/*技能等级*/, StarRailTestSkillLevel>;
}

interface StarRailTestMaterial {
  $type: string;
  ItemID: number;
  ItemNum: number;
}

interface StarRailTestStatusAdd {
  $type: string;
  PropertyType: string;//AttackAddedRatio
  Value: number;
}

interface StarRailTestSkillTree {
  Anchor: string;
  AvatarPromotionLimit: number | null;
  AvatarLevelLimit: number | null;
  DefaultUnlock: boolean;
  Icon: string;
  LevelUpSkillID: number[];
  MaterialList: StarRailTestMaterial[];
  MaxLevel: number;
  ParamList: number[];
  PointID: number;
  PointName: string;
  PointDesc: string | null;
  PointType: number;
  PrePoint: number[];
  StatusAddList: StarRailTestStatusAdd[];
}

interface StarRailTestCharacterStats {
  AttackBase: number;
  AttackAdd: number;
  DefenceBase: number;
  DefenceAdd: number;
  HPBase: number;
  HPAdd: number;
  SpeedBase: number;
  CriticalChance: number;
  CriticalDamage: number;
  BaseAggro: number;
  Cost: StarRailTestMaterial[];
}

// https://api.hakush.in/hsr/data/cn/character/1308.json
interface StarRailTestCharacter {
  Id: number;
  Name: string;
  Desc: string;
  Rarity: string;//CombatPowerAvatarRarityType5, CombatPowerAvatarRarityType4
  AvatarVOTag: string;
  SPNeed: number;
  BaseType: string;
  DamageType: string;
  Ranks: Record<string/*星魂等级*/, StarRailTestRank>;
  Skills: Record<string, StarRailTestSkill>;
  SkillTrees: Record<string/*Point01*/, Record<string/*行迹等级*/, StarRailTestSkillTree>>
  Stats: Record<string/*promotionLevel*/, StarRailTestCharacterStats>;
}

interface StarRailTestRefinementsLevel {
  ParamList: number[];
}

interface StarRailTestRefinements {
  Name: string;
  Desc: string;//<color=#f29e38ff><unbreak>#1[i]%</unbreak></color>
  Level: Record<string/*叠影等级*/, StarRailTestRefinementsLevel>;
}

interface StarRailTestLightConeStats {
  EquipmentID: number;
  Promotion?: number;
  PromotionCostList: StarRailTestMaterial[];
  PlayerLevelRequire: number;
  MaxLevel: number;
  BaseHP: number;
  BaseHPAdd: number;
  BaseAttack: number;
  BaseAttackAdd: number;
  BaseDefence: number;
  BaseDefenceAdd: number;
}

// https://api.hakush.in/hsr/data/cn/lightcone/23024.json
interface StarRailTestLightCone {
  Id: number;
  Name: string;
  Desc: string;
  Rarity: string;//CombatPowerLightconeRarity5
  BaseType: string;
  Refinements: StarRailTestRefinements;
  Stats: StarRailTestLightConeStats[];
}

interface StarRailTestRelicPart {
  Name: string;
  Desc: string;
  Story: string;
}

interface StarRailTestRelicSetEffect {
  Desc: string;//<unbreak>#1[i]%</unbreak>
  ParamList: number[];
}

//https://api.hakush.in/hsr/data/cn/relicset/313.json
interface StarRailTestRelicSet {
  Id: number;
  Name: string;
  Icon: string;
  Parts: Record<string, StarRailTestRelicPart>;
  RequireNum: Record<string/*件数*/, StarRailTestRelicSetEffect>;
}
