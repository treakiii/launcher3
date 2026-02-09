import React, { useEffect, useRef, useState } from "react";
import { LAUNCH_STATE, useLibrary } from "src/wrapper/library";
import { useNavigate } from "@tanstack/react-router";
import { useDownloadState } from "src/wrapper/download";

import * as Icons from "react-icons/io5";
import UI from "src/components/core/default";

const IMAGES = [
  "https://d1lss44hh2trtw.cloudfront.net/assets/article/2020/08/27/fortnite-chapter-2-season-4-marvel_feature.jpg",
  "https://fortniteinsider.com/wp-content/uploads/2020/08/Fortnite-Chapter-2-Season-4-Battle-Pass-Skins.jpg",
];

export const VER = "++Fortnite+Release-14.40-CL-14550713";
// const VER = "++Fortnite+Release-Live-CL-3724489";

const FortniteWidget = () => {
  const navigate = useNavigate();
  const library = useLibrary();

  const downloadState = useDownloadState();
  const isAnyDownloadActive = downloadState.active_download_progress.size > 0;

  const imageIndex = new Date().getMinutes() % IMAGES.length;

  const hasSeason14Downloaded =
    library.library.find((x) => x.version === VER) !== undefined;
  const buildLaunched = library.launchState === LAUNCH_STATE.LAUNCHED;
  const buildLaunching = library.launchState === LAUNCH_STATE.LAUNCHING;

  return (
    <div className="glass group relative flex flex-col p-8 gap-4 min-w-[45%] w-[70%] @max-2xl:w-[100%] @max-2xl:aspect-[21/9] @max-sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-accent/20">

      <div className="absolute inset-0 z-0 overflow-hidden">
        <VideoDisplay
          address={
            "https://cdn.retrac.site/public/01J7B2FNTZ4SGMKWGPCKSEXWF3/RetracSeason14Card.mp4"
          }
          backup={
            <img
              src={IMAGES[imageIndex]}
              className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40"
              draggable={false}
            />
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      <div className="relative z-20 mt-auto flex flex-col gap-2 max-w-lg">
        <UI.P className="text-accent-vibrant font-bold tracking-[0.2em] uppercase text-xs mb-[-4px]">
          Currently playing
        </UI.P>
        <UI.H1 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-2xl leading-none">
          Chapter 2 <br /> <span className="text-white/80">Season 4</span>
        </UI.H1>

        <UI.P className="text-white/60 text-base leading-relaxed mt-2 line-clamp-2 @max-sm:hidden">
          Also known as <span className="text-white font-bold italic">Stark Season</span>. Experience the OG Marvel collaboration that changed the game forever.
        </UI.P>

        <div className="flex flex-row gap-4 mt-6 items-center">
          {!hasSeason14Downloaded &&
            !buildLaunched &&
            !buildLaunching &&
            !isAnyDownloadActive && (
              <UI.Button
                colour="blue"
                className="px-8 py-3 rounded-xl shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform"
                onClick={() => navigate({ to: "/app/downloads" })}
              >
                <Icons.IoDownloadOutline size={20} />
                <span className="font-bold text-base">Download Now</span>
              </UI.Button>
            )}

          {!buildLaunching &&
            !buildLaunched &&
            hasSeason14Downloaded &&
            !isAnyDownloadActive && (
              <UI.Button
                colour="green"
                className="px-10 py-3 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform"
                onClick={() => library.launchBuild(VER, null)}
              >
                <Icons.IoPlaySharp size={20} className="ml-1" />
                <span className="font-bold text-base">Launch Retrac</span>
              </UI.Button>
            )}

          {(buildLaunching || isAnyDownloadActive) && (
            <UI.Button
              colour="neutral"
              className="px-8 py-3 rounded-xl opacity-80 cursor-not-allowed"
              disabled
            >
              <UI.LoadingSpinner />
              <span className="font-bold">
                {isAnyDownloadActive ? "Downloading..." : "Launching..."}
              </span>
            </UI.Button>
          )}

          {buildLaunched && (
            <UI.Button
              colour="neutral"
              className="px-8 py-3 rounded-xl bg-white/10 text-white/50 cursor-not-allowed"
              disabled
            >
              <span className="font-bold italic">Game is Running</span>
            </UI.Button>
          )}
        </div>
      </div>

      {/* Subtle floating elements/accents */}
      <div className="absolute top-8 right-8 z-20 flex gap-2">
        <div className="glass px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 border-white/10">
          Season 14.40
        </div>
      </div>
    </div>
  );
};


type VideoDisplayProps = {
  address: string;
  backup: React.ReactNode;
};

const VideoDisplay = (props: VideoDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleLoadedData = () => {
    setVideoLoaded(true);
  };

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.addEventListener("loadeddata", handleLoadedData);

    return () => {
      if (!videoRef.current) return;
      videoRef.current.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [videoRef]);

  return (
    <>
      <video
        className="absolute top-0 left-0 w-full h-full object-cover object-center"
        style={{
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.10))",
        }}
        ref={videoRef}
        src={props.address}
        autoPlay
        loop
        muted
      />

      {!videoLoaded && props.backup}
    </>
  );
};

export default FortniteWidget;
