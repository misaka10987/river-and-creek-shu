import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function parseFrontmatter(md: string) {
  const match = md.match(/^\+\+\+([\s\S]*?)\+\+\+([\s\S]*)$/);
  if (!match) throw new Error('Invalid markdown format');
  const front = match[1];
  const content = match[2].trim();
  const name = /name\s*=\s*"([^"]+)"/.exec(front)?.[1] || '';
  const coordMatch = /coordinate\s*=\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/.exec(front);
  const coordinate = coordMatch ? [parseFloat(coordMatch[2]), parseFloat(coordMatch[1])] : [0, 0];
  return { name, coordinate, content };
}

export async function GET() {
  const dataDir = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));
  const attractions = files.map(file => {
    const md = fs.readFileSync(path.join(dataDir, file), "utf-8");
    return { ...parseFrontmatter(md), file };
  });
  return NextResponse.json(attractions);
}
