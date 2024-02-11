import { modifyStarRailInfo } from '../data/local';
import { RecommendRelicFields, RelicFields } from '../data/parseRelicScore';

class State {
  /** 图片源的localStorage主键 */
  #keyOfResUrl: string;
  /** 游戏数据的版本时间戳的localStorage主键 */
  #keyOfTimestamp: string;
  /** 用户数据的用户ID的localStorage主键 */
  #keyOfUid: string;
  /** 用户自定义角色属性推荐的主键 */
  #keyOfFieldsRecord: string;
  /** 当前使用的图片源 */
  #resUrl: string;
  /** 当前使用的游戏数据 */
  #starRailData: StarRailData | null;
  /** 当前使用的用户数据 */
  #starRailInfo: StarRailInfo | null;
  /** 所有属性键 */
  #elements: string[] | null;
  /** 所有命途键 */
  #paths: string[] | null;

  /** 请求游戏数据的版本时间戳 */
  requestTimestamp: number | null;
  /** 请求用户数据的用户ID */
  requestUid: string | null;
  /** 请求用户数据时的错误信息 */
  errorOfFetchInfo: Error | null;
  /** 请求游戏数据时的错误信息 */
  errorOfFetchData: Error | null;
  /** 请求游戏数据时的提示消息，比如提示已经是最新版本 */
  messageOfFetchData: string | null;
  /** 筛选角色属性命途 */
  selectedElementPath: string[];

  constructor() {
    this.#keyOfResUrl = 'res_url';
    this.#keyOfTimestamp = 'star_rail_data_timestamp';
    this.#keyOfUid = 'star_rail_info_uid';
    this.#keyOfFieldsRecord = 'fields_record';
    this.#resUrl = (this.localResUrl ?? this.resUrlArr[0]) + 'Mar-7th/StarRailRes/master/';
    this.#starRailData = null;
    this.#starRailInfo = null;
    this.#elements = null;
    this.#paths = null;
    this.requestTimestamp = this.localTimeStamp;
    this.requestUid = this.localUid;
    this.errorOfFetchInfo = null;
    this.errorOfFetchData = null;
    this.messageOfFetchData = null;
    this.selectedElementPath = [];
  }

  /** 可选的图片源 */
  readonly resUrlArr: string[] = ['https://raw.gitmirror.com/', 'https://raw.githubusercontent.com/'];
  /** 游戏数据的api */
  readonly dataUrl: string = 'https://api.github.com/repos/Mar-7th/StarRailRes/contents/';
  /** 用户数据的api */
  readonly apiUrl: string = 'https://api.mihomo.me/';

  /** 当前使用的图片源 */
  get resUrl(): string {
    return this.#resUrl;
  }

  /** 游戏数据是否未初始化 */
  get starRailDataIsNull(): boolean {
    return this.#starRailData == null;
  }

  /** 玩家数据是否未初始化 */
  get playerDataIsNull(): boolean {
    return this.#starRailInfo == null || this.#starRailInfo.detailInfo == undefined;
  }

  /** 当前使用的游戏数据，初始化前访问会抛出错误，在路由的loader中初始化 */
  get starRailData(): StarRailData {
    if (this.#starRailData != null) {
      return this.#starRailData;
    }
    throw new Error('starRailData is undefined');
  }

  /** 当前使用的用户数据 */
  get starRailInfo(): StarRailInfo | null {
    return this.#starRailInfo;
  }

  /** 当前使用的玩家数据，初始化前访问会抛出错误，在路由的loader中初始化 */
  get playerData(): PlayerData {
    if (this.#starRailInfo != null && this.#starRailInfo.detailInfo != undefined) {
      return this.#starRailInfo.detailInfo!;
    }
    throw new Error('playerData is undefined');
  }

  /** 所有战斗属性 */
  get elements(): string[] {
    if (this.#elements !== null) return this.#elements;
    this.#elements = Object.keys(this.starRailData.elements).filter(key => key !== 'Lightning');
    return this.#elements;
  }

  /** 所有命途 */
  get paths(): string[] {
    if (this.#paths !== null) return this.#paths;
    this.#paths = Object.keys(this.starRailData.paths).filter(key => key !== 'Unknown');
    return this.#paths;
  }

  /** 设置请求用户数据时的错误信息 */
  setErrorStarRailInfo(error: Error) {
    this.errorOfFetchInfo = error;
    this.#starRailInfo = { detail: error.message };// Failed to fetch
  }

  /** localStorage保存的图片源 */
  get localResUrl(): string | null {
    return localStorage.getItem(this.#keyOfResUrl);
  }

  /** 保存图片源在localStorage */
  setLocalResUrl(url: string) {
    localStorage.setItem(this.#keyOfResUrl, url);
    this.#resUrl = url + 'Mar-7th/StarRailRes/master/';
  }

  /** localStorage保存的游戏数据的版本时间戳 */
  get localTimeStamp(): number | null {
    const value = localStorage.getItem(this.#keyOfTimestamp);
    return value ? parseInt(value) : null;
  }

  /** 保存游戏数据的版本时间戳在localStorage */
  setLocalTimestamp(timestamp: number | string, starRailData: StarRailData) {
    localStorage.setItem(this.#keyOfTimestamp, timestamp.toString());
    this.#starRailData = starRailData;
  }

  /** 删除localStorage保存的游戏数据的版本时间戳 */
  clearLocalTimeStamp() {
    localStorage.removeItem(this.#keyOfTimestamp);
  }

  /** localStorage保存的用户数据的用户ID */
  get localUid(): string | null {
    return localStorage.getItem(this.#keyOfUid);
  }

  /** 保存用户数据的用户ID在localStorage */
  setLocalUid(uid: string, starRailInfo: StarRailInfo) {
    localStorage.setItem(this.#keyOfUid, uid);
    this.#starRailInfo = starRailInfo;
  }

  /** 删除localStorage保存的用户数据的用户ID */
  clearLocalUid() {
    localStorage.removeItem(this.#keyOfUid);
    this.#starRailInfo = null;
  }

  /** 用户自定义角色属性推荐 */
  get localFieldsRecord(): Record<string, RecommendRelicFields> | null {
    const fields = localStorage.getItem(this.#keyOfFieldsRecord);
    return fields ? JSON.parse(fields) : null;
  }

  /** 保存用户自定义角色属性推荐在localStorage */
  setLocalFieldsRecord(characterId: string, fields: RecommendRelicFields) {
    let record = this.localFieldsRecord;
    if (record == null) record = {};
    const noZeroFields: RecommendRelicFields = {};
    Object.keys(fields).forEach(key => {
      const weight = fields[key as RelicFields];
      if (weight !== 0) {
        noZeroFields[key as RelicFields] = weight;
      }
    })
    record[characterId] = noZeroFields;
    localStorage.setItem(this.#keyOfFieldsRecord, JSON.stringify(record));
  }

  /** 删除localStorage保存的用户自定义角色属性推荐 */
  deleteLocalFields(characterId: string) {
    const record = this.localFieldsRecord;
    if (record) {
      delete record[characterId];
      localStorage.setItem(this.#keyOfFieldsRecord, JSON.stringify(record));
    }
  }

  /** 删除角色 */
  deleteCharacter(index: number) {
    this.#starRailInfo!.detailInfo!.avatarDetailList! =
      this.#starRailInfo!.detailInfo!.avatarDetailList!.filter((_, i) => i !== index);
    modifyStarRailInfo(this.#starRailInfo!);
  }

  /** 下降角色排序 */
  downCharacter(index: number) {
    const characters = this.#starRailInfo!.detailInfo!.avatarDetailList!;
    const temp = characters[index];
    characters[index] = characters[index + 1];
    characters[index + 1] = temp;
    this.#starRailInfo!.detailInfo!.avatarDetailList! = characters.slice();
    modifyStarRailInfo(this.#starRailInfo!);
  }

  /** 上升角色排序 */
  upCharacter(index: number) {
    const characters = this.#starRailInfo!.detailInfo!.avatarDetailList!;
    const temp = characters[index];
    characters[index] = characters[index - 1];
    characters[index - 1] = temp;
    this.#starRailInfo!.detailInfo!.avatarDetailList! = characters.slice();
    modifyStarRailInfo(this.#starRailInfo!);
  }
}

export const STATE = new State();
