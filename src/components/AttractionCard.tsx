import React from "react";
import ReactMarkdown from "react-markdown";
import type { Attraction } from "@/lib/attractions";

interface Props {
  attraction: Attraction;
  onClose: () => void;
}

export default function AttractionCard({ attraction, onClose }: Props) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-4 max-h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold text-lg truncate">{attraction.name}</div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 text-2xl leading-none"
          aria-label="关闭"
        >
          ×
        </button>
      </div>
      <div className="prose prose-sm flex-1 overflow-y-auto text-xs dark:prose-invert">
        <ReactMarkdown>{attraction.content}</ReactMarkdown>
      </div>
    </div>
  );
}
