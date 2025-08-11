'use client';

import { useEffect, useState } from 'react';
import { random } from '@/utils/misc';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  pulseDelay: number;
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: random([0, 0.1, 0.2, 0.3, 0.4, 0.5]),
      pulseDelay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none transition-opacity duration-500">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-0 animate-star-appear animate-star-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s, ${star.pulseDelay}s`,
          }}
        />
      ))}
    </div>
  );
}
