
'use client'

import React, { useRef, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Attraction } from '@/lib/attractions'

/**
 * 天地图 API 加载器
 * 仅在客户端渲染时加载
 */


interface Props {
  selected: string | null;
  setSelected: (file: string | null) => void;
}

export default function ShanghaiMap({ selected, setSelected }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [mapObj, setMapObj] = useState<any>(null) // T.Map 类型无法直接引入
  const [points, setPoints] = useState<{file: string, x: number, y: number, name: string}[]>([])

  // 加载景点数据
  useEffect(() => {
    fetch('/attractions.json')
      .then(res => res.json())
      .then(data => {
        setAttractions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // 初始化地图和标签点
  useEffect(() => {
    if (loading || attractions.length === 0) return;
    const initMap = () => {
      if (!(window as any).T || !mapRef.current) return;
      // @ts-ignore
      const map = new (window as any).T.Map(mapRef.current, {
        projection: 'EPSG:4326',
      });
      // @ts-ignore
      map.centerAndZoom(new (window as any).T.LngLat(121.4737, 31.2304), 12);
      setMapObj(map);
    };
    // 只插入一次 script
    if (!document.getElementById('tianditu-script')) {
      const script = document.createElement('script');
      script.id = 'tianditu-script';
      script.src = 'https://api.tianditu.gov.cn/api?v=4.0&tk=5ce2be52008d79908225720ac9c5ae45';
      script.type = 'text/javascript';
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, attractions]);

  // 监听地图移动/缩放，更新标签像素坐标
  useEffect(() => {
    if (!mapObj || attractions.length === 0) return;
    const updatePoints = () => {
      const T = (window as any).T;
      const arr = attractions.map((attr) => {
        // coordinate: [lat, lng]，但 T.LngLat 需 [lng, lat]
        const [lat, lng] = attr.coordinate;
        const lnglat = new T.LngLat(lng, lat);
        const pt = mapObj.lngLatToContainerPoint(lnglat);
        return { file: attr.file, x: pt.x, y: pt.y, name: attr.name };
      });
      setPoints(arr);
    };
    updatePoints();
    mapObj.on('moveend', updatePoints);
    mapObj.on('zoomend', updatePoints);
    return () => {
      mapObj.off('moveend', updatePoints);
      mapObj.off('zoomend', updatePoints);
    };
  }, [mapObj, attractions]);


  // 当前选中的景点
  const selectedAttr = attractions.find((a) => a.file === selected)

  // console.log(selectedAttr)

  return (
    <div className="relative w-full h-100">
      <div
        ref={mapRef}
          className="w-full h-100 rounded-lg border border-zinc-200 shadow"
        id="shanghai-map"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* 地图标签点 DOM 渲染 */}
        {mapObj && points.map(pt => (
          <button
            key={pt.file}
              className={`absolute z-1000 -translate-x-1/2 -translate-y-full px-2 py-1 rounded bg-primary text-primary-foreground text-xs shadow border border-primary ${selected === pt.file ? 'ring-2 ring-primary' : ''}`}
            style={{ left: pt.x, top: pt.y, pointerEvents: 'auto' }}
            onClick={() => setSelected(pt.file)}
          >
            {pt.name}
          </button>
        ))}
      </div>
      {/* 景点标签列表已移除，地图外可单独渲染 */}
      {/* 景点卡片（右上角） */}
      {selectedAttr && (
        <div
          className="fixed sm:absolute inset-0 sm:inset-auto sm:right-4 sm:top-4 z-1000 bg-white sm:rounded-lg shadow-lg p-4 sm:max-w-xs w-full sm:w-80 border border-zinc-200 flex flex-col max-h-full sm:max-h-60"
          style={{ maxHeight: '90vh' }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg truncate">{selectedAttr.name}</div>
            <button
              onClick={() => setSelected(null)}
              className="text-zinc-400 hover:text-zinc-800 text-2xl leading-none sm:text-base"
              aria-label="关闭"
            >
              ×
            </button>
          </div>
          <div className="prose prose-sm flex-1 overflow-y-auto text-xs">
            {/* Markdown 渲染 */}
            <ReactMarkdown>{selectedAttr.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
