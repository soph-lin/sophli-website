/*
Opening animation for the galaxy page, where a star swirls around and upon reaching the center, it explodes with particles flying outwards.
Deprecated and doesn't work too well.
*/

import { useEffect, useState, useRef } from 'react';

export default function OpeningAnimation({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [stage, setStage] = useState<
    'initial' | 'spiral' | 'pulse' | 'explode' | 'complete'
  >('initial');

  const position = useRef({
    x: 0,
    y: 100,
    scale: 0.5,
    rotation: 0,
  });

  const pulseAnimationRef = useRef<number | undefined>(undefined);
  const pulseStartTime = useRef<number | undefined>(undefined);

  const [, forceRender] = useState({});

  const animationRef = useRef<number | undefined>(undefined);
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let startTime: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Spiral parameters
      const turns = 3;
      const theta = progress * Math.PI * 2 * turns;

      // Dynamic radius that varies with each turn
      const turnProgress = (theta % (Math.PI * 2)) / (Math.PI * 2);
      const currentTurn = Math.floor(theta / (Math.PI * 2));

      // Radius transition that ends at center
      const maxRadius = 45;
      const radiusProgress = Math.pow(1 - progress, 1.2);
      const baseRadius = maxRadius * radiusProgress;

      // Gentler radius variation that diminishes towards end
      const variationStrength = 1 - progress;
      const radiusVariation =
        Math.sin(turnProgress * Math.PI * 2) * 5 * variationStrength;
      const radius = baseRadius + radiusVariation;

      // Very subtle elliptical distortion
      const ellipsePhase = (currentTurn * Math.PI) / turns;
      const ellipseX =
        1 + 0.15 * Math.sin(turnProgress * Math.PI * 2 + ellipsePhase);
      const ellipseY =
        1 + 0.15 * Math.cos(turnProgress * Math.PI * 2 + ellipsePhase);

      // Calculate position with center point offset
      const centerX = 50;
      const centerY = 50;
      const spiralX = radius * ellipseX * Math.sin(theta);
      const spiralY = radius * ellipseY * Math.cos(theta);

      // Z-dimension calculation (starts far, comes closer)
      const maxZ = 100;
      const minZ = 20;
      const zProgress = Math.pow(progress, 1.5);
      const z = maxZ - (maxZ - minZ) * zProgress;

      // Scale based on z-position and progress
      const baseScale = 0.5 * (maxZ / z);
      const finalApproachScale = Math.pow(progress, 8) * 1.5;
      const scale = baseScale + finalApproachScale;

      // Smoother interpolation from initial position
      const easeInOut =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const x =
        position.current.x * (1 - Math.min(easeInOut * 4, 1)) +
        (centerX + spiralX) * Math.min(easeInOut * 4, 1);
      const y =
        position.current.y * (1 - Math.min(easeInOut * 4, 1)) +
        (centerY - spiralY) * Math.min(easeInOut * 4, 1);

      // Gentler rotation that slows down at end
      const rotationSpeed = 1.5 * (1 - Math.pow(progress, 2));
      const rotation = -(((theta * 180) / Math.PI) * rotationSpeed);

      position.current = { x, y, scale, rotation };
      forceRender({});

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        position.current = { x: 50, y: 50, scale: 1.5, rotation: 0 };
        forceRender({});
      }
    };

    const timeline = async () => {
      await new Promise(r => setTimeout(r, 500));
      setStage('spiral');
      animationRef.current = requestAnimationFrame(animate);
      await new Promise(r => setTimeout(r, duration));

      const pulseDuration = 500;
      const numPulses = 5;
      setStage('pulse');
      await new Promise(r => setTimeout(r, pulseDuration * numPulses));

      setStage('explode');
      await new Promise(r => setTimeout(r, 1500));
      setStage('complete');
      await new Promise(r => setTimeout(r, 500));
      onComplete();
    };

    timeline();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onComplete]);

  useEffect(() => {
    if (stage === 'pulse') {
      const pulseDuration = 1000;
      const numPulses = 3;
      const baseScale = position.current.scale;
      const baseRotation = position.current.rotation;
      const baseX = position.current.x;
      const baseY = position.current.y;
      const targetRotation = baseRotation + 45;

      const animatePulse = (timestamp: number) => {
        if (!pulseStartTime.current) pulseStartTime.current = timestamp;
        const elapsed = timestamp - pulseStartTime.current;
        const progress = Math.min(elapsed / (pulseDuration * numPulses), 1);

        if (progress < 1) {
          const pulseProgress = (elapsed % pulseDuration) / pulseDuration;
          const pulseScale = Math.pow(Math.sin(pulseProgress * Math.PI), 2);
          const scale = baseScale + pulseScale * 0.5;

          // Faster rotation completed in first quarter
          const rotationProgress = Math.min(progress * 4, 1);
          const rotation =
            baseRotation + (targetRotation - baseRotation) * rotationProgress;

          position.current = {
            x: baseX,
            y: baseY,
            scale,
            rotation,
          };
          forceRender({});
          pulseAnimationRef.current = requestAnimationFrame(animatePulse);
        } else {
          setStage('explode');
        }
      };

      pulseAnimationRef.current = requestAnimationFrame(animatePulse);
      return () => {
        if (pulseAnimationRef.current) {
          cancelAnimationFrame(pulseAnimationRef.current);
        }
      };
    }
  }, [stage]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${
        stage === 'complete' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Main star */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="w-full h-full" style={{ pointerEvents: 'none' }}>
          <g
            className={`
              text-white fill-current
              ${stage === 'initial' ? '-translate-y-full' : ''}
              ${stage === 'explode' ? 'animate-star-explode' : ''}
              ${stage === 'complete' ? 'opacity-0' : ''}
              transition-opacity duration-500
            `}
            style={{
              transform:
                stage !== 'complete'
                  ? `translate(calc(${position.current.x}% - 12px), calc(${position.current.y}% - 12px)) scale(${position.current.scale}) rotate(${position.current.rotation}deg)`
                  : undefined,
              filter:
                stage === 'pulse'
                  ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
                  : undefined,
              willChange: 'transform',
            }}
          >
            <path
              className="w-8 h-8"
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            />
          </g>
        </svg>
      </div>

      {/* Explosion particles */}
      {stage === 'explode' && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const angle = Math.random() * 360;
            const distance = 30 + Math.random() * 70;
            const curve = Math.random() > 0.5 ? 1 : -1;
            const drift = curve * (50 + Math.random() * 100);

            return (
              <svg
                key={i}
                className="absolute w-4 h-4 text-white fill-current animate-particle"
                style={
                  {
                    left: '50%',
                    top: '50%',
                    '--particle-angle': `${angle}deg`,
                    '--particle-distance-3': `${distance}vh`,
                    '--particle-drift-x3': `${drift}px`,
                    animationTimingFunction: `cubic-bezier(${
                      0.2 + Math.random() * 0.2
                    }, ${0.7 + Math.random() * 0.2}, ${
                      0.6 + Math.random() * 0.2
                    }, ${0.8 + Math.random() * 0.2})`,
                  } as React.CSSProperties & {
                    '--particle-angle': string;
                    '--particle-distance-3': string;
                    '--particle-drift-x3': string;
                  }
                }
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            );
          })}
        </div>
      )}
    </div>
  );
}
