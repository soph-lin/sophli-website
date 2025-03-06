"use client";

import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";
import { cn, random, chance } from "@/utils/misc";
import Stars from "../galaxy/Stars";

interface PullCordHandle {
  icon: string;
  message: string;
  x?: number;
  y?: number;
  includeOriginalHandle?: boolean;
  pullSound?: string;
}

const pc = (
  icon: string | string[],
  message: string | string[],
  opts: Partial<Omit<PullCordHandle, "icon" | "message">> = {}
): PullCordHandle => {
  if (!opts.x) opts.x = -10;
  if (!opts.y) opts.y = 160;
  if (!opts.includeOriginalHandle) opts.includeOriginalHandle = false;
  return {
    icon: typeof icon === "string" ? icon : random(icon),
    message: typeof message === "string" ? message : random(message),
    ...opts,
  };
};

const specialHandles: Record<string, PullCordHandle> = {
  "02/14": pc("🌹", "a rose for thee", { x: -7 }),
  "10/31": pc("🎃", [
    "a spooky surprise!",
    `it's heavy! how strong is this cord??`,
  ]),
  "12/25": pc("🎁", "a gift for you on a special day 🎄"),
};

const miscHandles: PullCordHandle[] = [
  pc("🕷️", "aaah! spider!", { includeOriginalHandle: true }),
  pc("⚓", "ahoy matey!", { x: -11 }),
  pc("🔔", "ring ring", { pullSound: "/audio/bell.mp3" }),
  pc(["🐟", "🐠", "🦞", "🐡", "🦐", "🦀"], "what a catch!", {
    pullSound: "/audio/splash.mp3",
  }),
  pc("🐒", "monkey see, monkey do", {
    x: -5,
    y: 152,
    includeOriginalHandle: true,
  }),
  pc("🦧", "monkey see, monkey do", {
    x: -11,
    y: 150,
    includeOriginalHandle: true,
  }),
  pc("🦍", "monkey see, monkey do", {
    x: -12,
    y: 150,
    includeOriginalHandle: true,
  }),
];

interface LightbulbProps {
  onInitialLoad?: () => void;
}

export default function Lightbulb({ onInitialLoad }: LightbulbProps) {
  const [initialized, setInitialized] = useState(false);
  const [dropped, setDropped] = useState(false);
  const [animateDrop, setAnimateDrop] = useState(false);
  const [animatePull, setAnimatePull] = useState(false);
  const [on, setOn] = useState(true);
  const [handle, setHandle] = useState<PullCordHandle | null>(null);
  const initialAnimationComplete = useRef(false);

  // Initial animation sequence
  useEffect(() => {
    if (initialAnimationComplete.current) return;

    setInitialized(true);
    // Create handle
    const today = dayjs().format("MM/dd");
    if (today in specialHandles) {
      setHandle(specialHandles[today]);
    } else if (chance(1 / 20)) {
      setHandle(random(miscHandles));
    }

    // First drop the cord
    const dropTimer = setTimeout(() => {
      setDropped(true);
      setAnimateDrop(true);

      // After cord drops, wait a bit then pull
      const afterDropTimer = setTimeout(() => {
        setAnimateDrop(false);

        // Now do the pull animation
        const pullTimer = setTimeout(() => {
          setAnimatePull(true);
          setOn(false);

          // Reset pull animation but keep cord visible
          setTimeout(() => {
            setAnimatePull(false);
            initialAnimationComplete.current = true;
            // Add slight delay before triggering content
            setTimeout(() => {
              if (onInitialLoad) {
                onInitialLoad();
              }
            }, 500);
          }, 200);
        }, 200);

        return () => clearTimeout(pullTimer);
      }, 1000);

      return () => clearTimeout(afterDropTimer);
    }, 500);

    return () => clearTimeout(dropTimer);
  }, [onInitialLoad]);

  // Handle click to toggle light
  const handleClick = () => {
    if (!initialAnimationComplete.current) return;
    setAnimatePull(true);
    setOn(!on);
    setTimeout(() => setAnimatePull(false), 200);
  };

  // Toggle light on
  useEffect(() => {
    if (!initialized) return;
    document.documentElement.setAttribute("theme", on ? "light" : "dark");

    // Update favicon
    const favicon = document.getElementById("favicon") as HTMLLinkElement;
    if (favicon) {
      favicon.href = on ? "/favicon/star-white.png" : "/favicon/star-black.png";
    }

    if (!initialAnimationComplete.current) return;
    new Audio(
      handle?.pullSound || `/audio/light${on ? "on" : "off"}.wav`
    ).play();
  }, [on]);

  // Content
  return (
    <>
      {!on && <Stars />}
      <div className="relative w-[50px] select-none z-10" onClick={handleClick}>
        {/* Pull cord */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "absolute top-[-100px] right-7 transform stroke-current fill-current stroke-2 overflow-visible text-[100px] cursor-pointer",
            animateDrop && "animate-cord-drop",
            animatePull && "animate-cord-pull",
            !dropped && "-translate-y-full",
            dropped && "translate-y-0"
          )}
          width="50"
          height="300"
          viewBox="0 0 50 300"
        >
          <g transform="translate(25,0)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="200"
              strokeDasharray={5}
              strokeLinecap="round"
            />
            {/* Default pull cord handle*/}
            {(!handle ||
              (handle && (handle as PullCordHandle).includeOriginalHandle)) && (
              <circle cx="0" cy="200" r="5" />
            )}
            {/* Custom pull cord handle*/}
            {handle && (
              <g transform="scale(1.3)">
                <text
                  x={(handle as PullCordHandle).x}
                  y={(handle as PullCordHandle).y}
                  className="text-base"
                >
                  {(handle as PullCordHandle).icon}
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>
    </>
  );
}
