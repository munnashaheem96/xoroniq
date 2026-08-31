import React from 'react';
import { Shield, Sparkles, Feather, Box, Droplets, Check } from 'lucide-react';

export const MaterialScience: React.FC = () => {
  const pillars = [
    {
      icon: Feather,
      title: 'Surface-Safe Microfiber',
      badge: 'Paint Protection',
      description: 'Plush high-absorption microfiber weave engineered to trap grit deep within the fibers, minimizing surface friction and preventing swirl marks on modern clear coats.',
      benefits: [
        'Edgeless design prevents scratching',
        'High liquid absorption for streak-free drying',
        'Safe on glossy paint, piano black trim & glass',
      ],
    },
    {
      icon: Shield,
      title: 'Multi-Density Bristle Matrix',
      badge: 'Targeted Agitation',
      description: 'Each brush is crafted with specific bristle flexibility tailored to its target surface—from ultra-soft feather tips for delicate infotainment screens to stiff contoured bristles for stubborn tire browning.',
      benefits: [
        'Soft interior brush for scratch-sensitive dash plastics',
        'Deep-barrel wand reaches behind brake calipers',
        'Stiff contoured block removes oxidized rubber oils',
      ],
    },
    {
      icon: Droplets,
      title: 'High-Lubricity Formulations',
      badge: 'Chemical Balance',
      description: 'Our liquid formulas are balanced to emulsify grime and brake dust while delivering a rich lubricated barrier that safeguards existing waxes and ceramic coatings.',
      benefits: [
        'High-foaming wash shampoo lifts dirt away smoothly',
        'Anti-static dashboard cleaner leaves zero greasy glare',
        'Deep wet-look tire polish shields against UV drying',
      ],
    },
    {
      icon: Box,
      title: 'Modular Ballistic Case',
      badge: 'Trunk Organization',
      description: 'Custom-fitted heavy-duty transport bag with reinforced stitching and dedicated compartments so every tool, sponge, bottle, and brush remains secure, clean, and rattle-free in your trunk.',
      benefits: [
        'Dedicated slots for all 18 detailing tools',
        'Reinforced carry handles and heavy-duty zipper',
        'Compact, trunk-friendly footprint',
      ],
    },
  ];

  return (
    <section id="engineering" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-xoroniq-red" />
          <span>Engineering & Craftsmanship</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight">
          Engineered For The <span className="text-transparent bg-clip-text bg-gradient-to-r from-xoroniq-red via-red-500 to-white">Way You Clean</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light">
          Every component in the XORONIQ X3 system is purpose-built to eliminate guesswork and protect your vehicle's delicate surfaces.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 relative overflow-hidden group hover:border-xoroniq-red/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xoroniq-red group-hover:scale-110 group-hover:bg-xoroniq-red group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {pillar.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white font-display mb-3">
                {pillar.title}
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-light">
                {pillar.description}
              </p>

              <div className="space-y-2.5 pt-4 border-t border-white/5">
                {pillar.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-xoroniq-red flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
