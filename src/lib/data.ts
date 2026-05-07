export interface Attraction {
  name: string
  coordinate: [number, number]
}

export interface Route {
  name: string
  points: string[]
}

export interface MarkdownContent {
  content: string
}

export interface Data {
  attractions: (Attraction & MarkdownContent)[]
  routes: (Route & MarkdownContent)[]
}
