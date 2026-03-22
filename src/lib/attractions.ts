
// 景点数据类型
export interface Attraction {
  name: string;
  coordinate: [number, number];
  content: string;
  file: string;
}


// 从 public/attractions.json 动态获取景点数据
export async function fetchAttractions(): Promise<Attraction[]> {
  const res = await fetch('/attractions.json');
  if (!res.ok) throw new Error('无法加载景点数据');
  return res.json();
}
