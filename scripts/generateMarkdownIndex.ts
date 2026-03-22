// scripts/generateMarkdownIndex.ts
// 用于构建时自动生成 data/markdownIndex.ts
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const dataDir = join(__dirname, '../data');
const output = join(dataDir, 'markdownIndex.ts');

const files = readdirSync(dataDir).filter(f => extname(f) === '.md');

const entries = files.map(filename => {
  const content = readFileSync(join(dataDir, filename), 'utf-8');
  return { filename, content };
});

const out = `// 自动生成：请勿手动编辑\n// 运行 scripts/generateMarkdownIndex.ts 生成\n\nexport interface MarkdownEntry {\n  filename: string;\n  content: string;\n}\n\nexport const markdownEntries: MarkdownEntry[] = ${JSON.stringify(entries, null, 2)};\n`;

writeFileSync(output, out);
console.log('已生成 data/markdownIndex.ts');
