export interface AttractionMeta {
  name: string
  coordinate: [number, number]
}

export interface RouteMeta {
  name: string
  points: string[]
}

export interface MarkdownContent {
  content: string
}

export interface Attraction extends AttractionMeta, MarkdownContent {}

export interface Route extends RouteMeta, MarkdownContent {}

export interface Data {
  attractions: (AttractionMeta & MarkdownContent)[]
  routes: (RouteMeta & MarkdownContent)[]
}
