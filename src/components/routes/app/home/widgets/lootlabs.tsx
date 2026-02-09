import { useEffect, useState } from "react";
import { useUserManager } from "src/wrapper/user";
import { openUrl } from "@tauri-apps/plugin-opener";
import client from "src/axios/client";

import UI from "src/components/core/default";
import { formatTime } from "src/helpers/time";
import { SimpleUI } from "src/import/ui";

const LootLabsWidget = () => {
  const user = useUserManager();
  if (user._user === null)
    return null;

  const claimed = user._user.Account.State.ClaimedPackages["lootlabs_1kvbucks"];
  const difference = new Date().getTime() - new Date(claimed || 0).getTime();
  const disabled = difference < 24 * 60 * 60 * 1000;

  const [originalText, setOriginalText] = useState(
    formatTime(24 * 60 * 60 * 1000 - difference)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOriginalText(formatTime(24 * 60 * 60 * 1000 - difference));
    }, 1000);

    return () => clearInterval(interval);
  }, [difference]);

  const handleClaimOffer = async () => {
    if (user._token === null) return;
    const link = await client.get_lootlabs_offer_url(user._token);
    if (link.ok) {
      openUrl(link.data);
    }
  };

  return (
    <div className="glass group relative flex flex-col p-6 gap-3 w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-accent/5">
      <div
        className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, rgba(249, 49, 113, 0.15), transparent 70%)",
        }}
      >
        <SimpleUI.FallingElements
          density={30}
          element={() => (
            <SimpleUI.FallingElementContainer
              element={() => (
                <img
                  className="w-full h-full select-none opacity-40"
                  src="/vbuck.png"
                />
              )}
              size_scale_min={0.6}
              size_scale_max={0.9}
            />
          )}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <UI.H1 className="text-xl font-black text-white tracking-tight leading-none">
          Looking for more?
        </UI.H1>
        <UI.P className="text-white/50 text-sm font-medium leading-relaxed max-w-[90%]">
          Receive a gift package of V-Bucks every hour, for completely free! All
          you have to do is complete a simple offer from our sponsors.
        </UI.P>
      </div>

      <div className="relative z-10 mt-auto pt-4">
        {!disabled ? (
          <UI.Button
            colour="blue"
            className="w-full py-3 rounded-xl shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-all font-bold text-sm tracking-tight"
            onClick={handleClaimOffer}
          >
            Claim your reward now!
          </UI.Button>
        ) : (
          <UI.Button
            colour="neutral"
            className="w-full py-3 rounded-xl opacity-80 cursor-not-allowed font-medium text-xs tracking-wide"
            disabled
          >
            Offer refreshes in <span className="text-white font-bold ml-1">{originalText}</span>
          </UI.Button>
        )}
      </div>
    </div>
  );
};

export default LootLabsWidget;
