// 景点数据类型
export interface Attraction {
  name: string
  coordinate: [number, number]
  content: string
  file: string
}

export interface Route {
  name: string
  points: string[]
  content: string
  file: string
}
