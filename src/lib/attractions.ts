// 景点数据类型与静态加载方法
export interface Attraction {
  name: string;
  coordinate: [number, number];
  content: string;
  file: string;
}

// 静态导入所有 Markdown 文件（开发期，后续可用动态加载/服务端 API 优化）
import theBund from '../../data/the-bund.md?raw';
import lujiazui from '../../data/lujiazui.md?raw';
import suzhouCreekPark from '../../data/suzhou-creek-park.md?raw';

function parseFrontmatter(md: string): Omit<Attraction, 'file' | 'content'> & { content: string } {
  const match = md.match(/^\+\+\+([\s\S]*?)\+\+\+([\s\S]*)$/);
  if (!match) throw new Error('Invalid markdown format');
  const front = match[1];
  const content = match[2].trim();
  const name = /name\s*=\s*"([^"]+)"/.exec(front)?.[1] || '';
  const coordMatch = /coordinate\s*=\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/.exec(front);
  const coordinate: [number, number] = coordMatch ? [parseFloat(coordMatch[2]), parseFloat(coordMatch[1])] : [0, 0];
  return { name, coordinate, content };
}

export const attractions: Attraction[] = [
  { ...parseFrontmatter(theBund), file: 'the-bund.md', content: theBund },
  { ...parseFrontmatter(lujiazui), file: 'lujiazui.md', content: lujiazui },
  { ...parseFrontmatter(suzhouCreekPark), file: 'suzhou-creek-park.md', content: suzhouCreekPark },
];
