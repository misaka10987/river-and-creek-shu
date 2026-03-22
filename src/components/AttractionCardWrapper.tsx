import { useEffect, useState } from 'react'
import AttractionCard from '@/components/AttractionCard'
import type { Attraction } from '@/lib/attractions'

/**
 * 包裹器：根据 selected 查找景点数据
 * 避免每次渲染重复请求，提升性能
 */
export default function AttractionCardWrapper({
  selected,
  onClose,
}: {
  selected: string | null
  onClose: () => void
}) {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  useEffect(() => {
    fetch('/attractions.json')
      .then((res) => res.json())
      .then(setAttractions)
  }, [])
  const attraction = attractions.find((a) => a.file === selected)
  if (!selected || !attraction) return null
  return <AttractionCard attraction={attraction} onClose={onClose} />
}
