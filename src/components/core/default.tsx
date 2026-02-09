import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

namespace UI {
  export const Box = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    if (props.children === null) return null;
    return (
      <div
        className={`border-white/5 border-b-[1px] border-solid transition-all duration-300 ${props.className}`}
      >
        {props.children}
      </div>
    );
  };

  export const ColBox = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    if (props.children === null) return null;
    return (
      <Box
        {...props}
        className={`flex flex-col gap-2 p-4 ${props.className}`}
      />
    );
  };

  export const RowBox = (
    props: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
  ) => {
    if (props.children === null) return null;
    return (
      <Box
        {...props}
        className={`flex flex-row gap-4 p-4 ${props.className} @max-xl:flex-col items-center`}
      />
    );
  };

  export const P = (
    props: {
      children: React.ReactNode;
    } & React.HTMLAttributes<HTMLParagraphElement>
  ) => {
    return (
      <p
        {...props}
        className={`text-neutral-400 font-inter text-sm leading-relaxed min-w-fit ${props.className}`}
      />
    );
  };

  export const H1 = (
    props: {
      children: React.ReactNode;
    } & React.HTMLAttributes<HTMLHeadingElement>
  ) => {
    return (
      <h1
        {...props}
        className={`text-white font-geist text-2xl font-bold tracking-tight ${props.className}`}
      />
    );
  };

  export const BUTTON_COLOURS = {
    neutral: [
      "bg-white/5 border-white/10 border-[1px] border-solid min-w-max px-4 py-2 rounded-lg cursor-pointer text-neutral-200 font-inter text-sm hover:bg-white/10 active:scale-95 transition-all flex flex-row items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    red: [
      "bg-red-500/10 border-red-500/20 border-[1px] border-solid min-w-max px-4 py-2 rounded-lg cursor-pointer text-red-400 font-inter text-sm hover:bg-red-500/20 active:scale-95 transition-all flex flex-row items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    green: [
      "bg-emerald-500/10 border-emerald-500/20 border-[1px] border-solid min-w-max px-4 py-2 rounded-lg cursor-pointer text-emerald-400 font-inter text-sm hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-row items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    blue: [
      "bg-accent/10 border-accent/20 border-[1px] border-solid min-w-max px-4 py-2 rounded-lg cursor-pointer text-accent-vibrant font-inter text-sm hover:bg-accent/20 active:scale-95 transition-all flex flex-row items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    discord: [
      "bg-[#5865f2]/10 border-[#5865f2]/20 border-[1px] border-solid min-w-max px-4 py-2 rounded-lg cursor-pointer text-white font-inter text-sm hover:bg-[#5865f2]/20 active:scale-95 transition-all flex flex-row items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    pink: [
      "bg-fuchsia-500/10 border-fuchsia-500/20 border-[1px] border-solid min-w-max px-4 py-2 rounded-lg cursor-pointer text-fuchsia-400 font-inter text-sm hover:bg-fuchsia-500/20 active:scale-95 transition-all flex flex-row items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
    ],
    invisible: [
      "bg-transparent border-transparent border-[1px] border-solid min-w-max px-4 py-2 rounded-lg cursor-pointer text-neutral-400 font-inter text-sm hover:bg-white/5 active:scale-95 transition-all flex flex-row items-center justify-center gap-2 disabled:opacity-50",
    ],
  };

  export const Button = (
    props: React.HTMLProps<HTMLButtonElement> & {
      colour: keyof typeof BUTTON_COLOURS;
      loadAfterClick?: boolean;
      loadAfterClickText?: string;
    }
  ) => {
    const normalReactProps = { ...props };
    delete normalReactProps.loadAfterClick;
    delete normalReactProps.loadAfterClickText;

    const [clicked, setClicked] = useState(false);
    return (
      <button
        {...normalReactProps}
        onClick={(e) => {
          try {
            setClicked(true);
            props.onClick && props.onClick(e);
            setTimeout(() => setClicked(false), 10000);
          } catch (error) {
            setClicked(false);
          }
        }}
        type="button"
        className={`${BUTTON_COLOURS[props.colour][0]} ${props.className || ""}`}
        disabled={(props.loadAfterClick && clicked) || props.disabled}
      >
        {props.loadAfterClick && clicked ? (
          <>
            <LoadingSpinner />
            {props.loadAfterClickText}
          </>
        ) : (
          props.children
        )}
      </button>
    );
  };

  export const LoadingSpinner = () => {
    return (
      <span className="flex flex-row w-min gap-[4px] items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-current rounded-full"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </span>
    );
  };

  export const LoadingSpinnerOpaque = () => <LoadingSpinner />;

  interface MinDurationProps {
    visible: boolean;
    minDuration: number;
    children: React.ReactNode;
  }

  export const MinDuration = ({
    visible,
    minDuration,
    children,
  }: MinDurationProps) => {
    const [shouldRender, setShouldRender] = useState(visible);
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
      let timer: any;

      if (visible) {
        setShouldRender(true);
        setMinTimeElapsed(false);
        timer = setTimeout(() => setMinTimeElapsed(true), minDuration);
      } else if (!minTimeElapsed) {
        timer = setTimeout(() => setShouldRender(false), minDuration);
      } else {
        setShouldRender(false);
      }

      return () => clearTimeout(timer);
    }, [visible, minDuration, minTimeElapsed]);

    return (
      <AnimatePresence>
        {shouldRender ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  };

  type ButtonProps = {
    children: React.ReactNode;
    on_click: () => void;
    colour: "green" | "red" | "blue" | "invisible";
    tooltip?: string;
    _last?: boolean;
    disabled?: boolean;
  };

  export const RowButton = (props: ButtonProps) => {
    const colourClass = (
      {
        blue: "hover:bg-accent/20 text-accent-vibrant",
        green: "hover:bg-emerald-500/20 text-emerald-400",
        red: "hover:bg-red-500/20 text-red-500",
        invisible: "hover:bg-white/10 text-neutral-400",
      } as const
    )[props.colour];

    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div className="relative flex items-center justify-center">
        <button
          className={`aspect-square w-9 h-9 flex items-center justify-center bg-white/5 rounded-lg transition-all active:scale-90 ${props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } ${colourClass}`}
          onClick={props.on_click}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={props.disabled}
        >
          {props.children}
        </button>
        <AnimatePresence>
          {showTooltip && props.tooltip && (
            <motion.div
              className="absolute bottom-full mb-2 px-2 py-1 bg-neutral-800 text-white text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none"
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
            >
              {props.tooltip}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
}


export default UI;
