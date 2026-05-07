import AttractionCard from '@/components/AttractionCard'
import { Data } from '@/lib/data'

/**
 * 包裹器：根据 selected 查找景点数据
 * 避免每次渲染重复请求，提升性能
 */
export default function AttractionCardWrapper({
  data,
  selected,
  onClose,
}: {
  data: Data
  selected: string | null
  onClose: () => void
}) {
  const attraction = data?.attractions.find((a) => a.name === selected)
  if (!selected || !attraction) return null
  return <AttractionCard attraction={attraction} onClose={onClose} />
}
