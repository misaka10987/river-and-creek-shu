// scripts/generateMarkdownIndex.ts
// 用于构建时自动生成 data/markdownIndex.ts
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const dataDir = join(__dirname, '../data');
const output = join(dataDir, 'markdownIndex.json');

const files = readdirSync(dataDir).filter(f => extname(f) === '.md');

const entries = files.map(filename => {
  const content = readFileSync(join(dataDir, filename), 'utf-8');
  return { filename, content };
});


writeFileSync(output, JSON.stringify(entries, null, 2));
console.log('已生成 data/markdownIndex.json');
