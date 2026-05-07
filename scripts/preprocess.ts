import path from 'path'
import matter from 'gray-matter'
import toml from 'toml'
import { cp, readdir, readFile, writeFile } from 'fs/promises'
import { Data, RouteMeta, AttractionMeta, Attraction, Route } from '@/lib/data'

const packageData = async () => {
  const dataDir = path.join(__dirname, '../data')
  const output = path.join(__dirname, '../public/data.json')

  const files = (await readdir(dataDir)).filter((f) => path.extname(f) == '.md')

  let attractions: Attraction[] = []
  let routes: Route[] = []

  for (const file of files) {
    const content = await readFile(path.join(dataDir, file), 'utf-8')
    const parsed = matter(content, {
      engines: { toml: toml.parse.bind(toml) },
      language: 'toml',
      delimiters: '+++',
    })

    const frontmatter = parsed.data as AttractionMeta | { route: RouteMeta }

    if ('route' in frontmatter) {
      routes.push({ ...frontmatter.route, content: parsed.content.trim() })
    } else {
      attractions.push({ ...frontmatter, content: parsed.content.trim() })
    }
  }

  const data: Data = { attractions, routes }

  await writeFile(output, JSON.stringify(data))
  console.log(`Wrote packaged data to ${output}`)
}

const copyImages = async () => {
  const imageDir = path.join(__dirname, '../data/image')
  const outputDir = path.join(__dirname, '../public/image')

  await cp(imageDir, outputDir, { recursive: true })

  console.log(`Copied images from ${imageDir} to ${outputDir}`)
}

await packageData()
await copyImages()
