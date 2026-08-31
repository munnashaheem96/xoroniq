import React, { useRef, useState } from 'react';
import { useScrollFrame } from '../hooks/useScrollFrame';
import { ScrollyCanvas } from './ScrollyCanvas';
import { ANIMATION_CONFIG, KIT_ITEMS, KitItem } from '../data/x3Kit';
import { soundFx } from '../lib/SoundFx';
import { ChevronDown, Sparkles, X, ArrowUpRight, ShieldCheck, Compass } from 'lucide-react';

interface ScrollyStoryProps {
  onOpenItemModal?: (item: KitItem) => void;
  onOpenCheckout?: () => void;
}

export const ScrollyStory: React.FC<ScrollyStoryProps> = ({
  onOpenItemModal,
  onOpenCheckout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, frameIndex, direction } = useScrollFrame({
    totalFrames: ANIMATION_CONFIG.frameCount,
    containerRef,
  });

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState<KitItem | null>(null);

  // Helper function to calculate phase opacity & transform
  const getPhaseStyle = (start: number, peakStart: number, peakEnd: number, end: number) => {
    let opacity = 0;
    let translateY = 20;

    if (progress >= start && progress < peakStart) {
      const factor = (progress - start) / (peakStart - start);
      opacity = factor;
      translateY = 20 * (1 - factor);
    } else if (progress >= peakStart && progress <= peakEnd) {
      opacity = 1;
      translateY = 0;
    } else if (progress > peakEnd && progress <= end) {
      const factor = (end - progress) / (end - peakEnd);
      opacity = factor;
      translateY = -20 * (1 - factor);
    }

    return {
      opacity,
      transform: `translate3d(0, ${translateY}px, 0)`,
      pointerEvents: (opacity > 0.4 ? 'auto' : 'none') as 'auto' | 'none',
      visibility: (opacity > 0.01 ? 'visible' : 'hidden') as 'visible' | 'hidden',
    };
  };

  // Hotspots are active during the exploded phase (85% to 100%)
  const isExplodedPhase = progress >= 0.84;
  const hotspotItems = KIT_ITEMS.filter((item) => item.hotspot);

  const handleHotspotClick = (item: KitItem, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.play('click');
    setActiveHotspot(item);
  };

  return (
    <div
      ref={containerRef}
      id="overview"
      className="relative w-full bg-[#050505]"
      style={{ height: '550vh' }}
    >
      {/* Sticky Canvas & Story Viewport */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background HTML5 Canvas */}
        <ScrollyCanvas
          frameIndex={frameIndex}
          onLoadedChange={(loaded) => setLoadedCount(loaded)}
          className="absolute inset-0 z-0"
        />

        {/* Ambient Subtle Grid & Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none subtle-grid opacity-30 z-[1]" />
        <div className="absolute inset-0 pointer-events-none radial-vignette z-[2]" />

        {/* HUD: Frame Counter & Scrolly Timeline */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono tracking-wider text-zinc-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-xoroniq-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-xoroniq-red"></span>
            </span>
            <span className="text-white font-medium">
              FRAME {String(frameIndex + 1).padStart(3, '0')}
            </span>
            <span className="text-zinc-600">/</span>
            <span>{ANIMATION_CONFIG.frameCount}</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300">{(progress * 100).toFixed(0)}%</span>
            {direction !== 'idle' && (
              <span className="text-xoroniq-red font-semibold uppercase tracking-widest text-[10px]">
                {direction === 'down' ? '↓ UNPACKING' : '↑ REPACKING'}
              </span>
            )}
          </div>
          {loadedCount < ANIMATION_CONFIG.frameCount && (
            <div className="text-[10px] text-zinc-500 font-mono pl-2">
              Buffering 4K frames: {Math.round((loadedCount / ANIMATION_CONFIG.frameCount) * 100)}%
            </div>
          )}
        </div>

        {/* Scroll Progress Bar at the very top of sticky viewport */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-30">
          <div
            className="h-full bg-gradient-to-r from-xoroniq-red via-red-500 to-xoroniq-red transition-all duration-75"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* ========================================================================= */}
        {/* STORY CHAPTER OVERLAYS */}
        {/* ========================================================================= */}

        {/* 01 — HERO (0–15%) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-between p-8 md:p-16 z-10 text-center transition-all duration-300 pointer-events-none"
          style={getPhaseStyle(0.0, 0.0, 0.12, 0.16)}
        >
          {/* Top Tagline */}
          <div className="pt-20 md:pt-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs tracking-widest uppercase text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-xoroniq-red" />
              <span>The XORONIQ Detailing Collection &bull; X1 &bull; X2 &bull; X3</span>
            </div>
          </div>

          {/* Center Brand Title */}
          <div className="max-w-4xl px-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white uppercase font-display leading-none drop-shadow-2xl">
              PRECISION <span className="text-transparent bg-clip-text bg-gradient-to-r from-xoroniq-red via-red-500 to-white">CAR CARE</span>
            </h1>
            <p className="mt-4 md:mt-6 text-xl sm:text-2xl md:text-3xl font-light text-zinc-200 tracking-tight">
              Three Packages. One Uncompromising Standard.
            </p>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-lg mx-auto font-light">
              Explore the X1 Essential, X2 Advanced, and X3 Supreme Detailing Systems.
            </p>
          </div>

          {/* Bottom Scroll Prompt */}
          <div className="pb-10 flex flex-col items-center gap-2 text-zinc-500 text-xs tracking-widest uppercase animate-bounce">
            <span>Scroll To Unpack Collection</span>
            <ChevronDown className="w-4 h-4 text-xoroniq-red" />
          </div>
        </div>

        {/* 02 — THE KIT OPENS (15–30%) */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-20 z-10 transition-all duration-300"
          style={getPhaseStyle(0.16, 0.20, 0.28, 0.32)}
        >
          <div className="max-w-xl bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="text-xs font-mono text-xoroniq-red font-semibold tracking-widest uppercase mb-2">
              X1 Essential // Core Foundation
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              Start with the essentials.
            </h2>
            <div className="w-12 h-1 bg-xoroniq-red my-4" />
            <p className="text-lg sm:text-xl font-medium text-zinc-200 mb-2">
              Clean. Restore. Protect.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every package includes our core foundation: high-lubricity foam wash shampoo, scratch-free wash glove, dense applicator, and signature hanging perfume purifier.
            </p>
          </div>
        </div>

        {/* 03 — EXTERIOR CARE (30–50%) */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-end p-8 md:p-20 z-10 transition-all duration-300"
          style={getPhaseStyle(0.32, 0.36, 0.46, 0.50)}
        >
          <div className="max-w-xl bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl text-right">
            <div className="text-xs font-mono text-xoroniq-red font-semibold tracking-widest uppercase mb-2">
              Phase 02 // Exterior Formulation
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              Built for a better finish.
            </h2>
            <div className="w-12 h-1 bg-xoroniq-red my-4 ml-auto" />
            <p className="text-lg sm:text-xl font-medium text-zinc-200 mb-2">
              Purpose-built tools for washing, polishing and finishing.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              High-lubricity foam shampoo encapsulates grime, paired with our plush scratch-free microfiber wash mitt to protect delicate clear coat finishes.
            </p>
          </div>
        </div>

        {/* 04 — DETAILING (50–70%) */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-20 z-10 transition-all duration-300"
          style={getPhaseStyle(0.50, 0.54, 0.66, 0.70)}
        >
          <div className="max-w-xl bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="text-xs font-mono text-xoroniq-red font-semibold tracking-widest uppercase mb-2">
              X2 Advanced // Cockpit & Glass
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              Detail every surface.
            </h2>
            <div className="w-12 h-1 bg-xoroniq-red my-4" />
            <p className="text-lg sm:text-xl font-medium text-zinc-200 mb-2">
              From the largest panels to the smallest spaces.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Elevate to 4 precision brushes including dedicated AC air vent wands, interior feather bristles, glass towels, and curved tire dressing applicators.
            </p>
          </div>
        </div>

        {/* 05 — WHEELS & TYRES (70–85%) */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-end p-8 md:p-20 z-10 transition-all duration-300"
          style={getPhaseStyle(0.70, 0.74, 0.82, 0.85)}
        >
          <div className="max-w-xl bg-black/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl text-right">
            <div className="text-xs font-mono text-xoroniq-red font-semibold tracking-widest uppercase mb-2">
              X3 Supreme // Deep Wheel & Rubber Suite
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              Go deeper.
            </h2>
            <div className="w-12 h-1 bg-xoroniq-red my-4 ml-auto" />
            <p className="text-lg sm:text-xl font-medium text-zinc-200 mb-2">
              Designed to reach the details others miss.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The flagship X3 unlocks the complete 6-brush recruitment suite with deep-barrel alloy rim wands, contoured tire scrubbers, multi-spoke face brushes, and satin tire polish.
            </p>
          </div>
        </div>

        {/* 06 — COMPLETE EXPLODED VIEW (85–100%) */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 md:p-14 z-10 pointer-events-none transition-all duration-300"
          style={getPhaseStyle(0.85, 0.88, 1.0, 1.0)}
        >
          {/* Top Header Card */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto bg-black/70 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/10 max-w-5xl mx-auto shadow-2xl mt-12 md:mt-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-xoroniq-red font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-xoroniq-red" />
                Exploded Architecture // X1 &bull; X2 &bull; X3
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
                Three Packages. One Complete Ecosystem.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                From the 7-piece X1 to the 18-piece X3 flagship. Tap any pulsing marker to inspect individual tools.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundFx.play('click');
                  const el = document.getElementById('tier-comparison');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-white transition-all flex items-center gap-1.5"
              >
                <span>Compare X1-X3</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  soundFx.play('open');
                  if (onOpenCheckout) onOpenCheckout();
                }}
                className="px-5 py-2.5 rounded-xl bg-xoroniq-red hover:bg-red-600 text-xs font-semibold text-white tracking-wide shadow-glow-red transition-all"
              >
                Order Packages
              </button>
            </div>
          </div>

          {/* Bottom Prompt / Reversibility Hint */}
          <div className="text-center pb-2 pointer-events-auto">
            <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-zinc-400">
              <Compass className="w-3.5 h-3.5 text-xoroniq-red" />
              <span>Scroll up at any time to watch the system pack itself back into the bag.</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE HOTSPOTS (Active during exploded phase 85% - 100%) */}
        {/* ========================================================================= */}
        {isExplodedPhase && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {hotspotItems.map((item) => {
              if (!item.hotspot) return null;
              return (
                <div
                  key={item.id}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${item.hotspot.x}%`,
                    top: `${item.hotspot.y}%`,
                  }}
                >
                  {/* Hotspot Pin Button */}
                  <button
                    onClick={(e) => handleHotspotClick(item, e)}
                    className="relative flex items-center justify-center p-2 focus:outline-none"
                    aria-label={`Inspect ${item.name}`}
                  >
                    <span className="absolute h-8 w-8 rounded-full bg-xoroniq-red/30 animate-ping" />
                    <span className="relative flex h-5 w-5 rounded-full bg-xoroniq-red border-2 border-white shadow-glow-red items-center justify-center text-[9px] font-bold text-white transition-transform group-hover:scale-125">
                      +
                    </span>
                  </button>

                  {/* Hotspot Label Tooltip (Desktop Hover) */}
                  <div className="hidden md:block absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                    <div className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs font-medium text-white shadow-xl flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-xoroniq-red" />
                      <span>{item.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">({item.quantity}x)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Hotspot Modal / Floating Drawer */}
        {activeHotspot && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
            onClick={() => setActiveHotspot(null)}
          >
            <div
              className="relative w-full max-w-md bg-[#0A0A0C] border border-white/15 rounded-2xl p-6 shadow-2xl text-left glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  soundFx.play('click');
                  setActiveHotspot(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-block px-2.5 py-1 rounded bg-xoroniq-red/10 border border-xoroniq-red/30 text-xoroniq-red text-xs font-mono font-semibold uppercase mb-2">
                {activeHotspot.category}
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-2xl font-bold text-white font-display">
                  {activeHotspot.name}
                </h4>
                <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded">
                  Qty: {activeHotspot.quantity}
                </span>
              </div>

              <p className="text-sm font-medium text-zinc-300 mt-1">
                {activeHotspot.tagline}
              </p>

              <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                {activeHotspot.description}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  How To Use
                </div>
                <div className="text-xs text-zinc-300">
                  {activeHotspot.usage}
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    const item = activeHotspot;
                    setActiveHotspot(null);
                    if (onOpenItemModal) onOpenItemModal(item);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all text-center"
                >
                  Full Details
                </button>
                <button
                  onClick={() => {
                    setActiveHotspot(null);
                    if (onOpenCheckout) onOpenCheckout();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-xoroniq-red hover:bg-red-600 text-xs font-semibold text-white tracking-wide transition-all shadow-glow-red text-center"
                >
                  Order Packages
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
