"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import FloatText from "@/components/ui/FloatText";
import { cn } from "@/utils/misc";
import ProjectTimeline from "@/components/project/ProjectTimeline";
import AnimatedRays from "@/components/galaxy/AnimatedRays";
import projects from "@/data/projects";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [startFloatText, setStartFloatText] = useState(false);

  const handleInitialLoad = () => {
    // Show main content container
    setShowContent(true);

    // Start float text animation after delay
    setTimeout(() => {
      setStartFloatText(true);
    }, 500);

    // Finally show timeline
    setTimeout(() => {
      setShowTimeline(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-[20px]">
        <Navbar onInitialLoad={handleInitialLoad} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <main
            className={cn(
              "transition-opacity duration-500 px-5",
              showContent ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="w-screen h-[calc(100vh-20px)] flex items-center justify-center relative">
              <FloatText
                text="sophie lin"
                className="text-4xl font-bold text-foreground z-10"
                startAnimation={startFloatText}
              />
              <div className="absolute inset-0">
                <AnimatedRays />
              </div>
            </div>
            <div
              className={cn(
                "w-full transition-opacity duration-500 mb-32",
                showTimeline ? "opacity-100" : "opacity-0"
              )}
            >
              <ProjectTimeline
                projects={projects}
                startAnimation={showTimeline}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
