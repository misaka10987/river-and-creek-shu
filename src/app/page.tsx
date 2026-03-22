import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-3xl items-center py-12 px-4 sm:px-8 bg-white dark:bg-black">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">上海沿江沿河旅游地图</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 text-center">
          沿苏州河、黄浦江，发现上海的城市风光与历史人文。点击地图上的标签，了解每个景点的故事。
        </p>
        <ShanghaiMap />
      </main>
    </div>
  );
              width={16}
              height={16}
import dynamic from "next/dynamic";

const ShanghaiMap = dynamic(() => import("@/components/ShanghaiMap"), { ssr: false });
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
