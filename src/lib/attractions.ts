
// 景点数据类型
export interface Attraction {
  name: string;
  coordinate: [number, number];
  content: string;
  file: string;
}

import { markdownEntries } from '../../data/markdownIndex';
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
  return markdownEntries.map(entry => ({
    ...parseFrontmatter(entry.content),
    file: entry.filename,
  }));
}
