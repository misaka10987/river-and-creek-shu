'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Route } from '@/lib/attractions'

interface Props {
  onSelect: (route: Route) => void
  selected: Route | null
}

export default function RouteList({ onSelect, selected }: Props) {
  const [routes, setRoutes] = useState<Route[]>([])

  useEffect(() => {
    fetch('/routes.json')
      .then((res) => res.json())
      .then(setRoutes)
  }, [])

  return (
    <div>
      {routes.map((route) => (
        <div key={route.file} className="items-center flex justify-center">
          <Button
            variant={selected?.name === route.name ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onSelect(route)}
            className="w-full truncate"
          >
            {route.name}
          </Button>
        </div>
      ))}
    </div>
  )
}
