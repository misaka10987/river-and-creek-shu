import path from 'path'
import matter from 'gray-matter'
import toml from 'toml'
import { cp, readdir, readFile, writeFile } from 'fs/promises'

const packageAttractionJson = async () => {
  const dataDir = path.join(__dirname, '../data')
  const output = path.join(__dirname, '../public/attractions.json')

  const files = (await readdir(dataDir)).filter(
    (f) => path.extname(f) === '.md',
  )

  const entries = files.map(async (filename) => {
    const content = await readFile(path.join(dataDir, filename), 'utf-8')
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

  await writeFile(output, JSON.stringify(attractions))
  console.log(`Wrote packaged attractions to ${output}`)
}

const packageRouteJson = async () => {
  const dataDir = path.join(__dirname, '../data/routes')
  const output = path.join(__dirname, '../public/routes.json')

  const files = (await readdir(dataDir)).filter(
    (f) => path.extname(f) === '.md',
  )

  const entries = files.map(async (filename) => {
    const content = await readFile(path.join(dataDir, filename), 'utf-8')
    const parsed = matter(content, {
      engines: { toml: toml.parse.bind(toml) },
      language: 'toml',
      delimiters: '+++',
    })
    const { name, points } = parsed.data as {
      name: string
      points: string[]
    }
    return {
      name,
      points,
      content: parsed.content.trim(),
      file: filename,
    }
  })

  const routes = await Promise.all(entries)

  await writeFile(output, JSON.stringify(routes))
  console.log(`Wrote packaged routes to ${output}`)
}

const copyImages = async () => {
  const imageDir = path.join(__dirname, '../data/image')
  const outputDir = path.join(__dirname, '../public/image')

  await cp(imageDir, outputDir, { recursive: true })

  console.log(`Copied images from ${imageDir} to ${outputDir}`)
}

await packageAttractionJson()
await packageRouteJson()
await copyImages()
