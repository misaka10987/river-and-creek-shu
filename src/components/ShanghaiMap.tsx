"use client";
import React, { useEffect, useRef, useState } from "react";

/**
 * 天地图 API 加载器
 * 仅在客户端渲染时加载
 */
function loadTianDiTuScript(callback: () => void) {
  if (typeof window === "undefined") return;
  if ((window as any).TMap) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://api.tianditu.gov.cn/api?v=4.0&tk=5ce2be52008d79908225720ac9c5ae45";
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}

export default function ShanghaiMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<null | string>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  // attractions 静态导入
  const { attractions } = require("@/lib/attractions");

  useEffect(() => {
    loadTianDiTuScript(() => {
      if (!(window as any).TMap || !mapRef.current) return;
      // @ts-ignore
      const map = new (window as any).TMap.Map(mapRef.current, {
        center: [121.4737, 31.2304], // 上海市中心经纬度
        zoom: 12,
      });
      setMapInstance(map);

      // 添加景点标签点
      attractions.forEach((attr: any) => {
        // @ts-ignore
        const marker = new (window as any).TMap.Marker({
          position: { lng: attr.coordinate[0], lat: attr.coordinate[1] },
          map,
          title: attr.name,
        });
        marker.on("click", () => setSelected(attr.file));
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedAttr = attractions.find((a: any) => a.file === selected);

  return (
    <div className="relative w-full h-100">
      <div
        ref={mapRef}
        className="w-full h-100 rounded-lg border border-zinc-200 shadow"
        id="shanghai-map"
      />
      {selectedAttr && (
        <div className="absolute right-4 top-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs w-80 border border-zinc-200">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-lg">{selectedAttr.name}</div>
            <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-zinc-800">×</button>
          </div>
          <div className="prose prose-sm max-h-60 overflow-y-auto">
            {/* TODO: Markdown 渲染，现仅展示原文 */}
            <pre className="whitespace-pre-wrap text-xs">{selectedAttr.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
