import { LoaderFunctionArgs } from 'react-router-dom';

import {
  getStarRailData,
  getStarRailDataInfoItems,
  getStarRailInfo,
  getUidItems
} from '../data/local';
import { errorMap } from '../common/utils';
import { STATE } from '../common/state';

export interface RootLayoutData {
  uidItems: string[];
  starRailDataInfoItems: StarRailDataInfo[];
}

export async function rootLayoutLoader(): Promise<RootLayoutData> {
  // await new Promise(resolve => setTimeout(() => resolve(true), 3000));
  let starRailData: StarRailData | undefined;
  try {
    starRailData = await getStarRailData(STATE.requestTimestamp);
  } catch {
    throw new Error(errorMap['404'] + ' starRailData');
  }
  if (starRailData == undefined) {
    throw new Error(errorMap['404'] + ' starRailData');
  }
  const starRailDataInfoItems = await getStarRailDataInfoItems();
  let starRailInfo: StarRailInfo | undefined;
  try {
    starRailInfo = STATE.requestUid ? await getStarRailInfo(STATE.requestUid) : undefined;
  } catch (e) {
    STATE.setErrorStarRailInfo(e as Error);
  }
  const uidItems = await getUidItems();

  if (starRailInfo != undefined && starRailInfo.detailInfo != undefined) {
    const uid = starRailInfo.detailInfo.uid.toString();
    STATE.setLocalUid(uid, starRailInfo);
    const input = document.getElementById('login_uid_input') as HTMLInputElement | null;
    if (input) input.value = uid;
  }
  STATE.requestTimestamp = starRailData.timestamp;
  STATE.setLocalTimestamp(starRailData.timestamp, starRailData);
  return { uidItems, starRailDataInfoItems };
}

export interface CharacterDetailData {
  character: Character;
}

export async function characterDetailLoader({ params }: LoaderFunctionArgs): Promise<CharacterDetailData> {
  const id = params.id;
  if (!id) throw new Error('Invalid id of character');
  if (STATE.starRailDataIsNull) {
    await rootLayoutLoader();
  }
  const character = STATE.starRailData.characters[id];
  if (!character) throw new Error('Invalid id of character');
  return { character };
}

export interface LightConeDetailData {
  lightCone: LightCone;
}

export async function lightConeDetailLoader({ params }: LoaderFunctionArgs): Promise<LightConeDetailData> {
  const id = params.id;
  if (!id) throw new Error('Invalid id of lightCone');
  if (STATE.starRailDataIsNull) {
    await rootLayoutLoader();
  }
  const lightCone = STATE.starRailData.light_cones[id];
  if (!lightCone) throw new Error('Invalid id of lightCone');
  return { lightCone };
}
