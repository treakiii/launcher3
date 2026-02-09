import { useEffect, useState } from "react";
import { useRetrac } from "src/wrapper/retrac";
import { msUntil, msUntilDate, renderTimeUntil } from "src/helpers/time";

import { IoTimeSharp } from "react-icons/io5";
import { TbPointFilled } from "react-icons/tb";
import UI from "src/components/core/default";

type EventsWidgetProps = {
  withScoringRules?: boolean;
};

const EventsWidget = (props: EventsWidgetProps) => {
  const [selected, setSelected] = useState(0);

  const news = useRetrac((s) => s.events);
  if (news.length === 0)
    return console.error("cannot load events widget: news.length = 0") ?? null;

  const filtered = news.filter(
    (e) => !e.event.IsArena && new Date(e.event.Expire) > new Date()
  );
  if (filtered.length === 0)
    return (
      console.error("cannot load events widget: filtered.length = 0") ?? null
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setSelected((prev) => (prev + 1) % filtered.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [filtered.length]);

  return (
    <>
      <div className="glass group relative flex flex-col gap-2 w-full aspect-[21/9] rounded-3xl cursor-pointer overflow-hidden shadow-2xl">
        <EventDisplay event={filtered[selected]} />
      </div>

      {props.withScoringRules && <ScoringRules event={filtered[selected]} />}
    </>
  );
};

type EventDisplayProps = {
  event: LauncherEventItem;
};

const EventDisplay = (props: EventDisplayProps) => {
  const nextWindowIndex = props.event.event.Windows.reduce(
    (acc, window, idx) => {
      if (msUntil(window.Start) > msUntilDate(new Date())) {
        acc = idx;
        return acc;
      }

      return acc;
    },
    -1
  );

  const currentWindowIndex = props.event.event.Windows.reduce(
    (acc, window, idx) => {
      if (
        msUntil(window.Start) < msUntilDate(new Date()) &&
        msUntil(window.End) > msUntilDate(new Date())
      ) {
        acc = idx;
        return acc;
      }

      return acc;
    },
    -1
  );

  return (
    <>
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
          src={props.event.style.playlist_tile_image}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="absolute z-10 top-4 left-4 flex flex-row gap-2">
        {nextWindowIndex !== -1 && (
          <StartsInTag
            start={props.event.event.Windows[nextWindowIndex].Start}
          />
        )}
        {currentWindowIndex !== -1 && (
          <div className="flex flex-row items-center gap-2 bg-red-500/80 px-3 py-1.5 backdrop-blur-md rounded-full border border-red-400/50 shadow-lg shadow-red-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <UI.P className="uppercase font-black text-[10px] tracking-widest text-white">
              Live Now
            </UI.P>
          </div>
        )}
      </div>

      <div className="mt-auto z-10 flex flex-col p-8 gap-1.5 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
        <UI.H1 className="text-3xl font-black text-white drop-shadow-lg">
          {props.event.style.short_format_title}
        </UI.H1>
        <UI.P className="text-white/60 font-medium text-sm max-w-[80%] line-clamp-2">
          {props.event.style.details_description}
        </UI.P>
      </div>

      <motion.div
        key={props.event.event.ID}
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{ duration: 7, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-accent-vibrant z-20 shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.5)]"
        style={{ width: '100%' }}
      />
    </>
  );
};

type StartsInTagProps = {
  start: string;
};

const StartsInTag = (props: StartsInTagProps) => {
  return (
    <div className="flex flex-row items-center gap-0.5 bg-neutral-800/30 p-0.5 backdrop-blur-xs rounded-sm">
      <IoTimeSharp className="text-neutral-300 h-[15px] w-[15px]" />
      <UI.P className="uppercase font-geist font-[700] text-[12px] leading-[14px] text-neutral-100">
        {renderTimeUntil(msUntil(props.start)).toUpperCase()}
      </UI.P>
    </div>
  );
};

type ScoringRulesProps = {
  event: LauncherEventItem;
};

const ScoringRules = (props: ScoringRulesProps) => {
  return (
    <div className="flex flex-col gap-2 flex-1 p-1">
      {/* p-2 bg-neutral-800/10 rounded-xs border-neutral-700/40 border-1 border-solid">
      {/* <div className="flex flex-col gap-[1px]"> */}
      {/* <UI.P className="font-geist font-[600] text-neutral-400">
          Scoring Rules
        </UI.P> */}

      {/* <UI.P className="text-neutral-500">
          You will earn points based on the following scoring rules.
        </UI.P> */}
      {/* </div> */}

      <div className="flex flex-col gap-2 flex-1">
        {props.event.event.Templates[0].ScoringRules.sort((a, b) => {
          if (a.Stat === "TEAM_ELIMS_STAT_INDEX") return -1;
          if (b.Stat === "TEAM_ELIMS_STAT_INDEX") return 1;
          return 0;
        }).map((rule) => (
          <ScoringRule rule={rule} key={rule.Stat} />
        ))}
      </div>
    </div>
  );
};

type ScoringRuleProps = {
  rule: LauncherEventItem["event"]["Templates"][0]["ScoringRules"][0];
};

const ScoringRule = (props: ScoringRuleProps) => {
  return (
    <div className="relative flex flex-row flex-wrap flex-1 gap-0.5 p-1.5 border-neutral-700/40 border-1 border-solid pt-2.5">
      <UI.P
        className="text-neutral-500 bg-neutral-800/20 absolute top-[-0.5rem] left-1 p-[0.1rem] pb-0"
        style={{
          fontSize: "12px",
        }}
      >
        {props.rule.Stat}
      </UI.P>

      {props.rule.Tiers.map((tier) => (
        <UI.P
          className="text-neutral-400"
          style={{
            fontSize: "12px",
            width: "calc(50% - 2px)",
          }}
          key={tier.Value}
        >
          {props.rule.Stat === "TEAM_ELIMS_STAT_INDEX" ? (
            <span className="text-neutral-400">Each Elimination</span>
          ) : (
            <span className="text-neutral-400">Reach Top {tier.Value}</span>
          )}

          <span className="text-neutral-300 font-geist font-[600]">
            {" +"}
            {tier.Points} Points
          </span>
        </UI.P>
      ))}
    </div>
  );
};

export default EventsWidget;
