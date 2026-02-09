import { useEffect } from "react";
import { getCurrentWindow, UserAttentionType } from "@tauri-apps/api/window";
import { UnlistenFn } from "@tauri-apps/api/event";
import { useBannerManager } from "src/wrapper/banner";
import { useUserManager } from "src/wrapper/user";
import { useNavigate } from "@tanstack/react-router";
import { openUrl } from "@tauri-apps/plugin-opener";
import * as Icons from "react-icons/io5";

import * as deeplink from "@tauri-apps/plugin-deep-link";
import client from "src/axios/client";

import UI from "src/components/core/default";

const LoginPage = () => {
  const userManager = useUserManager();
  const bannerManager = useBannerManager();
  const navigate = useNavigate();

  const handleAuthenticate = async () => {
    const redirect = await client.get_discord_login_url();
    if (!redirect.ok) {
      bannerManager.push({
        id: "login-error",
        text: "Our servers seem to be down, please try again later.",
        closable: true,
        colour: "red",
      });
      throw new Error("Failed to get Discord login URL");
    }
    await openUrl(redirect.data);
  };

  const onNewToken = async (input: string[]) => {
    for (const scheme of input) {
      console.log("[login] new token", input);
      if (scheme.startsWith("retrac://token@")) {
        const token = scheme
          .replace("retrac://token@", "")
          .replace("/", "")
          .trim();
        userManager.login(token);
        navigate({
          to: "/app/home",
        });
        getCurrentWindow().requestUserAttention(UserAttentionType.Critical);
        getCurrentWindow().setFocus();
      }
    }
  };

  useEffect(() => {
    const unlisten = deeplink.onOpenUrl(onNewToken);

    return () => {
      unlisten.then((fn: UnlistenFn) => fn());
    };
  }, []);

  useEffect(() => {
    if (userManager.access()) {
      navigate({
        to: "/app/home",
      });
    }
  }, [userManager._token]);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Subtle Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm mx-6">
        <div className="glass w-full p-8 rounded-2xl flex flex-col items-center gap-6 shadow-xl">
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src="/icon.png"
              alt="Retrac"
              className="h-16 w-16 object-contain mb-2"
              draggable={false}
            />
            <UI.P className="text-white/60 font-medium text-sm max-w-[280px]">
              Connect your Discord account to access Retrac
            </UI.P>
          </div>

          <div className="w-full flex flex-col gap-3">
            <UI.Button
              colour="discord"
              onClick={handleAuthenticate}
              className="w-full h-12 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] transition-colors font-semibold"
              loadAfterClick={true}
              loadAfterClickText="Waiting for Discord..."
            >
              Connect with Discord
            </UI.Button>

            <div className="flex items-center justify-center gap-2 opacity-40">
              <Icons.IoShieldCheckmarkSharp className="text-emerald-400" size={12} />
              <span className="text-[10px] font-medium text-white">Secure Authentication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
