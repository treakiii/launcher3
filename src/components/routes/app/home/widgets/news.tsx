import { useRetrac } from "src/wrapper/retrac";
import * as Icons from "react-icons/io5";

import UI from "src/components/core/default";

const NewsWidget = () => {
  const retrac = useRetrac();

  return (
    <div className="glass flex flex-col p-6 gap-4 w-full rounded-2xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col gap-1">
        <UI.H1 className="text-2xl tracking-tight">Updates & News</UI.H1>
        <UI.P className="text-white/40 text-xs font-medium uppercase tracking-wider">
          Stay informed about the latest changes
        </UI.P>
      </div>

      <div className="flex flex-col gap-1 z-10">
        {retrac.launcher_news.slice(0, 5).map((item, i) => (
          <NewsItem key={i} {...item} />
        ))}

        <button className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest transition-colors outline-none border border-transparent hover:border-white/5">
          View All Updates
        </button>
      </div>
    </div>
  );
};

const NewsItem = (props: LauncherNewsItem) => {
  const retrac = useRetrac();

  const isnew =
    new Date(props.date).getTime() > new Date().getTime() - 60 * 60 * 24 * 7;

  const date = new Date(props.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return (
    <div
      className="group/item flex items-center gap-4 py-2 px-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5"
      onClick={() => {
        retrac.set_selected_news_item(props);
        retrac.set_show_news(true);
      }}
    >
      <div className="flex flex-col min-w-[45px] items-center py-1 rounded-lg bg-white/5 group-hover/item:bg-accent/20 transition-colors">
        <span className="text-[10px] font-black text-white/40 group-hover/item:text-accent-vibrant tracking-tighter leading-none">{month}/{year}</span>
        <span className="text-sm font-black text-white group-hover/item:text-white leading-none mt-0.5">{day}</span>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-white/80 font-bold text-sm truncate group-hover/item:text-white">{props.title}</span>
          {isnew && (
            <span className="px-1.5 py-0.5 rounded-md bg-accent/20 text-accent-vibrant text-[8px] font-black uppercase animate-pulse">New</span>
          )}
        </div>
        <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">
          {props.updateType !== "" ? props.updateType : "General"} Update
        </span>
      </div>

      <Icons.IoChevronForward className="text-white/10 group-hover/item:text-white/40 group-hover/item:translate-x-1 transition-all" size={14} />
    </div>
  );
};


export default NewsWidget;
