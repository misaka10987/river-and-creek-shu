'use client'

import { useRef, useState, useEffect } from 'react'
import { Attraction, Route } from '@/lib/attractions'
import { T } from 'tianditu-v4-types'
import { Button } from './ui/button'

interface Props {
  route: Route | null
  onSelect: (file: string | null) => void
}

export default function ShanghaiMap({ onSelect, route }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  // T.Map 类型无法直接引入，使用 unknown
  const [map, setMap] = useState<T.Map | null>(null)
  const [points, setPoints] = useState<
    { file: string; x: number; y: number; name: string }[]
  >([])
  const [dragging, setDragging] = useState(false)

  const withinRoute = ({ name }: { name: string }) => {
    if (route == null) return true
    return route.points.find((routeName) => routeName == name) != undefined
  }

  // 加载景点数据
  useEffect(() => {
    fetch('/attractions.json')
      .then((res) => res.json())
      .then((data) => {
        setAttractions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // 初始化地图和标签点
  useEffect(() => {
    if (loading || attractions.length === 0) return
    const initMap = () => {
      const TMap = (
        window as unknown as { T: typeof import('tianditu-v4-types').T }
      ).T
      if (!TMap || !mapRef.current) return
      const map = new TMap.Map(mapRef.current)
      map.centerAndZoom(new TMap.LngLat(121.467167, 31.23545), 14)
      map.disableInertia()
      map.enableDrag()
      setMap(map)
    }
    // 只插入一次 script
    if (!document.getElementById('tianditu-script')) {
      const script = document.createElement('script')
      script.id = 'tianditu-script'
      script.src =
        'https://api.tianditu.gov.cn/api?v=4.0&tk=5ce2be52008d79908225720ac9c5ae45'
      script.type = 'text/javascript'
      script.onload = initMap
      document.body.appendChild(script)
    } else {
      initMap()
    }
  }, [loading, attractions])

  useEffect(() => {
    if (!map) return
    if (!route) return
    if (route.points.length == 0) return

    const point = route.points[0]
    const attr = attractions.find((a) => a.name == point)

    if (!attr) return

    const [lat, lng] = attr.coordinate
    const TMap = (
      window as unknown as { T: typeof import('tianditu-v4-types').T }
    ).T
    map.panTo(new TMap.LngLat(lng, lat))
  }, [route])

  // 直接管理 marker 实例数组
  const markerRefs = useRef<T.Marker[]>([])

  useEffect(() => {
    if (!map) return
    const TMap = (
      window as unknown as { T: typeof import('tianditu-v4-types').T }
    ).T

    // 清除旧 marker
    map.clearOverLays()
    markerRefs.current = []

    // 生成并添加 marker
    const markers = attractions.filter(withinRoute).map((attr) => {
      const [lat, lng] = attr.coordinate
      const lnglat = new TMap.LngLat(lng, lat)
      const marker = new TMap.Marker(lnglat, {
        icon: new TMap.Icon({
          iconUrl: 'https://api.tianditu.gov.cn/img/map/marker.png',
          iconSize: new TMap.Point(24, 24),
        }),
      })
      marker.data = { file: attr.file, name: attr.name }
      map.addOverLay(marker)
      return marker
    })
    markerRefs.current = markers
  }, [map, attractions, route])

  // 仅拦截滚轮缩放，手动缩放地图
  useEffect(() => {
    if (!map || !mapRef.current) return
    const el = mapRef.current
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) {
        map.zoomIn()
      } else if (e.deltaY > 0) {
        map.zoomOut()
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [map])

  // 监听地图移动/缩放，更新标签像素坐标
  useEffect(() => {
    if (!map) return
    const TMap = (
      window as unknown as { T: typeof import('tianditu-v4-types').T }
    ).T

    const updatePoints = () => {
      const arr = attractions.map((attr) => {
        const [lat, lng] = attr.coordinate
        const lnglat = new TMap.LngLat(lng, lat)
        const pt = map.lngLatToContainerPoint(lnglat)

        return { file: attr.file, x: pt.x, y: pt.y, name: attr.name }
      })
      setPoints(arr)
    }

    updatePoints()

    // 拖拽/缩放事件处理
    const handleMoveStart = () => setDragging(true)
    const handleMoveEnd = () => setDragging(false)

    map.on('movestart', handleMoveStart)
    map.on('zoomstart', handleMoveStart)
    map.on('moveend', handleMoveEnd)
    map.on('zoomend', handleMoveEnd)
    map.on('moveend', updatePoints)
    map.on('zoomend', updatePoints)
    return () => {
      map.off('movestart', handleMoveStart)
      map.off('zoomstart', handleMoveStart)
      map.off('moveend', handleMoveEnd)
      map.off('zoomend', handleMoveEnd)
      map.off('moveend', updatePoints)
      map.off('zoomend', updatePoints)
    }
  }, [map, attractions, onSelect])

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="relative overflow-hidden max-w-full max-h-full w-full aspect-square rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-center"
        id="shanghai-map"
      >
        {/* 拖拽/缩放时隐藏 DOM 标签，显示原生 marker */}
        {!dragging &&
          points.length > 0 &&
          map != null &&
          map.getZoom() >= 12 && (
            <>
              {points.filter(withinRoute).map((pt) => (
                <Button
                  key={pt.file}
                  className="absolute z-1000 -translate-x-1/2 -translate-y-full active:-translate-y-full px-2 py-1 rounded text-xs shadow transition-opacity duration-500 opacity-0 animate-fadein"
                  style={{
                    left: pt.x,
                    top: pt.y,
                    pointerEvents: 'auto',
                    animation: 'fadein 0.5s forwards',
                  }}
                  size={'xs'}
                  onClick={() => onSelect(pt.file)}
                >
                  {pt.name}
                </Button>
              ))}
              <style>{`
              @keyframes fadein {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
            </>
          )}
      </div>
    </div>
  )
}
