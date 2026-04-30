import { join, extname } from 'path'
import matter from 'gray-matter'
import toml from 'toml'
import { readdir, readFile, writeFile } from 'fs/promises'

const packageMarkdownJson = async () => {
  const dataDir = join(__dirname, '../data')
  const output = join(__dirname, '../public/attractions.json')

  const files = (await readdir(dataDir)).filter((f) => extname(f) === '.md')

  const entries = files.map(async (filename) => {
    const content = await readFile(join(dataDir, filename), 'utf-8')
    const parsed = matter(content, {
      engines: { toml: toml.parse.bind(toml) },
      language: 'toml',
      delimiters: '+++',
    })
    const { name, coordinate } = parsed.data as {
      name: string
      coordinate: [number, number]
    }
    return {
      name,
      coordinate,
      content: parsed.content.trim(),
      file: filename,
    }
  })

  const attractions = await Promise.all(entries)

  await writeFile(output, JSON.stringify(attractions, null, 2))
  console.log(`Wrote packaged markdown to ${output}`)
}

await packageMarkdownJson()
