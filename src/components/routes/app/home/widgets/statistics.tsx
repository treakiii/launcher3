import { formatTime } from "src/helpers/time";

import UI from "src/components/core/default";

type StatisticsWidgetProps = {
  account: User["Account"];
  season: number;
};

const StatisticsWidget = (props: StatisticsWidgetProps) => {
  const seasonStat = props.account.Stats[props.season];
  if (!seasonStat)
    return (
      console.error("cannot load stats matches widget: seasonStat = null 0") ??
      null
    );

  const eliminations = Object.values(seasonStat.Matches).reduce(
    (acc, match) => acc + match.Eliminations,
    0
  );
  const matchesPlayed = Object.values(seasonStat.Matches).length;
  const victoryRoyales = Object.values(seasonStat.Matches).filter(
    (match) => match.Placement === 1
  ).length;
  const timeAlive = Object.values(seasonStat.Matches).reduce((acc, match) => {
    return acc + new Date(match.TimeAlive).getTime() / 1000 / 1000;
  }, 0);

  return (
    <div className="glass flex flex-col p-5 w-[40%] @max-2xl:w-full min-w-max rounded-2xl relative group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <UI.P className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-4 z-10">
        Your Statistics
      </UI.P>

      <div className="flex flex-col gap-3 z-10">
        <div className="flex flex-row w-full items-center justify-between">
          <UI.P className="text-neutral-400 font-medium">Eliminations</UI.P>
          <UI.P className="text-white font-bold">{eliminations.toLocaleString()}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center justify-between">
          <UI.P className="text-neutral-400 font-medium">Victory Royales</UI.P>
          <UI.P className="text-white font-bold">{victoryRoyales.toLocaleString()}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center justify-between">
          <UI.P className="text-neutral-400 font-medium">Matches Played</UI.P>
          <UI.P className="text-white font-bold">{matchesPlayed.toLocaleString()}</UI.P>
        </div>
        <div className="flex flex-row w-full items-center justify-between">
          <UI.P className="text-neutral-400 font-medium">Time Alive</UI.P>
          <UI.P className="text-white font-bold">{formatTime(timeAlive)}</UI.P>
        </div>
      </div>
    </div>
  );

};

export default StatisticsWidget;
