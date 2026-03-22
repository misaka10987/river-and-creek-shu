"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import AttractionList from "@/components/AttractionList";

const ShanghaiMap = dynamic(() => import("@/components/ShanghaiMap"), { ssr: false });

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-3xl items-center py-12 px-4 sm:px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">上海沿江沿河旅游地图</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 text-center">
          沿苏州河、黄浦江，发现上海的城市风光与历史人文。点击地图上的标签，了解每个景点的故事。
        </p>
        <div className="w-full flex flex-col sm:flex-row gap-8">
          <div className="sm:w-1/3 w-full order-2 sm:order-1">
            <AttractionList onSelect={setSelected} selected={selected} />
          </div>
          <div className="flex-1 order-1 sm:order-2">
            <ShanghaiMap selected={selected} setSelected={setSelected} />
          </div>
        </div>
      </main>
    </div>
  );
}
