import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import matter from 'gray-matter';
import toml from 'toml';

const dataDir = join(__dirname, '../data');
const output = join(__dirname, '../public/attractions.json');

const files = readdirSync(dataDir).filter(f => extname(f) === '.md');

const entries = files.map(filename => {
  const content = readFileSync(join(dataDir, filename), 'utf-8');
  const parsed = matter(content, {
    engines: { toml: toml.parse.bind(toml) },
    language: 'toml',
    delimiters: '+++',
  });
  const { name, coordinate } = parsed.data as { name: string; coordinate: [number, number] };
  return {
    name,
    coordinate,
    content: parsed.content.trim(),
    file: filename,
  };
});

writeFileSync(output, JSON.stringify(entries, null, 2));
console.log('已生成 data/markdownIndex.json');
