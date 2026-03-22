
'use client'


import React, { useRef, useState, useEffect } from 'react'
import type { Attraction } from '@/lib/attractions'
import type { T } from 'tianditu-v4-types';

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
  // T.Map 类型无法直接引入，使用 unknown
  const [mapObj, setMapObj] = useState<T.Map | null>(null)
  const [points, setPoints] = useState<{file: string, x: number, y: number, name: string}[]>([])
  const [dragging, setDragging] = useState(false)
  // 直接管理 marker 实例数组
  const markerRefs = useRef<T.Marker[]>([])

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
      const TMap = (window as any).T as typeof import('tianditu-v4-types').T;
      const map = new TMap.Map(mapRef.current, {
        projection: 'EPSG:4326',
      });
      map.centerAndZoom(new TMap.LngLat(121.4737, 31.2304), 12);
      if (typeof map.enableDrag === 'function') map.enableDrag();
      if (typeof map.enableScrollWheelZoom === 'function') map.enableScrollWheelZoom();
      if (typeof map.enableDoubleClickZoom === 'function') map.enableDoubleClickZoom();
      if (typeof map.enableKeyboard === 'function') map.enableKeyboard();
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
    const TMap = (window as any).T as typeof import('tianditu-v4-types').T;

    // 清除旧 marker
    markerRefs.current.forEach(m => mapObj.removeOverLay(m));
    markerRefs.current = [];
    // 生成并添加 marker
    const markers = attractions.map((attr) => {
      const [lat, lng] = attr.coordinate;
      const lnglat = new TMap.LngLat(lng, lat);
      const marker = new TMap.Marker(lnglat, {
        icon: new TMap.Icon({
          iconUrl: 'https://api.tianditu.gov.cn/img/map/marker.png',
          iconSize: new TMap.Point(24, 24),
        })
      });
      // @ts-ignore
      marker.data = { file: attr.file, name: attr.name };
      marker.on('click', () => setSelected(attr.file));
      mapObj.addOverLay(marker);
      return marker;
    });
    markerRefs.current = markers;

    const updatePoints = () => {
      const arr = attractions.map((attr) => {
        const [lat, lng] = attr.coordinate;
        const lnglat = new TMap.LngLat(lng, lat);
        const pt = mapObj.lngLatToContainerPoint(lnglat);
        return { file: attr.file, x: pt.x, y: pt.y, name: attr.name };
      });
      setPoints(arr);
    };
    updatePoints();

    // 拖拽/缩放事件处理
    const handleMoveStart = () => setDragging(true);
    const handleMoveEnd = () => {
      setDragging(false);
      updatePoints();
    };
    mapObj.on('movestart', handleMoveStart);
    mapObj.on('zoomstart', handleMoveStart);
    mapObj.on('moveend', handleMoveEnd);
    mapObj.on('zoomend', handleMoveEnd);
    mapObj.on('moveend', updatePoints);
    mapObj.on('zoomend', updatePoints);
    return () => {
      mapObj.off('movestart', handleMoveStart);
      mapObj.off('zoomstart', handleMoveStart);
      mapObj.off('moveend', handleMoveEnd);
      mapObj.off('zoomend', handleMoveEnd);
      mapObj.off('moveend', updatePoints);
      mapObj.off('zoomend', updatePoints);
    };
  }, [mapObj, attractions, setSelected]);


  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg border border-zinc-200 shadow"
        id="shanghai-map"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* 拖拽/缩放时隐藏 DOM 标签，显示原生 marker */}
        {!dragging && points.length > 0 && points.map(pt => (
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
    </div>
  )
}
