import { ActionFunctionArgs } from 'react-router-dom';

import {
  deleteStarRailDataInfo,
  deleteStarRailInfo,
  updateStarRailData,
  updateStarRailInfo
} from '../data/local';
import { fetchStarRailDataInfo } from '../data/remote';
import { STATE } from '../common/state';
import { getFetcherFormData } from '../common/utils';

export async function rootLayoutAction({ request }: ActionFunctionArgs): Promise<boolean> {
  const { type, value } = await getFetcherFormData(request);
  switch (type) {
    case 'login': {
      STATE.requestUid = value as string;
      return true;
    }
    case 'logout': {
      STATE.requestUid = null;
      STATE.clearLocalUid();
      return true;
    }
    case 'star_rail_info/delete': {
      await deleteStarRailInfo(value as string);
      return true;
    }
    case 'star_rail_info/update': {
      try {
        await updateStarRailInfo(value as string);
      } catch (e) {
        STATE.errorOfFetchInfo = e as Error;
        return false;
      }
      return true;
    }
    case 'star_rail_data/change': {
      STATE.requestTimestamp = parseInt(value as string);
      return true;
    }
    case 'star_rail_data/delete': {
      await deleteStarRailDataInfo(parseInt(value as string));
      return true;
    }
    case 'star_rail_data/update': {
      try {
        const latestStarRailDataInfo = await fetchStarRailDataInfo();
        if (latestStarRailDataInfo.timestamp !== parseInt(value as string)) {
          const starRailData = await updateStarRailData(latestStarRailDataInfo);
          if (starRailData) {
            STATE.requestTimestamp = starRailData.timestamp;
            STATE.setLocalTimestamp(starRailData.timestamp, starRailData);
            return true;
          } else {
            STATE.errorOfFetchData = new Error('Failed to updateStarRailData');
            return false;
          }
        } else {
          // 手动修改时间戳模拟更新数据
          // const starRailData = await updateStarRailData(Object.assign(latestStarRailDataInfo, {
          //   timestamp: latestStarRailDataInfo.timestamp - (Math.floor(Math.random() * 100) * 1000000)
          // }));
          // if (starRailData) {
          //   STATE.requestTimestamp = starRailData.timestamp;
          //   STATE.setLocalTimestamp(starRailData.timestamp, starRailData);
          // } else {
          //   throw new Error('Failed to updateStarRailData');
          // }
          STATE.messageOfFetchData = '已经是最新版本的数据了';
          return true;
        }
      } catch (e) {
        STATE.errorOfFetchData = e as Error;
        return false;
      }
    }
    case 'Selected_element_path/toggle': {
      if (STATE.selectedElementPath.indexOf(value as string) < 0) {
        STATE.selectedElementPath.push(value as string);
      } else {
        STATE.selectedElementPath = STATE.selectedElementPath.filter(key => key !== value as string);
      }
      return true;
    }
    default: {
      throw new Error('Not Found type: ' + type);
    }
  }
}
