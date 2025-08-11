'use client';

import { useEffect, useRef } from 'react';

interface AnimatedRaysProps {
  className?: string;
}

const AnimatedRays = ({ className = '' }: AnimatedRaysProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();

    // Use ResizeObserver for more reliable resizing
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);

    // Also listen to window resize as fallback
    window.addEventListener('resize', resizeCanvas);

    const numberOfRays = 5;
    const rayLength = 30;
    const baseRadius = 20;
    const animationDuration = 2500;
    let startTime: number;
    let animationFrameId: number;

    // Easing function to slow down near center
    const easeInOutSine = (x: number): number => {
      return -(Math.cos(Math.PI * x) - 1) / 2;
    };

    // Hardcoded base angles for 5 rays (in radians)
    const baseAngles = [
      -Math.PI * 0.4, // Left ray (-72 degrees)
      -Math.PI * 0.2, // (-36 degrees)
      0, // Center ray (0 degrees, straight up)
      Math.PI * 0.2, // (36 degrees)
      Math.PI * 0.4, // Right ray (72 degrees)
    ];

    const drawRays = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) % animationDuration;
      const normalizedProgress = progress / animationDuration;

      // Progress curve, hold at full extension
      let drawProgress;
      if (normalizedProgress < 0.4) {
        // Draw out phase with easing
        const phaseProgress = normalizedProgress * 2.5;
        drawProgress = easeInOutSine(phaseProgress);
      } else if (normalizedProgress < 0.7) {
        // Hold phase
        drawProgress = 1;
      } else {
        // Fade out phase with easing
        const phaseProgress = (normalizedProgress - 0.7) * 3.33;
        drawProgress = 1 - easeInOutSine(phaseProgress);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate ray positions
      for (let i = 0; i < numberOfRays; i++) {
        const angle = baseAngles[i];

        const centerX = canvas.width / 2;
        const centerY = canvas.height - 5;

        const startX = centerX - Math.sin(angle) * baseRadius;
        const startY = centerY - Math.cos(angle) * baseRadius;

        const endX =
          centerX - Math.sin(angle) * (rayLength * drawProgress + baseRadius);
        const endY =
          centerY - Math.cos(angle) * (rayLength * drawProgress + baseRadius);

        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        const opacity =
          normalizedProgress >= 0.7
            ? 0.8 * (1 - (normalizedProgress - 0.7) * 3.33)
            : 0.8;

        gradient.addColorStop(0, `rgba(200, 200, 200, ${opacity})`);
        gradient.addColorStop(1, `rgba(200, 200, 200, 0)`);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(drawRays);
    };

    animationFrameId = requestAnimationFrame(drawRays);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default AnimatedRays;
