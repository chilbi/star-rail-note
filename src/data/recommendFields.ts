import { RecommendRelicFields } from './parseRelicScore';

type RecommedKeys =
  'critRate_critDmg_dmg_spd_atk_sp' |
  'critRate_critDmg_spd_dmg_atk_sp' |
  'critRate_critDmg_spd_dmg_hp_sp' |
  'critRate_critDmg_bk_spd_dmg_atk_sp' |
  'spd_bk_atk_res' |

  'critRate_critDmg_hit_spd_dmg_sp_atk_bk' |
  'critRate_critDmg_dmg_atk_spd' |

  'hit_spd_dmg_sp_atk_critRate_critDmg' |
  'hit_atk_spd_dmg_sp_bk' |
  'atk_spd_dmg_sp_bk' |

  'sp_spd_hp_atk_def_res' |
  'sp_spd_critDmg_hp_def_res' |
  'sp_spd_atk_hp_def_res' |
  'sp_spd_bk_hp_def_res' |
  'spd_bk_hp_def_res' |

  'def_spd_sp_res_hit_hp' |
  'hp_spd_sp_heal_res_def' |
  'def_spd_sp_critRate_critDmg_res' |

  'heal_spd_sp_hp_res_def' |
  'heal_spd_sp_atk_res_hp_def' |
  'heal_spd_sp_bk_res_hp_def';

type RecommendRelicFieldsRecord = Record<RecommedKeys, RecommendRelicFields>;

const recommendRelicFieldsRecord: RecommendRelicFieldsRecord = {
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
  //击破类型 素裳1206雪衣1214波提欧1315
  'critRate_critDmg_bk_spd_dmg_atk_sp': {
    'critRate': 1,
    'critDmg': 1,
    'bk': 1,
    'spd': 1,
    'dmg': 1,
    'atk': 0.75,
    'sp': 0.5
  },
  //超级破类型 流萤1310
  'spd_bk_atk_res': {
    'spd': 1,
    'bk': 1,
    'atk': 0.5,
    'res': 0.5
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
  //黄泉1308
  'critRate_critDmg_dmg_atk_spd': {
    'critRate': 1,
    'critDmg': 1,
    'dmg': 1,
    'atk': 1,
    'spd': 1
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
  'sp_spd_hp_atk_def_res': {
    'sp': 1,
    'spd': 1,
    'hp': 0.5,
    'atk': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //爆伤辅助 布洛妮娅1101花火1306
  'sp_spd_critDmg_hp_def_res': {
    'sp': 1,
    'spd': 1,
    'critDmg': 1,
    'hp': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //攻击辅助 停云1202知更鸟1309
  'sp_spd_atk_hp_def_res': {
    'sp': 1,
    'spd': 0.75,
    'atk': 0.75,
    'hp': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //击破辅助 阮梅1303
  'sp_spd_bk_hp_def_res': {
    'sp': 1,
    'spd': 0.75,
    'bk': 0.75,
    'hp': 0.5,
    'def': 0.5,
    'res': 0.5
  },
  //超击破辅助 同谐开拓者
  'spd_bk_hp_def_res': {
    'spd': 1,
    'bk': 1,
    'hp': 0.5,
    'def': 0.5,
    'res': 0.5
  },

  //生存类型
  //存护通用类型 防御命中类型 杰帕德三月七开拓者火
  'def_spd_sp_res_hit_hp': {
    'def': 1,
    'spd': 1,
    'sp': 1,
    'res': 1,
    'hit': 0.5,
    'hp': 0.5
  },
  //生命类型 符玄1208
  'hp_spd_sp_heal_res_def': {
    'hp': 1,
    'spd': 1,
    'sp': 1,
    'heal': 1,
    'res': 1,
    'def': 0.5
  },
  //砂金1304
  'def_spd_sp_critRate_critDmg_res': {
    'def': 1,
    'spd': 1,
    'sp': 1,
    'critRate': 1,
    'critDmg': 1,
    'res': 1
  },

  //丰饶通用类型 生命类型 白露娜塔莎玲可藿藿
  'heal_spd_sp_hp_res_def': {
    'heal': 1,
    'spd': 1,
    'sp': 1,
    'hp': 1,
    'res': 1,
    'def': 0.5
  },
  //攻击类型 罗刹1203
  'heal_spd_sp_atk_res_hp_def': {
    'heal': 1,
    'spd': 1,
    'sp': 1,
    'atk': 1,
    'res': 1,
    'hp': 0.5,
    'def': 0.5
  },
  //击破类型 加拉赫1301
  'heal_spd_sp_bk_res_hp_def': {
    'heal': 1,
    'spd': 1,
    'sp': 1,
    'bk': 1,
    'res': 1,
    'hp': 0.5,
    'def': 0.5
  }
};

const recommendCharacterRelicFields: Record<string, RecommedKeys | undefined> = {
  '1102': 'critRate_critDmg_spd_dmg_atk_sp',//希儿
  '1204': 'critRate_critDmg_spd_dmg_atk_sp',//景元
  '1205': 'critRate_critDmg_spd_dmg_hp_sp',//刃
  '1206': 'critRate_critDmg_bk_spd_dmg_atk_sp',//素裳
  '1214': 'critRate_critDmg_bk_spd_dmg_atk_sp',//雪衣
  '1315': 'critRate_critDmg_bk_spd_dmg_atk_sp',//波提欧
  '1310': 'spd_bk_atk_res',//流萤
  '1004': 'critRate_critDmg_hit_spd_dmg_sp_atk_bk',//瓦尔特
  '1308': 'critRate_critDmg_dmg_atk_spd',//黄泉
  '1108': 'hit_atk_spd_dmg_sp_bk',//桑博
  '1111': 'hit_atk_spd_dmg_sp_bk',//卢卡
  '1210': 'hit_atk_spd_dmg_sp_bk',//桂乃芬
  '1307': 'hit_atk_spd_dmg_sp_bk',//黑天鹅
  '1005': 'atk_spd_dmg_sp_bk',//卡芙卡
  '1101': 'sp_spd_critDmg_hp_def_res',//布洛妮娅
  '1306': 'sp_spd_critDmg_hp_def_res',//花火
  '1202': 'sp_spd_atk_hp_def_res',//停云
  '1309': 'sp_spd_atk_hp_def_res',//知更鸟
  '1303': 'sp_spd_bk_hp_def_res',//阮梅
  '8005': 'spd_bk_hp_def_res',//同谐开拓者（男）
  '8006': 'spd_bk_hp_def_res',//同谐开拓者（女）
  '1208': 'hp_spd_sp_heal_res_def',//符玄
  '1304': 'def_spd_sp_critRate_critDmg_res',//砂金
  '1203': 'heal_spd_sp_atk_res_hp_def',//罗刹
  '1301': 'heal_spd_sp_bk_res_hp_def'//加拉赫
};


export function getRecommendFields(characterId: string, pathId: string): RecommendRelicFields {
  const key = recommendCharacterRelicFields[characterId];
  if (key) {
    return recommendRelicFieldsRecord[key];
  } else {
    switch (pathId) {
      case 'Shaman':
        return recommendRelicFieldsRecord['sp_spd_hp_atk_def_res'];
      case 'Warlock':
        return recommendRelicFieldsRecord['hit_spd_dmg_sp_atk_critRate_critDmg'];
      case 'Knight':
        return recommendRelicFieldsRecord['def_spd_sp_res_hit_hp'];
      case 'Priest':
        return recommendRelicFieldsRecord['heal_spd_sp_hp_res_def'];
      default:
        return recommendRelicFieldsRecord['critRate_critDmg_dmg_spd_atk_sp'];
    }
  }
}
