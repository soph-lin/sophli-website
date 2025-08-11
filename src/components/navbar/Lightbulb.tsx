'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/utils/misc';
import {
  getCurrentHandle,
  addDiscoveredHandle,
  PullCordHandle,
} from '@/utils/handles';
import { showToast } from '@/utils/toast';
import Stars from '../galaxy/Stars';

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
    // Get current handle
    const currentHandle = getCurrentHandle();
    if (currentHandle) {
      setHandle(currentHandle);
      // Add to discovered handles and show notification
      addDiscoveredHandle(currentHandle.id);
      showToast.handleDiscovered(currentHandle);
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
    document.documentElement.setAttribute('theme', on ? 'light' : 'dark');

    // Update favicon
    const favicon = document.getElementById('favicon') as HTMLLinkElement;
    if (favicon) {
      favicon.href = on ? '/favicon/star-white.png' : '/favicon/star-black.png';
    }

    if (!initialAnimationComplete.current) return;
    new Audio(
      handle?.pullSound || `/audio/light${on ? 'on' : 'off'}.wav`
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
            'absolute top-[-100px] right-7 transform stroke-current fill-current stroke-2 overflow-visible text-[100px] cursor-pointer',
            animateDrop && 'animate-cord-drop',
            animatePull && 'animate-cord-pull',
            !dropped && '-translate-y-full',
            dropped && 'translate-y-0'
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
