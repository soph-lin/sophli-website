"use client";

import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import TypedText from "../ui/TypedText";
import { cn } from "@/utils/misc";
import { ProjectCardProps } from "./ProjectCard";
import { Pause, Play, Rewind, FastForward } from "phosphor-react";

const dateToNumber = (dateStr: string): number => {
  if (dateStr.toLowerCase() === "present") {
    return Infinity;
  }

  const [month, year] = dateStr.split("/");
  return parseInt(year) * 12 + parseInt(month);
};

interface ProjectTimelineProps {
  projects: ProjectCardProps[];
  startAnimation: boolean;
}

export default function ProjectTimeline({
  projects: unsortedProjects,
  startAnimation,
}: ProjectTimelineProps) {
  // Sort projects by start date (mm/yyyy)
  const projects = [...unsortedProjects].sort(
    (a, b) => dateToNumber(b.startDate) - dateToNumber(a.startDate)
  );

  const [hasTyped, setHasTyped] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const lastTimeRef = useRef(0);
  const hasStartedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<number[]>([]);
  const positionsRef = useRef<number[]>([]);

  const cardWidth = 500;
  const cardSpacing = 100;
  const speed = 2;
  const skipLength = 100;
  const spacing = cardWidth + cardSpacing;

  const [viewportEdges, setViewportEdges] = useState({
    leftEdge: -cardWidth,
    rightEdge: 0,
  });

  useEffect(() => {
    setViewportEdges({
      leftEdge: -cardWidth,
      rightEdge: window.innerWidth + cardWidth,
    });

    const handleResize = () => {
      setViewportEdges({
        leftEdge: -cardWidth,
        rightEdge: window.innerWidth + cardWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cardWidth]);

  useEffect(() => {
    if (startAnimation && !hasStartedRef.current) {
      setHasTyped(false);
      setIsTypingComplete(false);
      hasStartedRef.current = true;
    }
  }, [startAnimation]);

  useEffect(() => {
    if (isTypingComplete && !hasTyped) {
      setIsTimelineVisible(true);
      setHasTyped(true);
    }
  }, [isTypingComplete, hasTyped]);

  // Initialize positions with proper spacing
  useEffect(() => {
    const initialPositions = projects.map((_, i) => {
      return viewportEdges.leftEdge + i * spacing;
    });
    setPositions(initialPositions);
    positionsRef.current = initialPositions;
  }, [projects.length, viewportEdges.leftEdge, spacing]);

  useEffect(() => {
    if (!isTimelineVisible) return;

    let animationFrame: number;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 1000 / 30; // Update state at 30fps

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      if (!isPaused) {
        const deltaTime = timestamp - lastTimeRef.current;
        const newPositions = [...positionsRef.current];

        // Update all positions
        for (let i = 0; i < newPositions.length; i++) {
          newPositions[i] += (speed * deltaTime) / 16;

          // If a card goes too far right, move it to the left
          if (newPositions[i] > viewportEdges.rightEdge) {
            const leftmostPosition = Math.min(...newPositions);
            newPositions[i] = leftmostPosition - spacing;
          }
        }

        positionsRef.current = newPositions;

        // Update state at a lower frequency to prevent render thrashing
        if (timestamp - lastUpdateTime >= UPDATE_INTERVAL) {
          setPositions(newPositions);
          lastUpdateTime = timestamp;
        }
      }

      lastTimeRef.current = timestamp;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrame);
      lastTimeRef.current = 0;
    };
  }, [isTimelineVisible, isPaused, viewportEdges.rightEdge, spacing, speed]);

  const skipForward = () => {
    setPositions((prevPositions) => {
      return prevPositions.map((position) => {
        const newPosition = position + skipLength;

        // When a card moves past the right edge, reposition it to the left
        if (newPosition > viewportEdges.rightEdge) {
          const leftmostPosition = Math.min(...prevPositions);
          return leftmostPosition - spacing;
        }
        return newPosition;
      });
    });
  };

  const skipBackward = () => {
    setPositions((prevPositions) => {
      return prevPositions.map((position) => {
        const newPosition = position - skipLength;

        // When a card moves past the left edge, reposition it to the right
        if (newPosition < viewportEdges.leftEdge) {
          const rightmostPosition = Math.max(...prevPositions);
          return rightmostPosition + spacing;
        }
        return newPosition;
      });
    });
  };

  return (
    <div className="w-full h-full">
      {/* Title */}
      <div className="max-w-7xl mx-auto px-4">
        <TypedText
          text="projects"
          className="text-2xl font-bold mb-12 text-center"
          onComplete={() => setIsTypingComplete(true)}
          skip={!startAnimation}
        />
      </div>

      {/* Timeline */}
      <div
        className={cn(
          "relative mt-16 mb-32 transition-opacity duration-1000",
          isTimelineVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div
          className="max-w-[100vw] mx-auto py-8 overflow-y-visible"
          ref={containerRef}
        >
          <div className="relative">
            <div className="absolute top-1/2 left-[-10%] w-[120%] h-0.5 border-b border-dashed border-gray-400" />

            <div>
              <div className="relative min-h-[28rem] w-[500%]">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="absolute top-1/2 left-0 -translate-y-1/2 will-change-transform"
                    style={{
                      transform: `translate3d(${positions[index]}px, -50%, 0)`,
                      width: `${cardWidth}px`,
                      opacity: 1,
                      transition: "opacity 0.05s ease-out",
                    }}
                  >
                    <div className="pr-8">
                      <ProjectCard {...project} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8 text-black z-10">
          <button
            onClick={skipBackward}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Skip backward"
          >
            <Rewind size={28} weight="regular" />
          </button>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isPaused ? "Play animation" : "Pause animation"}
          >
            {isPaused ? (
              <Play size={28} weight="regular" />
            ) : (
              <Pause size={28} weight="regular" />
            )}
          </button>
          <button
            onClick={skipForward}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Skip forward"
          >
            <FastForward size={28} weight="regular" />
          </button>
        </div>
      </div>
    </div>
  );
}
