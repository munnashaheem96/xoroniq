import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FrameLoader } from '../lib/frameLoader';
import { ANIMATION_CONFIG } from '../data/x3Kit';

interface ScrollyCanvasProps {
  frameIndex: number;
  onLoadedChange?: (loaded: number, total: number) => void;
  className?: string;
}

export const ScrollyCanvas: React.FC<ScrollyCanvasProps> = ({
  frameIndex,
  onLoadedChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<FrameLoader>(FrameLoader.getInstance(ANIMATION_CONFIG.frameCount, ANIMATION_CONFIG.framePath));
  const currentRenderedFrameRef = useRef<number>(-1);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Initialize and start preloading
  useEffect(() => {
    const loader = loaderRef.current;

    const unsubscribe = loader.onProgress((loaded, total) => {
      if (onLoadedChange) {
        onLoadedChange(loaded, total);
      }
      if (loaded > 0 && !initialLoaded) {
        setInitialLoaded(true);
      }
    });

    // Tier 1: Milestones
    loader.preloadMilestones().then(() => {
      setInitialLoaded(true);
      // Tier 3: Background preloading
      loader.startBackgroundPreload();
    });

    return () => {
      unsubscribe();
    };
  }, [onLoadedChange, initialLoaded]);

  // Render frame onto canvas with immersive full-bleed stretching and retina scaling
  const drawFrame = useCallback((targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const loader = loaderRef.current;
    const img = loader.getClosestFrame(targetIndex);

    // Preload proximity
    loader.preloadProximity(targetIndex, 20);

    if (!img || !img.complete || img.naturalWidth === 0) {
      loader.loadSingleFrame(targetIndex).then((loadedImg) => {
        if (loadedImg && canvasRef.current) {
          drawFrame(targetIndex);
        }
      });
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const neededWidth = Math.floor(displayWidth * dpr);
    const neededHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== neededWidth || canvas.height !== neededHeight) {
      canvas.width = neededWidth;
      canvas.height = neededHeight;
    }

    // Clear background
    ctx.fillStyle = ANIMATION_CONFIG.canvasBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    // Immersive stretch/cover scale: stretches the frame animation to boldly fill the entire canvas
    const scale = Math.max(canvas.width / imgWidth, canvas.height / imgHeight);
    const drawW = imgWidth * scale;
    const drawH = imgHeight * scale;
    const drawX = (canvas.width - drawW) / 2;
    const drawY = (canvas.height - drawH) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    currentRenderedFrameRef.current = targetIndex;
  }, []);

  useEffect(() => {
    drawFrame(frameIndex);
  }, [frameIndex, drawFrame]);

  useEffect(() => {
    const handleResize = () => {
      drawFrame(frameIndex);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [frameIndex, drawFrame]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#050505] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover pointer-events-none block scale-[1.03]"
        style={{
          backgroundColor: ANIMATION_CONFIG.canvasBg,
        }}
      />

      {/* Subtle vignettes to integrate with text & surrounding sections */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40 opacity-60" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50" />
    </div>
  );
};
