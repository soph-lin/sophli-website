'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar/Navbar';
import FloatText from '@/components/ui/FloatText';
import TypedText from '@/components/ui/TypedText';
import { cn } from '@/utils/misc';
import ProjectTimeline from '@/components/project/ProjectTimeline';
import ProjectGrid from '@/components/project/ProjectGrid';
import AnimatedRays from '@/components/galaxy/AnimatedRays';
import { SquaresFour, List, CaretDown } from 'phosphor-react';
import projects from '@/data/projects';
import { getRandomAsciiArt } from '@/data/asciiArt';

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [startFloatText, setStartFloatText] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const consoleSetupRef = useRef(false);
  const isRegeneratingRef = useRef(false);

  useEffect(() => {
    // Only set up console commands once
    if (consoleSetupRef.current) return;
    consoleSetupRef.current = true;

    // Easter egg: log random ASCII art on page load
    const message = `Nice to meet you here in the console ;)
  If you ever want to collab on a project or just chat, feel free to reach out on LinkedIn: https://www.linkedin.com/in/sophie-lin-b7aabb321/`;

    // Initial console output
    const randomArt = getRandomAsciiArt();
    console.log(randomArt);
    console.log(message);

    // Add custom console command
    (window as any).foo = function () {
      isRegeneratingRef.current = true;
      const newArt = getRandomAsciiArt();
      console.clear();
      console.log(newArt);
      console.log(message);
      console.log(
        '🎨 ASCII art regenerated! Type "foo()" or console.clear() to do it again.'
      );
      isRegeneratingRef.current = false;
      return; // Explicitly return nothing
    };

    // Override console.clear to also regenerate art
    const originalClear = console.clear;
    console.clear = () => {
      const result = originalClear.call(console);
      // Only regenerate if not already regenerating
      if (!isRegeneratingRef.current) {
        const newArt = getRandomAsciiArt();
        console.log(newArt);
        console.log(message);
        console.log(
          '🎨 ASCII art regenerated! Type "foo() or console.clear()" to do it again.'
        );
      }
      return result;
    };

    console.log(
      '💡 Tip: Type "foo()" or use console.clear() to get new ASCII art!'
    );
  }, []);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

      <div className="flex-grow flex flex-col">
        <div className="flex items-center justify-center overflow-visible">
          <main
            className={cn(
              'transition-opacity duration-500 px-5 w-full overflow-visible',
              showContent ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="w-full min-h-[calc(100vh-20px)] flex items-center justify-center relative">
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
                'w-full transition-opacity duration-500 mb-32 flex-grow projects-section',
                showProjects ? 'opacity-100' : 'opacity-0'
              )}
            >
              {/* Projects Header */}
              <div className="max-w-7xl mx-auto px-4">
                <TypedText
                  text="projects"
                  className="text-2xl font-bold mb-8 text-center"
                  onComplete={() => {}}
                  skip={!showProjects}
                />
              </div>

              {/* View Toggle Dropdown */}
              <div className="flex justify-center mb-8">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {viewMode === 'grid' ? (
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
                        'transition-transform duration-200',
                        isDropdownOpen ? 'rotate-180' : ''
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden">
                      {viewMode === 'timeline' && (
                        <button
                          onClick={() => {
                            setViewMode('grid');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <SquaresFour size={20} />
                          Grid View
                        </button>
                      )}
                      {viewMode === 'grid' && (
                        <button
                          onClick={() => {
                            setViewMode('timeline');
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <List size={20} />
                          Timeline View
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Projects Component */}
              {viewMode === 'grid' ? (
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
