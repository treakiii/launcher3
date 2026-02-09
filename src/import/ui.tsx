import React, { useMemo } from "react";
import { twJoin } from "tailwind-merge";
import { useLocation, useNavigate } from "@tanstack/react-router";

import * as Icons from "react-icons/io5";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";

export namespace SimpleUI {
  export const DrawerState = {
    Disabled: 0,
    Collapsed: 1,
    Expanded: 2,
  };
  export const DrawerPosition = {
    Left: 0,
    Right: 1,
  };
  export type DrawerItemsOptions = {
    top: (Partial<DrawerItemOptions> | null)[];
    bottom: (Partial<DrawerItemOptions> | null)[];
  };
  export type DrawerOptions = {
    state: (typeof DrawerState)[keyof typeof DrawerState];
    position: (typeof DrawerPosition)[keyof typeof DrawerPosition];
    items: DrawerItemsOptions;
  };
  const DefaultDrawerOptions: DrawerOptions = {
    state: DrawerState.Expanded,
    position: DrawerPosition.Left,
    items: { top: [], bottom: [] },
  };
  export const Drawer = (props: Partial<DrawerOptions>) => {
    const options = { ...DefaultDrawerOptions, ...props };

    const final_width =
      options.state === DrawerState.Disabled
        ? 0
        : options.state === DrawerState.Collapsed
          ? 84
          : 280;

    const render_item = (
      item: Partial<DrawerItemOptions> | null,
      index: number
    ) => {
      if (item === null) return null;
      return (
        <DrawerItem
          {...DefaultDrawerItemOptions}
          {...item}
          drawer_state={options.state}
          key={index}
        />
      );
    };

    return (
      <motion.nav
        className={twJoin(
          "relative flex flex-col items-stretch gap-3 h-full border-white/5 border-solid overflow-hidden p-3 backdrop-blur-xl z-50",
          options.state !== DrawerState.Disabled && [
            options.position === DrawerPosition.Right &&
            "border-r-0 border-l-[1px] ml-auto",
            options.position === DrawerPosition.Left && "border-l-0 border-r-[1px]",
          ],
          "bg-black/30"
        )}
        initial={false}
        animate={{
          width: final_width,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 25,
        }}
      >
        <div className="flex items-center justify-center py-4">
          <img
            src="/icon.png"
            alt="Retrac"
            className="h-7 w-7 object-contain opacity-90"
            draggable={false}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          {options.items.top.map(render_item)}
        </div>

        <div className="mt-auto flex flex-col gap-1.5 pt-3 border-t border-white/5">
          {options.items.bottom.map(render_item)}
        </div>
      </motion.nav>
    );
  };

  export type DrawerItemClickLink = {
    type: "LINK";
    href: string;
  };
  export type DrawerItemClickFunction = {
    type: "FUNCTION";
    fn: () => void;
  };
  export type DrawerItemNotification =
    | {
      type: "TEXT";
      colour_scheme: "blue" | "red" | "green" | "yellow" | "grey";
      text: string;
    }
    | {
      type: "NUMBER";
      colour_scheme: "blue" | "red" | "green" | "yellow" | "grey";
      number: number;
    };
  export type DrawerItemOptions = {
    icon: keyof typeof Icons;
    label: string;
    colour_scheme:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "purple"
    | "pink"
    | "grey";
    clicked?: DrawerItemClickLink | DrawerItemClickFunction;
    notification?: DrawerItemNotification;
    drawer_state?: (typeof DrawerState)[keyof typeof DrawerState];
    custom_backdrop?: React.ReactNode;
    advert: boolean;
  };
  export const DefaultDrawerItemOptions: DrawerItemOptions = {
    icon: "IoAlertCircleSharp",
    label: "Item",
    colour_scheme: "grey",
    advert: false,
  };
  export const DrawerItem = (props: Partial<DrawerItemOptions>) => {
    const options = { ...DefaultDrawerItemOptions, ...props };

    const navigate = useNavigate();
    const location = useLocation();

    const active =
      options.clicked &&
      options.clicked.type === "LINK" &&
      location.pathname === options.clicked.href;

    const handleInteraction = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      if (!options.clicked) return;
      e.preventDefault();

      const handlers = {
        FUNCTION: (options.clicked as DrawerItemClickFunction).fn,
        LINK: () =>
          navigate({ to: (options.clicked as DrawerItemClickLink).href }),
      } as Record<typeof options.clicked.type, () => void>;
      handlers[options.clicked.type]();
    };

    const schemeClass = {
      grey: "text-neutral-400 hover:text-white hover:bg-white/5",
      red: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
      green: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
      blue: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
      yellow: "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10",
      pink: "text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-500/10",
      purple: "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10",
    };

    const activeClass = "bg-white/10 text-white";

    const Icon = Icons[options.icon] || Icons.IoAlertCircleSharp;

    return (
      <button
        draggable={false}
        onClick={handleInteraction}
        className={twJoin(
          "relative group flex items-center h-10 rounded-lg transition-all duration-200 cursor-pointer overflow-hidden border border-transparent outline-none",
          active ? activeClass : schemeClass[options.colour_scheme],
          options.drawer_state === DrawerState.Collapsed ? "justify-center px-0" : "px-3 w-full"
        )}
      >
        {active && (
          <div className="absolute left-0 w-1 h-4 bg-emerald-400 rounded-r-full" />
        )}

        <div className={twJoin(
          "flex items-center justify-center transition-all duration-200",
          active ? "" : "opacity-70 group-hover:opacity-100"
        )}>
          <Icon size={18} />
        </div>

        {options.drawer_state === DrawerState.Expanded && (
          <span className="ml-3 text-sm font-medium whitespace-nowrap">
            {options.label}
          </span>
        )}

        {options.drawer_state === DrawerState.Expanded && options.notification && (
          <div className="ml-auto">
            {options.notification.type === "NUMBER" ? (
              <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <NumberFlow value={options.notification.number} />
              </div>
            ) : (
              <div className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 text-[10px] font-bold">
                {options.notification.text}
              </div>
            )}
          </div>
        )}

        {options.drawer_state === DrawerState.Collapsed && options.notification && (
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        )}
      </button>
    );
  };


  export type FallingElementsOptions = {
    element: React.ElementType;
    density: number;
  };
  export const DefaultFallingElementsOptions: FallingElementsOptions = {
    element: () => <></>,
    density: 50,
  };
  export const FallingElements = (props: Partial<FallingElementsOptions>) => {
    const options = { ...DefaultFallingElementsOptions, ...props };
    const Element = options.element;

    const rendered = useMemo(() => {
      return Array.from({ length: options.density }).map((_, idx) => (
        <Element key={idx} {...props} />
      ));
    }, [props.density]);

    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {rendered}
      </div>
    );
  };

  export type FallingElementContainersOptions = {
    element: React.ElementType;
    size_scale_min: number;
    size_scale_max: number;
  };
  export const DefaultFallingElementContainersOptions: FallingElementContainersOptions =
  {
    element: () => <></>,
    size_scale_min: 1,
    size_scale_max: 1,
  };
  export const FallingElementContainer = (
    props: Partial<FallingElementContainersOptions>
  ) => {
    const options = { ...DefaultFallingElementContainersOptions, ...props };
    const Element = options.element;

    const randomised = useMemo(() => {
      const size =
        Math.random() * options.size_scale_max + options.size_scale_min;

      const left = Math.random() * 100;
      const duration = Math.random() * 5 + 15;
      const delay = Math.random() * -20;
      const rotation = Math.random() * 360 - 90;

      return { size, left, duration, delay, rotation };
    }, []);

    return (
      <motion.div
        initial={{
          y: "-10vh",
          rotate: 0,
        }}
        animate={{
          y: "110vh",
          rotate: randomised.rotation,
        }}
        transition={{
          duration: randomised.duration,
          delay: randomised.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: 0,
          left: `${randomised.left}%`,
          height: `${randomised.size}rem`,
          width: `${randomised.size}rem`,
          backdropFilter: "blur(1rem)",
          // backgroundImage: "url(/vbuck.png)",
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          pointerEvents: "none",
          opacity: 0.2,
        }}
      >
        <Element />
      </motion.div>
    );
  };

  export type ListOptions = {
    title?: string;
    direction: "column" | "row";
    scrollable: boolean;
  };
  export const DefaultListOptions: ListOptions = {
    direction: "column",
    scrollable: false,
  };
  export const List = (_: Partial<ListOptions>) => {
    // const options = { ...DefaultListOptions, ...props };

    return <motion.div></motion.div>;
  };
}
