'use client';

import { useState, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import { cn } from '@/utils/misc';
import { ProjectCardProps } from './ProjectCard';
import { MagnifyingGlass, X, Funnel } from 'phosphor-react';

interface ProjectGridProps {
  projects: ProjectCardProps[];
  startAnimation: boolean;
}

export default function ProjectGrid({
  projects: unsortedProjects,
  startAnimation,
}: ProjectGridProps) {
  // Sort projects by most recent first (ongoing projects first, then by start date)
  const projects = [...unsortedProjects].sort((a, b) => {
    const dateToNumber = (dateStr: string): number => {
      if (dateStr.toLowerCase() === 'present') {
        return Infinity;
      }
      const [month, year] = dateStr.split('/');
      return parseInt(year) * 12 + parseInt(month);
    };

    // First, sort by whether the project is ongoing (endDate === "Present" or undefined)
    const aIsOngoing = a.endDate?.toLowerCase() === 'present' || !a.endDate;
    const bIsOngoing = b.endDate?.toLowerCase() === 'present' || !b.endDate;

    if (aIsOngoing && !bIsOngoing) return -1; // a is ongoing, b is not
    if (!aIsOngoing && bIsOngoing) return 1; // b is ongoing, a is not

    // If both are ongoing or both are completed, sort by start date (most recent first)
    return dateToNumber(b.startDate) - dateToNumber(a.startDate);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasTyped, setHasTyped] = useState(false);
  const [isGridVisible, setIsGridVisible] = useState(false);

  // Get all unique tags from projects (combining areas and skills)
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.areas.forEach(area => tags.add(area));
      project.skills.forEach(skill => tags.add(skill));
    });
    return Array.from(tags).sort();
  }, [projects]);

  // Filter projects based on search query and selected tags
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch =
        searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some(
          tag => project.areas.includes(tag) || project.skills.includes(tag)
        );

      return matchesSearch && matchesTags;
    });
  }, [projects, searchQuery, selectedTags]);

  // Handle tag selection/deselection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  // Animation effects
  if (startAnimation && !hasTyped) {
    setHasTyped(true);
  }

  if (startAnimation && !isGridVisible) {
    setIsGridVisible(true);
  }

  return (
    <div className="w-full h-full overflow-visible">
      {/* Search and Filters */}
      <div
        className={cn(
          'max-w-7xl mx-auto px-4 mb-8 transition-opacity duration-1000 overflow-visible',
          isGridVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Search Bar */}
        <div className="relative mb-6">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Funnel size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by tags:
            </span>
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full border transition-all duration-200',
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      <div
        className={cn(
          'max-w-7xl mx-auto px-4 mb-32 transition-opacity duration-1000 overflow-visible',
          isGridVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start overflow-visible">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="animate-fade-in w-full overflow-visible"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No projects found
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              Try adjusting your search or filters
            </div>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
