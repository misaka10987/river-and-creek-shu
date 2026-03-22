'use client'

import { useRef, useState, useEffect } from 'react'
import type { Attraction } from '@/lib/attractions'
import type { T } from 'tianditu-v4-types'

/**
 * 天地图 API 加载器
 * 仅在客户端渲染时加载
 */
interface Props {
  selected: string | null
  setSelected: (file: string | null) => void
}

export default function ShanghaiMap({ selected, setSelected }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  // T.Map 类型无法直接引入，使用 unknown
  const [mapObj, setMapObj] = useState<T.Map | null>(null)
  const [points, setPoints] = useState<
    { file: string; x: number; y: number; name: string }[]
  >([])
  const [dragging, setDragging] = useState(false)
  // 控制标签淡入动画的 key
  const [labelKey, setLabelKey] = useState(0)
  // 直接管理 marker 实例数组
  const markerRefs = useRef<T.Marker[]>([])

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
      const map = new TMap.Map(mapRef.current, {
        projection: 'EPSG:4326',
      })
      map.centerAndZoom(new TMap.LngLat(121.4737, 31.2304), 12)
      map.enableDrag()
      setMapObj(map)
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

  // 仅拦截滚轮缩放，手动缩放地图
  useEffect(() => {
    if (!mapObj || !mapRef.current) return
    const el = mapRef.current
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY < 0) {
        mapObj.zoomIn()
      } else if (e.deltaY > 0) {
        mapObj.zoomOut()
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [mapObj])

  // 监听地图移动/缩放，更新标签像素坐标
  useEffect(() => {
    if (!mapObj || attractions.length === 0) return
    const TMap = (
      window as unknown as { T: typeof import('tianditu-v4-types').T }
    ).T

    // 清除旧 marker
    markerRefs.current.forEach((m) => mapObj.removeOverLay(m))
    markerRefs.current = []
    // 生成并添加 marker
    const markers = attractions.map((attr) => {
      const [lat, lng] = attr.coordinate
      const lnglat = new TMap.LngLat(lng, lat)
      const marker = new TMap.Marker(lnglat, {
        icon: new TMap.Icon({
          iconUrl: 'https://api.tianditu.gov.cn/img/map/marker.png',
          iconSize: new TMap.Point(24, 24),
        }),
      })
      marker.data = { file: attr.file, name: attr.name }
      mapObj.addOverLay(marker)
      return marker
    })
    markerRefs.current = markers

    const updatePoints = () => {
      const arr = attractions.map((attr) => {
        const [lat, lng] = attr.coordinate
        const lnglat = new TMap.LngLat(lng, lat)
        const pt = mapObj.lngLatToContainerPoint(lnglat)

        return { file: attr.file, x: pt.x, y: pt.y, name: attr.name }
      })
      setPoints(arr)
    }
    updatePoints()

    // 拖拽/缩放事件处理
    const handleMoveStart = () => setDragging(true)
    const handleMoveEnd = () => {
      setDragging(false)
      updatePoints()
      // 触发标签重新渲染以实现淡入
      setLabelKey((k) => k + 1)
    }
    mapObj.on('movestart', handleMoveStart)
    mapObj.on('zoomstart', handleMoveStart)
    mapObj.on('moveend', handleMoveEnd)
    mapObj.on('zoomend', handleMoveEnd)
    mapObj.on('moveend', updatePoints)
    mapObj.on('zoomend', updatePoints)
    return () => {
      mapObj.off('movestart', handleMoveStart)
      mapObj.off('zoomstart', handleMoveStart)
      mapObj.off('moveend', handleMoveEnd)
      mapObj.off('zoomend', handleMoveEnd)
      mapObj.off('moveend', updatePoints)
      mapObj.off('zoomend', updatePoints)
    }
  }, [mapObj, attractions, setSelected])

  return (
        <div className="relative w-full h-full">
          <div
            ref={mapRef}
            className="w-full aspect-square rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-center"
            id="shanghai-map"
            style={{ maxWidth: '100%', maxHeight: '100%', position: 'relative', overflow: 'hidden' }}
          >
        {/* 拖拽/缩放时隐藏 DOM 标签，显示原生 marker */}
        {!dragging && points.length > 0 && (
          <>
            {points.map((pt) => (
              <button
                key={pt.file + '-' + labelKey}
                className={`absolute z-1000 -translate-x-1/2 -translate-y-full px-2 py-1 rounded bg-primary text-primary-foreground text-xs shadow border border-primary transition-opacity duration-500 opacity-0 animate-fadein ${selected === pt.file ? 'ring-2 ring-primary' : ''}`}
                style={{ left: pt.x, top: pt.y, pointerEvents: 'auto', animation: 'fadein 0.5s forwards' }}
                onClick={() => setSelected(pt.file)}
              >
                {pt.name}
              </button>
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
