import React, { useState } from 'react';
import { soundFx } from '../lib/SoundFx';
import { ChevronDown, HelpCircle, FileText } from 'lucide-react';

export const SpecsSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is the XORONIQ X3 kit safe for ceramic-coated or PPF-wrapped cars?',
      a: 'Yes. The formulations and wash mitt in the X3 system are strictly pH-balanced and non-abrasive. They are engineered to clean surfaces safely without degrading ceramic coatings, waxes, or Paint Protection Films (PPF).',
    },
    {
      q: 'How does the 18-piece kit fit inside the X3 Car Care Bag?',
      a: 'The bag features modular internal compartments and elastic retention loops designed to securely hold every brush, sponge, bottle, and towel, preventing any rattling or liquid spillage during driving.',
    },
    {
      q: 'Can the interior brush and AC vent tool scratch gloss piano black trim?',
      a: 'No. The interior detailing brush utilizes ultra-soft feather-tipped synthetic filaments, and the AC brush has padded microfiber blades specifically developed to prevent micro-marring on delicate piano black trims and navigation screens.',
    },
    {
      q: 'How should the microfiber towels and washing glove be cleaned after use?',
      a: 'Machine wash or hand wash with warm water and mild liquid detergent. Do not use fabric softeners or bleach. Air dry or tumble dry on low heat to maintain optimal plush fiber absorbency.',
    },
  ];

  const toggleFaq = (index: number) => {
    soundFx.play('click');
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq-section" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Kit Technical Specifications */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
            <FileText className="w-3.5 h-3.5 text-xoroniq-red" />
            <span>Specifications Summary</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            X3 System Specifications
          </h3>

          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            Every component is rigorously tested to ensure compatibility with all modern automotive paint codes, rims, and interior surfaces.
          </p>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-zinc-400">Total Pieces</span>
              <span className="text-white font-bold">18 Items</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-zinc-400">Chemical Formulations</span>
              <span className="text-white">3 Dedicated Solutions</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-zinc-400">Application Media</span>
              <span className="text-white">4x Towels + 3x Sponges + 1x Mitt</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-zinc-400">Detailing Brushes</span>
              <span className="text-white">5 Specialized Tools</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-zinc-400">Storage Case</span>
              <span className="text-white">Reinforced Carry Bag</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-400">Surface Suitability</span>
              <span className="text-emerald-400 font-bold">100% Paint & PPF Safe</span>
            </div>
          </div>
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-xoroniq-red" />
            <span>Frequently Asked Questions</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight mb-6">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-xoroniq-red/40 bg-white/[0.04]' : 'border-white/5'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-display">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-xoroniq-red transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed border-t border-white/5 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
