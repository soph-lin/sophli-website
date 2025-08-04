"use client";

import { useState, useEffect } from "react";
import { cn } from "@/utils/misc";
import {
  allHandles,
  getDiscoveredHandles,
  PullCordHandle,
  getHandleById,
} from "@/utils/handles";
import Modal from "./Modal";

interface VaultProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors = {
  seasonal: "bg-red-100 dark:bg-red-900",
  zoo: "bg-orange-100 dark:bg-orange-900",
  ocean: "bg-blue-100 dark:bg-blue-900",
  household: "bg-green-100 dark:bg-green-900",
  misc: "bg-gray-100 dark:bg-gray-800",
};

const categoryBorders = {
  seasonal: "border-red-300 dark:border-red-600",
  zoo: "border-orange-300 dark:border-orange-600",
  ocean: "border-blue-300 dark:border-blue-600",
  household: "border-green-300 dark:border-green-600",
  misc: "border-gray-300 dark:border-gray-600",
};

export default function Vault({ isOpen, onClose }: VaultProps) {
  const [discoveredHandles, setDiscoveredHandles] = useState<string[]>([]);
  const [selectedHandle, setSelectedHandle] = useState<PullCordHandle | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      setDiscoveredHandles(getDiscoveredHandles());
    }
  }, [isOpen]);

  const handleCardClick = (handleId: string) => {
    const handle = getHandleById(handleId);
    if (handle && discoveredHandles.includes(handleId)) {
      setSelectedHandle(handle);
    }
  };

  const isDiscovered = (handleId: string) =>
    discoveredHandles.includes(handleId);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Handle Vault</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discovered {discoveredHandles.length} of {allHandles.length}{" "}
              handles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
            {allHandles.map((handle) => (
              <div
                key={handle.id}
                onClick={() => handleCardClick(handle.id)}
                className={cn(
                  "relative aspect-square rounded-lg border-2 cursor-pointer transition-all duration-200",
                  "flex items-center justify-center text-4xl",
                  isDiscovered(handle.id)
                    ? cn(
                        categoryColors[handle.category],
                        categoryBorders[handle.category],
                        "hover:scale-105 hover:shadow-lg"
                      )
                    : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-50"
                )}
              >
                {isDiscovered(handle.id) ? (
                  <span>{handle.icon}</span>
                ) : (
                  <div className="w-8 h-8 bg-gray-400 dark:bg-gray-500 rounded-full" />
                )}

                {/* Category indicator */}
                {isDiscovered(handle.id) && (
                  <div className="absolute top-2 right-2">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        handle.category === "seasonal" && "bg-red-400",
                        handle.category === "zoo" && "bg-orange-400",
                        handle.category === "ocean" && "bg-blue-400",
                        handle.category === "household" && "bg-green-400",
                        handle.category === "misc" && "bg-gray-400"
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Handle Detail Modal */}
      <Modal
        isOpen={!!selectedHandle}
        onClose={() => setSelectedHandle(null)}
        className="w-full max-w-md"
      >
        {selectedHandle && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">{selectedHandle.icon}</div>
            <h3 className="text-xl font-semibold">{selectedHandle.message}</h3>
            <div className="flex items-center justify-center gap-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  categoryColors[selectedHandle.category]
                )}
              >
                {selectedHandle.category}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
