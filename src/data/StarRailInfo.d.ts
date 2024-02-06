/** 忘却之庭进度 */
interface SpaceChallengeData {
  noneScheduleMaxLevel: number;
  scheduleGroupId: number;
  scheduleMaxLevel: number;
}

/** 数据信息 */
interface SpaceData {
  challengeInfo?: SpaceChallengeData;
  /** 通过模拟宇宙数量 */
  maxRogueChallengeScore?: number;
  /** 获得光锥数量 */
  equipmentCount: number;
  /** 获得角色数量 */
  avatarCount: number;
  /** 获得成就数量 */
  achievementCount: number;
}

/** 光锥信息 */
interface EquipmentData {
  /** 光锥 id */
  tid?: number;
  /** 光锥叠影数 */
  rank: number;
  /** 光锥等级 */
  level: number;
  /** 光锥晋阶等级 */
  promotion?: number;
}

/** 行迹信息 */
interface SkillTreeData {
  /** 行迹 id */
  pointId: number;
  /** 行迹等级 */
  level: number;
}

/** 遗器副词条信息 */
interface SubAffixData {
  /** 副词条 id */
  affixId: number;
  /** 遗器副词条基础值数量 */
  cnt: number;
  /** 遗器副词条步进值数量 */
  step?: number;
}

/** 遗器信息 */
interface RelicData {
  /** 遗器 id */
  tid: number;// 第1个数减1表示星数，第2-4个数表示套装，第5个数表示部位
  /** 遗器类型 1Head,2Hand,3Body,4Foot,5Neck,6Object */
  type: number;
  /** 遗器等级 */
  level?: number;
  /** 遗器经验 */
  exp?: number;
  /** 遗器主词条 id */
  mainAffixId: number;
  /** 遗器副词条 */
  subAffixList: SubAffixData[];
}

/** 角色信息 */
interface CharacterDetailData {
  /** 角色 id */
  avatarId: number;
  /** 角色星魂数 */
  rank?: number;
  /** 角色等级 */
  level: number;
  /** 角色晋阶等级 */
  promotion?: number;
  /** 光锥信息 */
  equipment?: EquipmentData;
  /** 行迹信息 */
  skillTreeList: SkillTreeData[];
  /** 遗器信息 */
  relicList?: RelicData[];
  exp?: number;
  pos?: number;
}

/** 玩家详细信息 */
interface PlayerData {
  /** 玩家 id */
  uid: number;
  /** 玩家昵称 */
  nickname: string;
  /** 玩家等级 */
  level: number;
  /** 均衡等级 */
  worldLevel?: number;
  /** 好友数量 */
  friendCount?: number;
  /** 头像 id */
  headIcon: number;
  /** 签名 */
  signature?: string;
  /** 游戏平台 PC | ANDROID | IOS */
  platform?: string;
  /** 是否公开显示角色信息 */
  isDisplayAvatar: boolean;
  /** 数据信息 */
  recordInfo?: SpaceData;
  /** 支援角色信息 */
  assistAvatarDetail?: CharacterDetailData;
  /** 展示角色信息 */
  avatarDetailList?: CharacterDetailData[];
  /** 2.0 支援角色信息 */
  assistAvatarList?: CharacterDetailData[];
}

/** https://api.mihomo.me/sr_info/{uid}?lang=cn&version=v2 */
interface StarRailInfo {
  /** 玩家详细信息 */
  detailInfo?: PlayerData;
  /** 查询错误信息 */
  detail?: string; // 'Not Found' | 'Invalid uid';
}
