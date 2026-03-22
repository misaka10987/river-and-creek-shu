"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

import AttractionList from "@/components/AttractionList";
// import AttractionCard from "@/components/AttractionCard"; // 由 AttractionCardWrapper 内部使用，无需在此引入
import AttractionCardWrapper from "@/components/AttractionCardWrapper";

const ShanghaiMap = dynamic(() => import("@/components/ShanghaiMap"), { ssr: false });

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-7xl items-center py-12 px-2 sm:px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">上海沿江沿河旅游地图</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 text-center">
          沿苏州河、黄浦江，发现上海的城市风光与历史人文。点击地图上的标签，了解每个景点的故事。
        </p>
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* 左侧：景点列表 */}
          <div className="w-full sm:w-64 md:w-72 shrink-0 order-2 sm:order-1">
            <AttractionList onSelect={setSelected} selected={selected} />
          </div>
          {/* 中间：地图 */}
          <div className="flex-1 min-w-0 order-1 sm:order-2 flex justify-center items-stretch">
            <div className="w-full h-100 sm:h-150 md:h-175 lg:h-200 max-w-4xl">
              <ShanghaiMap selected={selected} setSelected={setSelected} />
            </div>
          </div>
          {/* 右侧：介绍卡片，仅桌面端显示 */}
          <div className="hidden sm:block w-0 sm:w-72 md:w-80 shrink-0 order-3">
            {/* AttractionCard 只在有选中时显示 */}
            <AttractionCardWrapper selected={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
        {/* 移动端卡片浮层 */}
        {selected && (
          <div className="sm:hidden fixed inset-0 z-1000 bg-black/40 flex items-end">
            <div className="w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-lg p-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-10">
              <AttractionCardWrapper selected={selected} onClose={() => setSelected(null)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );

}
