import { convertFileSrc } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useApplicationInformation } from "src/wrapper/tauri";
import { LauncherStage, useUserManager } from "src/wrapper/user";
import { useOptions } from "src/wrapper/options";
import * as rr from "@tanstack/react-router";
import { twJoin } from "tailwind-merge";

import { HiMinus } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import UI from "src/components/core/default";

import Drawer from "src/components/navigation/drawer";
import BannerRenderer from "src/components/banner/parent";
import FriendsList from "src/components/navigation/friends";
import HoverManager from "src/components/core/hover";
import { SimpleUI } from "src/import/ui";

const ENSURE_IMAGES_ARE_CACHED = [
  "/donate/carti.webp",
  "/donate/gamer.webp",
  "/donate/crystal.webp",
  "/donate/fncs.webp",
  "/donate/og.webp",
  "/donate/carti_big.jpg",
  "/donate/gamer_big.jpg",
  "/donate/crystal_big.jpg",
  "/donate/fncs_big.jpg",
  "/donate/og_big.jpg",
];

const Frame = () => {
  const application = useApplicationInformation();
  const userManager = useUserManager();
  const navigate = rr.useNavigate();
  const options = useOptions();

  const show = userManager.access() || !userManager.loading();

  useEffect(() => {
    if (application.updateNeeded) {
      navigate({
        to: "/update",
      });
      return;
    }

    if (
      userManager._stage === LauncherStage.NoToken ||
      userManager._stage === LauncherStage.TestingToken
    ) {
      navigate({
        to: "/",
      });
    }

    if (userManager._stage === LauncherStage.AllGood) {
      navigate({
        to: "/app/home",
      });
    }
  }, [userManager._stage, application.updateNeeded]);

  return (
    <>
      {options.enable_background_image && (
        <div
          className="absolute w-[110%] h-[110%] opacity-20 pointer-events-none z-[-10000]"
          style={{
            backgroundImage: `url(${convertFileSrc(options.background_image) || "/bg2.jpg"
              })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: `blur(${options.background_blur}rem) saturate(1.5)`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      )}

      <main
        className={twJoin(
          "flex flex-row w-full h-full transition-colors duration-500",
          (options.enable_background_image || options.background_gradient != "")
            ? "bg-black/40"
            : "bg-neutral-950",
          "max-w-[100dvw] max-h-[100dvh] overflow-hidden z-20"
        )}
        data-tauri-drag-region
      >
        <Drawer />
        <HoverManager />

        <div className="flex flex-1 flex-col max-w-full max-h-full overflow-hidden relative">
          <nav
            className="flex items-center px-4 w-full h-12 border-white/5 border-b-[1px] border-solid backdrop-blur-xl z-50 bg-black/5"
            data-tauri-drag-region
          >
            <div className="flex items-center gap-2.5" data-tauri-drag-region>
              <img
                src="/icon.png"
                alt="Retrac"
                className="h-6 w-6 object-contain"
                draggable={false}
              />
              <div className="h-4 w-[1px] bg-white/10" />
              <span className="text-white/50 text-xs font-medium">
                v{application.version}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-1 h-full">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/5 active:scale-95 transition-all group"
                onClick={() => getCurrentWindow().minimize()}
              >
                <HiMinus className="text-white/30 group-hover:text-white transition-colors" size={16} />
              </button>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-red-500/20 active:scale-95 transition-all group"
                onClick={() => getCurrentWindow().close()}
              >
                <IoCloseSharp className="text-white/30 group-hover:text-red-400 transition-colors" size={20} />
              </button>
            </div>
          </nav>


          <BannerRenderer />

          <div className="flex flex-row flex-1 max-w-full max-h-full overflow-hidden">
            {options.enable_snow &&
              ((): boolean => {
                const today = new Date();
                const year = today.getFullYear();
                const start = new Date(year, 11, 1);
                const end = new Date(year, 11, 31);
                return today >= start && today <= end;
              })() && (
                <SimpleUI.FallingElements
                  density={options.snow_particles}
                  element={() => (
                    <SimpleUI.FallingElementContainer
                      element={() => (
                        <div className="w-full h-full bg-white rounded-full"></div>
                      )}
                      size_scale_min={0.1}
                      size_scale_max={0.5}
                    />
                  )}
                />
              )}

            <div className="relative flex flex-col flex-1 max-w-full max-h-full overflow-hidden overflow-y-auto @container">
              {show ? <rr.Outlet /> : <LoadingIndicator />}
            </div>

            {userManager.access() && <FriendsList />}
          </div>
        </div>
      </main>
    </>
  );
};

const LoadingIndicator = () => {
  const user = useUserManager();

  return (
    <UI.RowBox>
      <div className="flex p-2.5 border-1 border-solid border-neutral-700/40 rounded-xs">
        <UI.LoadingSpinner />
      </div>
      <div className="flex p-1.5 border-1 border-solid border-neutral-700/40 rounded-xs w-full">
        <UI.P className="text-neutral-500">
          Please wait while we connect you to our services.
        </UI.P>
      </div>
      <UI.Button
        colour="invisible"
        className="py-0 px-2 mt-auto z-10 w-min gap-0"
        onClick={() => user.logout()}
      >
        <span className="text-neutral-400 text-sm">Cancel</span>
      </UI.Button>
    </UI.RowBox>
  );
};

export default Frame;
