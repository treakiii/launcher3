import { MutableRefObject, useEffect, useRef } from "react";
import { DONATION_TIERS, useUserManager } from "src/wrapper/user";
import { openUrl } from "@tauri-apps/plugin-opener";

import UI from "src/components/core/default";

const DonateWidget = () => {
  const user = useUserManager();
  if (user._user === null)
    return (
      console.error("cannot load donate widget: user._user == null") ?? null
    );
  if (user.user_best_donation_tier() === null) return <NotDonatedMessage />;
  return <DonatedMessage entry={user.user_best_donation_tier()!} />;
};

type DonatedMessageProps = {
  entry: (typeof DONATION_TIERS)[keyof typeof DONATION_TIERS];
};

const DonatedMessage = (type: DonatedMessageProps) => {
  return (
    <div
      className="glass flex flex-row gap-4 w-full p-4 rounded-xl text-center items-center justify-center relative group overflow-hidden"
      style={{
        backgroundColor: `${type.entry.colour}05`,
        borderColor: `${type.entry.colour}20`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="w-2 h-2 rounded-full shadow-[0_0_10px_2px]" style={{ backgroundColor: type.entry.colour }} />
      <UI.P className="text-white font-medium">
        <span style={{ color: type.entry.colour }} className="font-bold">{type.entry.text}</span> perks are currently active on your account.
      </UI.P>
    </div>
  );
};

const NotDonatedMessage = () => {
  return (
    <div
      className="glass flex flex-row flex-wrap gap-4 w-full p-4 rounded-xl cursor-pointer relative group overflow-hidden border-emerald-500/20 shadow-lg shadow-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300"
      onClick={() => openUrl("https://shop.retrac.site")}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-3 z-10 w-full justify-center">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </div>
        <div className="flex flex-col items-center">
          <UI.P className="text-white font-bold text-sm">Consider supporting Retrac</UI.P>
          <UI.P className="text-white/40 text-xs font-medium uppercase tracking-tight">Help fund servers for the community & get exclusive perks</UI.P>
        </div>
      </div>
    </div>
  );
};


export default DonateWidget;
