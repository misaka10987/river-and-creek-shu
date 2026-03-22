
// 景点数据类型
export interface Attraction {
  name: string;
  coordinate: [number, number];
  content: string;
  file: string;
}

// 动态加载 JSON 数据
import markdownEntriesRaw from '../../data/markdownIndex.json';
import matter from 'gray-matter';
import toml from 'toml';

function parseFrontmatter(md: string): Omit<Attraction, 'file'> {
  const parsed = matter(md, {
    engines: {
      toml: toml.parse.bind(toml)
    },
    language: 'toml',
    delimiters: '+++',
  });
  const { name, coordinate } = parsed.data as { name: string; coordinate: [number, number] };
  const content = parsed.content.trim();
  return { name, coordinate, content };
}

export function getAttractions(): Attraction[] {
  // 兼容 import 方式加载 JSON
  const markdownEntries = markdownEntriesRaw as Array<{ filename: string; content: string }>;
  return markdownEntries.map((entry: { filename: string; content: string }) => ({
    ...parseFrontmatter(entry.content),
    file: entry.filename,
  }));
}
