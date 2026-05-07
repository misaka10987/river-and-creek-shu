'use client'

import { Button } from '@/components/ui/button'
import { Attraction, Data } from '@/lib/data'

interface Props {
  data: Data
  onSelect?: (attraction: Attraction) => void
  selected?: string
}

export default function AttractionList({ data, onSelect, selected }: Props) {
  return (
    <details>
      <div className="grid grid-cols-2 justify-center gap-2 bg-white/80 p-2 backdrop-blur-sm">
        {data.attractions.map((attraction) => (
          <div
            key={attraction.name}
            className="items-center flex justify-center"
          >
            <Button
              variant={selected === attraction.name ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onSelect?.(attraction)}
              className="w-32 truncate"
            >
              {attraction.name}
            </Button>
          </div>
        ))}
      </div>
    </details>
  )
}
