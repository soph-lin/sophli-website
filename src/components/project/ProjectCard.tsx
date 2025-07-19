"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { RocketLaunch } from "phosphor-react";
import GitHubIcon from "../icons/GitHubIcon";
import HandHeartIcon from "../icons/HandHeartIcon";
import Tooltip from "../ui/Tooltip";
import { cn } from "@/utils/misc";
import { formatDate } from "@/utils/date";
const NUM_DEFAULT_COVERS = 4;

export interface ProjectCardProps {
  name: string;
  description: string;
  tags: string[];
  startDate: string;
  endDate?: string;
  thumbnail?: string;
  content?: string;
  playThumbnailOnHover?: boolean;
  demoLink?: string;
  githubLink?: string;
  clientLink?: string;
}

export default function ProjectCard({
  name,
  description,
  tags,
  startDate,
  endDate,
  thumbnail,
  content,
  demoLink,
  githubLink,
  clientLink,
  playThumbnailOnHover,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [defaultCoverNumber] = useState(() =>
    Math.floor(Math.random() * NUM_DEFAULT_COVERS)
  );
  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);
  const contentVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (thumbnailVideoRef.current && (playThumbnailOnHover || content)) {
      if (isHovered) {
        thumbnailVideoRef.current.play();
      } else {
        thumbnailVideoRef.current.pause();
        thumbnailVideoRef.current.currentTime = 0;
      }
    }
    if (contentVideoRef.current && isHovered) {
      contentVideoRef.current.play();
    } else if (contentVideoRef.current) {
      contentVideoRef.current.pause();
      contentVideoRef.current.currentTime = 0;
    }
  }, [isHovered, playThumbnailOnHover, content]);

  // Use default cover if no thumbnail and content provided
  const effectiveThumbnail =
    thumbnail || `/project-covers/${defaultCoverNumber}.jpg`;
  const isThumbnailVideo = effectiveThumbnail.toLowerCase().endsWith(".mp4");
  const isContentVideo = content?.toLowerCase().endsWith(".mp4");
  const contentUrl = content || effectiveThumbnail;

  // Handle loading media and set correct aspect ratio
  const handleMediaLoad = (element: HTMLImageElement | HTMLVideoElement) => {
    if (element instanceof HTMLImageElement) {
      setAspectRatio(element.naturalWidth / element.naturalHeight);
    } else if (element instanceof HTMLVideoElement) {
      setAspectRatio(element.videoWidth / element.videoHeight);
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105",
        thumbnail ? "w-full" : "w-80"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative",
          thumbnail
            ? "w-full"
            : "h-80 flex justify-center items-center overflow-hidden"
        )}
        style={{ aspectRatio: thumbnail ? aspectRatio : "auto" }}
      >
        {/* Thumbnail */}
        {isThumbnailVideo ? (
          <video
            src={effectiveThumbnail}
            className={`object-cover transition-opacity duration-300 ${
              isHovered && content ? "opacity-0" : "opacity-100"
            }`}
            ref={thumbnailVideoRef}
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => handleMediaLoad(e.currentTarget)}
          />
        ) : (
          <Image
            src={effectiveThumbnail}
            alt={`${name} thumbnail`}
            fill={!!thumbnail}
            width={!thumbnail ? 320 : undefined}
            height={!thumbnail ? 320 : undefined}
            className={cn(
              "object-cover transition-opacity duration-300",
              isHovered && content ? "opacity-0" : "opacity-100",
              !thumbnail && "!relative"
            )}
            sizes="100%"
            onLoad={(e) => handleMediaLoad(e.currentTarget)}
          />
        )}
        {/* Content */}
        {content &&
          (isContentVideo ? (
            <video
              src={contentUrl}
              className={`absolute inset-0 object-contain transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              ref={contentVideoRef}
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => handleMediaLoad(e.currentTarget)}
            />
          ) : (
            <Image
              src={contentUrl}
              alt={`${name} content`}
              fill
              className={`object-contain transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              style={{ opacity: isHovered ? 1 : 0 }}
              priority={true}
              sizes="100%"
              onLoad={(e) => handleMediaLoad(e.currentTarget)}
            />
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
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full"
            >
              #{tag}
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
