'use client';

import { useEffect, useState, useRef } from 'react';

interface TypedTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  skip?: boolean;
}

export default function TypedText({
  text,
  speed = 50,
  className = '',
  onComplete,
  skip = false,
}: TypedTextProps) {
  const [displayedText, setDisplayedText] = useState(skip ? text : '');
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // If already completed or should skip, don't reanimate
    if (hasCompletedRef.current || skip) {
      setDisplayedText(text);
      if (onComplete && !hasCompletedRef.current) {
        onComplete();
        hasCompletedRef.current = true;
      }
      return;
    }

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        hasCompletedRef.current = true;
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete, skip]);

  return <div className={className}>{displayedText}</div>;
}
