// 扩展天地图类型声明，补充常用事件和属性
import type { T } from 'tianditu-v4-types';

declare module 'tianditu-v4-types' {
  interface Marker {
    /** 任意自定义数据 */
    data?: unknown;
    /** 支持事件绑定 */
    on(event: string, handler: (...args: unknown[]) => void): void;
    off(event: string, handler: (...args: unknown[]) => void): void;
  }
  interface Map {
    on(event: string, handler: (...args: unknown[]) => void): void;
    off(event: string, handler: (...args: unknown[]) => void): void;
    addOverLay(marker: Marker): void;
    removeOverLay(marker: Marker): void;
    lngLatToContainerPoint(lnglat: T.LngLat): T.Point;
  }
  interface Point {
    x: number;
    y: number;
  }
}
