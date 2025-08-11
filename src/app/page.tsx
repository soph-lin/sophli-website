"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar/Navbar";
import FloatText from "@/components/ui/FloatText";
import { cn } from "@/utils/misc";
import ProjectTimeline from "@/components/project/ProjectTimeline";
import ProjectGrid from "@/components/project/ProjectGrid";
import AnimatedRays from "@/components/galaxy/AnimatedRays";
import projects from "@/data/projects";
import { List, SquaresFour, CaretDown } from "phosphor-react";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [startFloatText, setStartFloatText] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInitialLoad = () => {
    // Show main content container
    setShowContent(true);

    // Start float text animation after delay
    setTimeout(() => {
      setStartFloatText(true);
    }, 500);

    // Finally show projects
    setTimeout(() => {
      setShowProjects(true);
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
                showProjects ? "opacity-100" : "opacity-0"
              )}
            >
              {/* View Toggle Dropdown */}
              <div className="max-w-7xl mx-auto px-4 mb-8">
                <div className="flex justify-center">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {viewMode === "grid" ? (
                          <>
                            <SquaresFour size={20} className="inline mr-2" />
                            Grid View
                          </>
                        ) : (
                          <>
                            <List size={20} className="inline mr-2" />
                            Timeline View
                          </>
                        )}
                      </span>
                      <CaretDown
                        size={16}
                        className={cn(
                          "transition-transform duration-200",
                          isDropdownOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setViewMode("grid");
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2 text-left flex items-center gap-2 transition-colors",
                            viewMode === "grid"
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          <SquaresFour size={20} />
                          Grid View
                        </button>
                        <button
                          onClick={() => {
                            setViewMode("timeline");
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2 text-left flex items-center gap-2 transition-colors",
                            viewMode === "timeline"
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          <List size={20} />
                          Timeline View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Projects Component */}
              {viewMode === "grid" ? (
                <ProjectGrid
                  projects={projects}
                  startAnimation={showProjects}
                />
              ) : (
                <ProjectTimeline
                  projects={projects}
                  startAnimation={showProjects}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
