import { useState, useEffect, useRef, useCallback } from 'react';
import { ANIMATION_CONFIG } from '../data/x3Kit';
import { soundFx } from '../lib/SoundFx';

interface UseScrollFrameOptions {
  totalFrames?: number;
  containerRef: React.RefObject<HTMLElement>;
}

export function useScrollFrame({
  totalFrames = ANIMATION_CONFIG.frameCount,
  containerRef,
}: UseScrollFrameOptions) {
  const [progress, setProgress] = useState<number>(0);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'down' | 'up' | 'idle'>('idle');
  const [isSticky, setIsSticky] = useState<boolean>(false);

  const prevProgressRef = useRef<number>(0);
  const prevFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const updateScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollableDistance = containerRef.current.offsetHeight - windowHeight;

    if (totalScrollableDistance <= 0) return;

    // rect.top is 0 when container starts being sticky
    // rect.top is -totalScrollableDistance when container reaches the end
    const currentScrollY = -rect.top;
    const rawProgress = currentScrollY / totalScrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    // Deterministic reversible frame index mapping
    const targetFrame = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(clampedProgress * (totalFrames - 1)))
    );

    // Direction detection
    let currentDirection: 'down' | 'up' | 'idle' = 'idle';
    if (clampedProgress > prevProgressRef.current + 0.0005) {
      currentDirection = 'down';
    } else if (clampedProgress < prevProgressRef.current - 0.0005) {
      currentDirection = 'up';
    }

    if (targetFrame !== prevFrameRef.current) {
      soundFx.play('tick');
      prevFrameRef.current = targetFrame;
      setFrameIndex(targetFrame);
    }

    prevProgressRef.current = clampedProgress;
    setProgress(clampedProgress);
    setDirection(currentDirection);
    setIsSticky(rawProgress >= 0 && rawProgress <= 1);
  }, [containerRef, totalFrames]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial calculation
    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateScroll]);

  return {
    progress,
    frameIndex,
    direction,
    isSticky,
  };
}
