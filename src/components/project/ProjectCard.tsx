'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { RocketLaunch, PushPin } from 'phosphor-react';
import GitHubIcon from '../icons/GitHubIcon';
import HandHeartIcon from '../icons/HandHeartIcon';
import Tooltip from '../ui/Tooltip';
import { cn } from '@/utils/misc';
import { formatDate } from '@/utils/date';
import { projectCovers } from '@/data/projectCovers';

export interface ProjectCardProps {
  name: string;
  description: string;
  areas: string[];
  skills: string[];
  startDate: string;
  endDate?: string;
  thumbnail?: string;
  content?: string;
  playThumbnailOnHover?: boolean;
  demoLink?: string;
  githubLink?: string;
  clientLink?: string;
  pinned?: boolean;
  onTagClick?: (tag: string) => void;
  selectedTags?: string[];
}

export default function ProjectCard({
  name,
  description,
  areas,
  skills,
  startDate,
  endDate,
  thumbnail,
  content,
  demoLink,
  githubLink,
  clientLink,
  playThumbnailOnHover,
  pinned,
  onTagClick,
  selectedTags,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  // Deterministic cover selection based on project name to avoid hydration mismatch
  const getDeterministicCover = (projectName: string) => {
    let hash = 0;
    for (let i = 0; i < projectName.length; i++) {
      const char = projectName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return projectCovers[Math.abs(hash) % projectCovers.length];
  };

  const [defaultCover] = useState(() => getDeterministicCover(name));

  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const contentVideoRef = useRef<HTMLVideoElement>(null);

  // Use default cover if no thumbnail and content provided
  const effectiveThumbnail = thumbnail || `/project-covers/${defaultCover}`;

  // Enhanced file type detection for better static image support
  // Supports: PNG, JPG, JPEG, GIF, WebP, SVG, BMP for images
  // Supports: MP4, WebM, OGG, MOV, AVI for videos
  const isVideoFile = (filename: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const isImageFile = (filename: string) => {
    const imageExtensions = [
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.webp',
      '.svg',
      '.bmp',
    ];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const isThumbnailVideo = isVideoFile(effectiveThumbnail);
  const isThumbnailImage = isImageFile(effectiveThumbnail);
  const isContentVideo = content ? isVideoFile(content) : false;
  const isContentImage = content ? isImageFile(content) : false;
  const contentUrl = content || effectiveThumbnail;

  useEffect(() => {
    // Only handle video playback for video files
    if (
      thumbnailVideoRef.current &&
      isThumbnailVideo &&
      (playThumbnailOnHover || content)
    ) {
      if (isHovered) {
        thumbnailVideoRef.current.play();
      } else {
        thumbnailVideoRef.current.pause();
        thumbnailVideoRef.current.currentTime = 0;
      }
    }
    if (contentVideoRef.current && isContentVideo && isHovered) {
      contentVideoRef.current.play();
    } else if (contentVideoRef.current && isContentVideo) {
      contentVideoRef.current.pause();
      contentVideoRef.current.currentTime = 0;
    }
  }, [
    isHovered,
    playThumbnailOnHover,
    content,
    isThumbnailVideo,
    isContentVideo,
  ]);

  // Handle loading media and set correct aspect ratio
  // For phone-ratio content (aspectRatio < 1), we enforce max height
  // For landscape content (aspectRatio > 1), we use natural aspect ratio
  const handleMediaLoad = (element: HTMLImageElement | HTMLVideoElement) => {
    if (element instanceof HTMLImageElement) {
      const ratio = element.naturalWidth / element.naturalHeight;
      setAspectRatio(ratio);
    } else if (element instanceof HTMLVideoElement) {
      const ratio = element.videoWidth / element.videoHeight;
      setAspectRatio(ratio);
    }
  };

  return (
    <div
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 max-h-[600px] project-card-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full overflow-hidden rounded-t-lg"
        style={{
          // For phone-ratio content (aspectRatio < 1), use auto height to allow shrinking
          // For landscape content (aspectRatio > 1), use natural aspect ratio
          aspectRatio: thumbnail && aspectRatio >= 1 ? aspectRatio : 'auto',
          minHeight: !thumbnail ? '200px' : 'auto',
          maxHeight: '400px',
          // For phone-ratio thumbnails, don't force height - let them shrink naturally
          // This creates extra space on left/right for vertical images
          height: !thumbnail ? '200px' : 'auto',
        }}
      >
        {/* Thumbnail */}
        {isThumbnailVideo ? (
          <video
            src={effectiveThumbnail}
            className={`w-full h-full transition-opacity duration-300 ${
              isHovered && content ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              // Default thumbnails (from project-covers) should fill the card
              // Actual project thumbnails should use contain for proper sizing
              objectFit: effectiveThumbnail.includes('project-covers')
                ? 'cover'
                : 'contain',
              objectPosition: 'center',
            }}
            ref={thumbnailVideoRef}
            muted
            loop
            playsInline
            onLoadedMetadata={e => handleMediaLoad(e.currentTarget)}
          />
        ) : isThumbnailImage ? (
          <Image
            src={effectiveThumbnail}
            alt={`${name} thumbnail`}
            fill
            className={cn(
              'transition-opacity duration-300',
              isHovered && content ? 'opacity-0' : 'opacity-100'
            )}
            style={{
              // Default thumbnails (from project-covers) should fill the card
              // Actual project thumbnails should use contain for proper sizing
              objectFit: effectiveThumbnail.includes('project-covers')
                ? 'cover'
                : 'contain',
              objectPosition: 'center',
            }}
            sizes="100%"
            onLoad={e => handleMediaLoad(e.currentTarget)}
            draggable={false}
          />
        ) : (
          // Fallback for other file types or no thumbnail
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              No thumbnail
            </span>
          </div>
        )}
        {/* Content */}
        {content &&
          (isContentVideo ? (
            <video
              src={contentUrl}
              className={`absolute inset-0 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                objectFit: 'contain',
                maxHeight: '400px',
                width: '100%',
                height: '100%',
              }}
              ref={contentVideoRef}
              muted
              loop
              playsInline
              onLoadedMetadata={e => handleMediaLoad(e.currentTarget)}
            />
          ) : isContentImage ? (
            <Image
              src={contentUrl}
              alt={`${name} content`}
              fill
              className={`transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                objectFit: 'contain',
                opacity: isHovered ? 1 : 0,
                maxHeight: '400px',
              }}
              priority={true}
              sizes="100%"
              onLoad={e => handleMediaLoad(e.currentTarget)}
              draggable={false}
            />
          ) : (
            // Fallback for other content file types
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Content not supported
              </span>
            </div>
          ))}
      </div>
      <div className="p-4">
        <div className="flex flex-row gap-2 text-black dark:text-white">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          {demoLink && (
            <a href={demoLink} target="_blank" rel="noopener noreferrer">
              <Tooltip content="Demo">
                <div className="hover:rotate-[-10deg] transition-transform duration-300">
                  <RocketLaunch size={24} />
                </div>
              </Tooltip>
            </a>
          )}
          {githubLink && (
            <a href={githubLink} target="_blank" rel="noopener noreferrer">
              <Tooltip content="Code">
                <div className="-mb-[5px]">
                  <GitHubIcon />
                </div>
              </Tooltip>
            </a>
          )}
          {clientLink && (
            <a href={clientLink} target="_blank" rel="noopener noreferrer">
              <Tooltip content="Client">
                <HandHeartIcon />
              </Tooltip>
            </a>
          )}
          {pinned && (
            <Tooltip content="Pinned">
              <div className="text-blue-500 dark:text-blue-400 -mb-[5px]">
                <PushPin size={24} weight="fill" />
              </div>
            </Tooltip>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {[...areas, ...skills].map(area => (
            <span
              key={area}
              className={cn(
                'px-2 py-1 rounded-full cursor-pointer transition-all duration-200 select-none text-xs',
                selectedTags?.includes(area)
                  ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-md'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 hover:scale-105',
                onTagClick && 'hover:shadow-sm'
              )}
              onClick={() => onTagClick?.(area)}
              title={onTagClick ? `Click to filter by ${area}` : undefined}
            >
              #{area}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {endDate
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : formatDate(startDate)}
        </div>
      </div>
    </div>
  );
}
