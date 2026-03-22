import React, { useEffect, useRef } from "react";

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
  script.src = "https://api.tianditu.gov.cn/api?v=4.0&tk=您的天地图Key";
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}

export default function ShanghaiMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTianDiTuScript(() => {
      if (!(window as any).TMap || !mapRef.current) return;
      // @ts-ignore
      const map = new (window as any).TMap.Map(mapRef.current, {
        center: [121.4737, 31.2304], // 上海市中心经纬度
        zoom: 12,
      });
    });
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-100 rounded-lg border border-zinc-200 shadow"
      id="shanghai-map"
    />
  );
}
