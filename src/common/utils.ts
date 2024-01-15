import { HTMLFormMethod } from '@remix-run/router';
import { FetcherWithComponents } from 'react-router-dom';

/** 路由错误映射 */
export const errorMap: Record<string, string> = {
  '400': 'Bad Request',
  '404': 'Not Found',
  '405': 'Method Not Allowed'
}

interface FetcherFormOption {
  method: HTMLFormMethod;
  action: string;
  type: string;
  value: string | Blob;
}

/** 在组件的事件回调中使用，将表单数据提交到路由 action -> loader -> 更新状态 -> 组件重新渲染 */
export function submitForm<TData>(fetcher: FetcherWithComponents<TData>, data: FetcherFormOption): void {
  const formData = new FormData();
  formData.append('action_type', data.type);
  formData.append('action_value', data.value);
  fetcher.submit(formData, { method: data.method, action: data.action });
}

interface FetcherFormData {
  type: string;
  value: string | Blob;
}

/** 在路由 action 中使用，获取表单的数据 */
export function getFetcherFormData(request: Request): Promise<FetcherFormData> {
  return request.formData().then(formData => ({
    type: formData.get('action_type') as string,
    value: formData.get('action_value') as string | Blob
  }));
}

/** github api 内容 base64 加密的中文解码 */
export function decodeBase64(encodedString: string): string {
  const str = atob(encodedString);
  let c: number, char2: number, char3: number;
  let out = '';
  const len = str.length;
  let i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    // console.log(c, c >> 4)
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

/** 打开侧边栏 */
export function openSidebar() {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

/** 关闭侧边栏 */
export function closeSidebar() {
  if (typeof document !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

/** 切换开关侧边栏 */
export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}
