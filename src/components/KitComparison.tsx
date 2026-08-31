import React, { useState } from 'react';
import { KIT_TIERS, KitTier } from '../data/x3Kit';
import { soundFx } from '../lib/SoundFx';
import { Sparkles, Check, CheckCircle2, Shield, Flame, Layers, Eye } from 'lucide-react';

interface KitComparisonProps {
  onSelectTier: (tier: KitTier) => void;
}

export const KitComparison: React.FC<KitComparisonProps> = ({ onSelectTier }) => {
  const [selectedTierId, setSelectedTierId] = useState<'x1' | 'x2' | 'x3'>('x3');
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

  const handleSelectTier = (tier: KitTier) => {
    soundFx.play('click');
    setSelectedTierId(tier.id);
    onSelectTier(tier);
  };

  const handleOpenPreview = (e: React.MouseEvent, tier: KitTier) => {
    e.stopPropagation();
    soundFx.play('click');
    setPreviewImage({ src: tier.image, title: tier.name });
  };

  return (
    <section id="tier-comparison" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-xoroniq-red/10 blur-[170px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase mb-4">
          <Layers className="w-3.5 h-3.5 text-xoroniq-red" />
          <span>The Complete Collection // 3 Dedicated Packages</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight">
          Explore The <span className="text-transparent bg-clip-text bg-gradient-to-r from-xoroniq-red via-red-500 to-white">X1 &bull; X2 &bull; X3</span> Lineup
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light">
          Engineered for every detailing routine. From essential 2-brush maintenance to the complete 6-brush flagship system.
        </p>
      </div>

      {/* 3 Tier Cards Grid with Generated High-Res Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
        {KIT_TIERS.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const isX3 = tier.id === 'x3';

          return (
            <div
              key={tier.id}
              onClick={() => handleSelectTier(tier)}
              className={`glass-card rounded-3xl overflow-hidden flex flex-col justify-between cursor-pointer relative transition-all duration-300 ${
                isSelected || isX3
                  ? 'border-xoroniq-red/60 bg-gradient-to-b from-white/[0.08] to-transparent shadow-glow-red md:-translate-y-2'
                  : 'border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
              }`}
            >
              {/* Flagship Badge */}
              {isX3 && (
                <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-xoroniq-red text-white text-[10px] font-mono font-bold tracking-widest uppercase shadow-glow-red flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  <span>Flagship Supreme</span>
                </div>
              )}

              {/* Package Image Banner */}
              <div className="relative w-full h-52 bg-black overflow-hidden group">
                <img
                  src={tier.image}
                  alt={tier.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-black/30" />
                
                {/* View High-Res Image Button */}
                <button
                  onClick={(e) => handleOpenPreview(e, tier)}
                  className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-[10px] font-mono text-zinc-300 hover:text-white flex items-center gap-1 transition-all"
                >
                  <Eye className="w-3 h-3" />
                  <span>Zoom Kit</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400">
                      {tier.tierBadge}
                    </span>
                    <span className="text-xs font-mono font-bold text-xoroniq-red bg-xoroniq-red/10 px-2 py-0.5 rounded border border-xoroniq-red/20">
                      {tier.brushCount} Brushes
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white font-display">
                    {tier.name}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                    {tier.tagline}
                  </p>

                  {/* Pricing */}
                  <div className="my-5 py-3 border-y border-white/10 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      ₹{tier.price}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 line-through">
                      ₹{tier.originalPrice}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 ml-auto">
                      Save ₹{tier.originalPrice - tier.price}
                    </span>
                  </div>

                  {/* Included Items Checklist */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      Package Contents:
                    </div>
                    {tier.items.map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-start justify-between text-xs gap-2 ${
                          item.highlight ? 'text-white font-medium' : 'text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Check
                            className={`w-3.5 h-3.5 flex-shrink-0 ${
                              item.highlight ? 'text-xoroniq-red' : 'text-zinc-500'
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500 flex-shrink-0">
                          {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTier(tier);
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                      isX3
                        ? 'bg-xoroniq-red hover:bg-red-600 text-white shadow-glow-red'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Order {tier.name} — ₹{tier.price}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brush Recruitment Matrix Spotlight */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/15">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-xoroniq-red mb-2">
            <Shield className="w-4 h-4" />
            <span>Brush Recruitment Architecture</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Precision Brush Arsenal by Package
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Understanding why brush count matters: each brush features unique filament geometry designed for specific automotive surfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* X1 Brush List */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-display">X1 Brush Set</span>
              <span className="text-xs font-mono text-zinc-400">2 Tools</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Normal Detailing Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Alloy Cleaning Brush (1x)</li>
            </ul>
          </div>

          {/* X2 Brush List */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-display">X2 Brush Set</span>
              <span className="text-xs font-mono text-zinc-400">4 Tools</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> AC Vent Slotted Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Interior Clean Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Alloy Clean Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" /> Normal Detailing Brush (1x)</li>
            </ul>
          </div>

          {/* X3 Brush List */}
          <div className="p-5 rounded-2xl bg-xoroniq-red/10 border border-xoroniq-red/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-display">X3 Supreme Arsenal</span>
              <span className="text-xs font-mono font-bold text-xoroniq-red">Full 6 Tools</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-200">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-xoroniq-red" /> Normal Detailing Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-xoroniq-red" /> AC Vent Slotted Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-xoroniq-red" /> Alloy Barrel Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-xoroniq-red" /> Interior Feather Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-xoroniq-red" /> Tyre Scrubbing Brush (1x)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-xoroniq-red" /> Wheel Multi-Spoke Brush (1x)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0A0A0C] border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage.src}
              alt={previewImage.title}
              className="w-full h-auto max-h-[75vh] object-contain"
            />
            <div className="p-4 bg-black/80 flex items-center justify-between">
              <span className="font-bold text-white font-display text-lg">
                {previewImage.title} Studio Render
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
