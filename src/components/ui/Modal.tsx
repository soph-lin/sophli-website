"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/misc";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out",
          "max-h-[90vh] overflow-hidden",
          isOpen
            ? "max-h-[90vh] opacity-100 scale-100"
            : "max-h-0 opacity-0 scale-95",
          className
        )}
        onTransitionEnd={handleAnimationEnd}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
