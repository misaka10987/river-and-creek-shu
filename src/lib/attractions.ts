
// 景点数据类型
export interface Attraction {
  name: string;
  coordinate: [number, number];
  content: string;
  file: string;
}

// 直接加载结构化 JSON 数据
import attractions from '../../data/attractions.json';

export function getAttractions(): Attraction[] {
  return attractions as Attraction[];
}
