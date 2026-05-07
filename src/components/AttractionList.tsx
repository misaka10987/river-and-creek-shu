'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Data } from '@/lib/data'

interface Props {
  onSelect: (file: string) => void
  selected: string | null
}

export default function AttractionList({ onSelect, selected }: Props) {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then(setData)
  }, [])

  return (
    <details>
      <div className="grid grid-cols-2 justify-center gap-2 bg-white/80 p-2 backdrop-blur-sm">
        {data?.attractions.map((attr) => (
          <div key={attr.name} className="items-center flex justify-center">
            <Button
              variant={selected === attr.name ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onSelect(attr.name)}
              className="w-32 truncate"
            >
              {attr.name}
            </Button>
          </div>
        ))}
      </div>
    </details>
  )
}
