'use client'

import { Button } from '@/components/ui/button'
import { Data, Route } from '@/lib/data'

interface Props {
  data: Data
  onSelect?: (route?: Route) => void
  selected?: string
}

export default function RouteList({ data, onSelect, selected }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {data.routes.map((route) => (
        <div key={route.name} className="items-center flex justify-center">
          <Button
            variant={selected == route.name ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => {
              if (selected == route.name) onSelect?.(undefined)
              else onSelect?.(route)
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
