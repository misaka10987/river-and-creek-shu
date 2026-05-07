'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Data, Route } from '@/lib/data'

interface Props {
  onSelect: (route: Route | null) => void
  selected: Route | null
}

export default function RouteList({ onSelect, selected }: Props) {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then(setData)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {data?.routes.map((route) => (
        <div key={route.name} className="items-center flex justify-center">
          <Button
            variant={selected?.name === route.name ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => {
              if (selected?.name == route.name) onSelect(null)
              else onSelect(route)
            }}
            className="w-full truncate"
          >
            {route.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
