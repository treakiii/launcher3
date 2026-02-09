import { useEffect, useRef } from "react";
import { useRetrac } from "src/wrapper/retrac";

import { AnimatePresence, motion } from "motion/react";
import { HiX } from "react-icons/hi";
import UI from "src/components/core/default";
import { OptionGroup } from "src/components/core/option";
import ReactMarkdown from "react-markdown";

const NewsModalWidget = () => {
  const retrac = useRetrac();

  const newsItem = retrac.selected_news_item;
  if (newsItem == null) return null;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="flex flex-col gap-1 p-8 pb-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent-vibrant text-[10px] font-black uppercase tracking-tighter">
            {newsItem.updateType || "Announcement"}
          </span>
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest">•</span>
          <span className="text-white/40 text-xs font-bold tracking-tight">
            {new Date(newsItem.date).toLocaleDateString()}
          </span>
        </div>
        <UI.H1 className="text-3xl font-black text-white tracking-tight leading-none">
          {newsItem.title}
        </UI.H1>
        <UI.P className="text-white/40 text-sm font-medium mt-2">
          By <span className="text-white/60 font-bold">{newsItem.authors}</span>
        </UI.P>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="prose prose-invert max-w-none prose-p:text-white/70 prose-p:leading-relaxed prose-headings:text-white prose-strong:text-white">
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => (
                <img
                  className="rounded-xl border border-white/5 shadow-2xl my-6"
                  draggable={false}
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 text-white/70 my-4" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="min-w-fit" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-white/70 text-base leading-relaxed mb-4 last:mb-0" {...props} />
              ),
              h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-white mt-8 mb-4 first:mt-0" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mt-6 mb-3 first:mt-0" {...props} />,
              code: ({ node, ...props }) => <code className="bg-white/5 rounded px-1.5 py-0.5 text-accent-vibrant font-mono text-sm" {...props} />
            }}
          >
            {newsItem.body}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

const NewsModalParent = () => {
  const retrac = useRetrac();

  const widgetContainerReference = useRef<HTMLDivElement>(null);
  const widgetReference = useRef<HTMLDivElement>(null);

  const widgetContainerClicked = (e: MouseEvent) => {
    if (!widgetReference.current) return;
    if (widgetReference.current.contains(e.target as Node)) return;
    retrac.set_show_news(false);
  };

  useEffect(() => {
    const el = widgetContainerReference.current;
    if (!el) return;

    el.addEventListener("click", widgetContainerClicked);
    return () => el.removeEventListener("click", widgetContainerClicked);
  }, [retrac.show_news]);

  return (
    <AnimatePresence>
      {retrac.show_news && (
        <motion.div
          ref={widgetContainerReference}
          className="fixed inset-0 flex items-center justify-center p-12 bg-black/60 backdrop-blur-md z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={widgetReference}
            className="relative flex flex-col w-full max-w-2xl max-h-full bg-neutral-900/90 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden glass-vibrant"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="absolute w-full h-12 top-0 left-0 z-20 cursor-move"
              data-tauri-drag-region
            />

            <button
              className="absolute right-6 top-6 p-2 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all z-30 group"
              onClick={() => retrac.set_show_news(false)}
            >
              <HiX size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <NewsModalWidget />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


export default NewsModalParent;
