import { useState } from "react";
import { useRetrac } from "src/wrapper/retrac";
import { useUserManager } from "src/wrapper/user";

import UI from "src/components/core/default";
import NumberFlow from "@number-flow/react";

type CharacterWidgetProps = {
  user: User;
  season: number;
};

const CharacterWidget = (props: CharacterWidgetProps) => {
  const donationTier = useUserManager((s) => s.user_best_donation_tier)();
  const online = useRetrac((s) => s.players_online);

  const loadout = props.user.Profiles.athena.Loadouts.find(
    (l) => l.ID === props.user.Profiles.athena.Attributes["loadouts"][0]
  );
  if (loadout == null) return null;

  const character = props.user.Profiles.athena.Items[loadout.CharacterID || ""];
  if (character == null) return null;

  const template = character.Template.replace("_Retrac", "");
  const icon = `https://fortnite-api.com/images/cosmetics/br/${template}/icon.png`;

  const currency = Object.values(props.user.Profiles.common_core.Items).find(
    (i) => i.Template === "MtxPurchased"
  );
  if (currency == null) return null;

  const seasonStat = props.user.Account.Stats[props.season];
  if (!seasonStat) return null;

  return (
    <div className="glass flex flex-row p-5 gap-6 min-w-max w-[60%] @max-2xl:w-full rounded-2xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col flex-1 gap-4 z-10">
        <div className="flex flex-col gap-1">
          <UI.P className="text-white/40 uppercase tracking-widest text-[10px] font-bold">
            Welcome back
          </UI.P>
          <UI.H1 className="text-3xl">
            <span
              style={donationTier != null ? { color: donationTier.colour } : {}}
            >
              {props.user.Account.DisplayName}
            </span>
          </UI.H1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <UI.P className="text-emerald-400 font-medium">
              {online === 0 ? "No" : <NumberFlow value={online} />} players online
            </UI.P>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="flex flex-col">
            <UI.P className="text-white/30 text-[11px] mb-1 uppercase font-bold">V-Bucks</UI.P>
            <UI.P className="text-white text-lg font-bold">{currency.Quantity.toLocaleString()}</UI.P>
          </div>
          <div className="flex flex-col">
            <UI.P className="text-white/30 text-[11px] mb-1 uppercase font-bold">Level</UI.P>
            <UI.P className="text-white text-lg font-bold">{seasonStat.LevelClaimed.toLocaleString()}</UI.P>
          </div>
          <div className="flex flex-col">
            <UI.P className="text-white/30 text-[11px] mb-1 uppercase font-bold">Hype</UI.P>
            <UI.P className="text-white text-lg font-bold">
              {(
                (seasonStat.PersistentScores["NormalHype"] || 0) +
                (seasonStat.PersistentScores["LategameHype"] || 0)
              ).toLocaleString()}
            </UI.P>
          </div>
        </div>
      </div>

      <div className="relative h-32 w-32 ml-auto bg-white/5 border border-white/10 rounded-2xl p-2 z-10 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-radial-gradient from-accent/20 to-transparent opacity-50" />
        <CharacterImage url={icon} />
      </div>
    </div>
  );
};


type CharacterImageProps = {
  url: string;
};

const CharacterImage = (props: CharacterImageProps) => {
  const [showFake, setShowFake] = useState(true);

  return (
    <>
      {showFake && (
        <img
          src="/missing.png"
          className="absolute min-w-[114%] h-[114%]"
          draggable={false}
        />
      )}

      <img
        src={props.url}
        className="absolute min-w-[114%] h-[114%] opacity-0"
        draggable={false}
        onLoad={() => setShowFake(false)}
      />

      {!showFake && (
        <img
          src={props.url}
          className="absolute min-w-[114%] h-[114%]"
          draggable={false}
          onError={() => setShowFake(true)}
        />
      )}
    </>
  );
};

export default CharacterWidget;
