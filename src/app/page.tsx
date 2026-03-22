
function MapClient() {
  "use client";
  const dynamicImport = require("next/dynamic");
  const ShanghaiMap = dynamicImport.default(() => import("@/components/ShanghaiMap"), { ssr: false });
  return <ShanghaiMap />;
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-3xl items-center py-12 px-4 sm:px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">上海沿江沿河旅游地图</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 text-center">
          沿苏州河、黄浦江，发现上海的城市风光与历史人文。点击地图上的标签，了解每个景点的故事。
        </p>
        <MapClient />
      </main>
    </div>
  );
}
