'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils/misc';
import GitHubIcon from '../icons/GitHubIcon';
import { Linkedin } from 'lucide-react';

interface FloatTextProps {
  text: string;
  className?: string;
  delayMs?: number;
  startAnimation?: boolean;
}

interface CharPosition {
  x: number;
  y: number;
  rotation: number;
  floatOffset: number;
}

interface IconPosition extends CharPosition {
  scale: number;
}

export default function FloatText({
  text,
  className = '',
  delayMs = 100,
  startAnimation = false,
}: FloatTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const originalPositions = useRef<{ x: number; y: number }[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [visibleLetters, setVisibleLetters] = useState<boolean[]>(
    new Array(text.length).fill(false)
  );
  const [hasDropped, setHasDropped] = useState(false);
  const charPositions = useRef<CharPosition[]>([]);
  const iconPositions = useRef<IconPosition[]>([]);
  const lastTime = useRef<number>(0);

  // Handle initial cascading animation
  useEffect(() => {
    if (!startAnimation) return;

    text.split('').forEach((_, index) => {
      setTimeout(() => {
        setVisibleLetters(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        // Smoothly transition to floating animation
        if (index === text.length - 1) {
          setTimeout(() => {
            // Store original positions after drop animation
            const chars =
              containerRef.current?.getElementsByClassName('float-char');
            if (chars) {
              const containerRect =
                containerRef.current?.getBoundingClientRect();
              originalPositions.current = Array.from(chars).map(char => {
                const rect = char.getBoundingClientRect();
                return {
                  x: rect.left - containerRect!.left + rect.width / 2,
                  y: rect.top - containerRect!.top + rect.height / 2,
                };
              });
            }
            setHasDropped(true);
          }, 500);
        }
      }, index * delayMs);
    });
  }, [text, delayMs, startAnimation]);

  useEffect(() => {
    // Initialize random float offsets for each character
    charPositions.current = text.split('').map(() => ({
      x: 0,
      y: 0,
      rotation: 0,
      floatOffset: Math.random() * Math.PI * 2,
    }));

    iconPositions.current = [
      {
        x: 0,
        y: 0,
        rotation: 0,
        floatOffset: Math.random() * Math.PI * 2,
        scale: 1,
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        floatOffset: Math.random() * Math.PI * 2,
        scale: 1,
      },
    ];
  }, [text]);

  // Mouse position tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle animation
  useEffect(() => {
    if (!hasDropped) return;

    const animate = (time: number) => {
      lastTime.current = time;

      const chars = containerRef.current?.getElementsByClassName('float-char');
      const icons =
        containerRef.current?.getElementsByClassName('float-icon-wrapper');
      if (!chars || !icons) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      const mouseX = mousePosition.current.x - containerRect!.left;
      const mouseY = mousePosition.current.y - containerRect!.top;

      Array.from(chars).forEach((element: Element, index) => {
        const char = element as HTMLElement;
        const pos = charPositions.current[index];

        // Calculate distance from mouse
        const charRect = char.getBoundingClientRect();
        const charX = charRect.left - containerRect!.left + charRect.width / 2;
        const charY = charRect.top - containerRect!.top + charRect.height / 2;
        const deltaX = mouseX - charX;
        const deltaY = mouseY - charY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const repulsion = Math.pow(1 - distance / maxDistance, 1.5) * 0.8;
          const angle = Math.atan2(deltaY, deltaX);
          pos.x = -Math.cos(angle) * repulsion * 30;
          pos.y = -Math.sin(angle) * repulsion * 30;
          pos.rotation = repulsion * 5;
        } else {
          const timeInSeconds = time * 0.0005;
          pos.x = Math.sin(timeInSeconds + pos.floatOffset) * 0.8;
          pos.y = Math.cos(timeInSeconds * 0.8 + pos.floatOffset) * 0.8;
          pos.rotation = Math.sin(timeInSeconds * 0.5 + pos.floatOffset) * 0.5;

          const returnSpeed = 0.05;
          pos.x += (0 - pos.x) * returnSpeed;
          pos.y += (0 - pos.y) * returnSpeed;
          pos.rotation += (0 - pos.rotation) * returnSpeed;
        }

        char.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg)`;
      });

      Array.from(icons).forEach((element: Element, index) => {
        const icon = element as HTMLElement;
        const pos = iconPositions.current[index];

        const timeInSeconds = time * 0.0005;
        pos.x = Math.sin(timeInSeconds + pos.floatOffset) * 2;
        pos.y = Math.cos(timeInSeconds * 0.8 + pos.floatOffset) * 2;
        pos.rotation = Math.sin(timeInSeconds * 0.5 + pos.floatOffset) * 1.2;

        icon.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg)`;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hasDropped]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col items-center gap-4 relative overflow-visible select-none',
        className
      )}
    >
      <div className="flex relative">
        {text.split('').map((letter, index) => (
          <span
            key={index}
            className={cn(
              'float-char inline-block relative z-[5]',
              letter === ' ' && 'mr-[1ch]'
            )}
            style={{
              transform: visibleLetters[index]
                ? 'translateY(0)'
                : 'translateY(-100%)',
              opacity: visibleLetters[index] ? 1 : 0,
              transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform',
              pointerEvents: 'auto',
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="flex relative">
        <div className="float-icon-wrapper">
          <a
            href="https://github.com/soph-lin"
            target="_blank"
            rel="noopener noreferrer"
            className="float-icon inline-block relative z-[5] p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors mr-6 cursor-pointer"
            style={{
              willChange: 'transform',
              transition:
                'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out',
              transform: hasDropped ? 'scale(1)' : 'scale(0)',
              opacity: hasDropped ? 1 : 0,
              transformOrigin: 'center center',
            }}
          >
            <div>
              <GitHubIcon className="w-6 h-6" />
            </div>
          </a>
        </div>
        <div className="float-icon-wrapper">
          <a
            href="https://www.linkedin.com/in/sophie-lin-b7aabb321/"
            target="_blank"
            rel="noopener noreferrer"
            className="float-icon inline-block relative z-[5] p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
            style={{
              willChange: 'transform',
              transition:
                'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out',
              transform: hasDropped ? 'scale(1)' : 'scale(0)',
              opacity: hasDropped ? 1 : 0,
              transformOrigin: 'center center',
            }}
          >
            <div>
              <Linkedin className="w-6 h-6" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
