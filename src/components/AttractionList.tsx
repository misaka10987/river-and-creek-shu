'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Attraction } from '@/lib/attractions'

interface Props {
  onSelect: (file: string) => void
  selected: string | null
}

export default function AttractionList({ onSelect, selected }: Props) {
  const [attractions, setAttractions] = useState<Attraction[]>([])

  useEffect(() => {
    fetch('/attractions.json')
      .then((res) => res.json())
      .then((data) => setAttractions(data))
  }, [])

  return (
    <div className="grid grid-cols-2 justify-center gap-2 bg-white/80 rounded-lg p-2 shadow border border-zinc-200 backdrop-blur-sm">
      {attractions.map((attr) => (
        <div key={attr.file} className='items-center flex justify-center'>
          <Button
            variant={selected === attr.file ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onSelect(attr.file)}
            className="w-32 truncate"
          >
            {attr.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
