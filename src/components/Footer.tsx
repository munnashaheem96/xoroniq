import React from 'react';
import { soundFx } from '../lib/SoundFx';
import { ArrowUp, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenCheckout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCheckout }) => {
  const scrollToTop = () => {
    soundFx.play('whoosh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-white/10 pt-20 pb-12 px-4 sm:px-8 text-zinc-400 overflow-hidden">
      {/* Subtle red background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-xoroniq-red/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Pre-Footer Call to Action Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-14 border border-white/15 text-center relative overflow-hidden mb-20 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-xoroniq-red/10 border border-xoroniq-red/30 text-xs font-mono tracking-widest text-xoroniq-red uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Worldwide Launch Allocation</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
              Select Your Detailing Package
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 font-light">
              Choose from the X1 Essential (₹399), X2 Advanced (₹599), or X3 Flagship Supreme (₹899). Each system is purpose-built for automotive perfection.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  soundFx.play('open');
                  onOpenCheckout();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-xoroniq-red hover:bg-red-600 font-bold text-xs text-white tracking-widest uppercase shadow-glow-red transition-all"
              >
                Order XORONIQ Packages — From ₹399
              </button>
              <button
                onClick={scrollToTop}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span>Back To Top</span>
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Brand Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-16 border-b border-white/5 text-xs">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="XORONIQ"
                className="h-9 w-auto object-contain brightness-125"
              />
            </div>
            <p className="text-zinc-500 leading-relaxed">
              The flagship reversible scrollytelling automotive detailing collection: X1, X2, and X3. Engineered for automotive connoisseurs.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-white uppercase tracking-wider mb-3 text-[11px]">
              Collection Navigation
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <a href="#tier-comparison" className="hover:text-white transition-colors">
                  X1, X2, X3 Packages
                </a>
              </li>
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Reversible Canvas Story
                </a>
              </li>
              <li>
                <a href="#whats-inside" className="hover:text-white transition-colors">
                  Catalog & Tool Explorer
                </a>
              </li>
              <li>
                <a href="#detailing-workflow" className="hover:text-white transition-colors">
                  4-Step Masterclass
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-white uppercase tracking-wider mb-3 text-[11px]">
              Assurance & Standards
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>100% Scratch-Safe Microfibers</li>
              <li>pH-Neutral Exterior Formulations</li>
              <li>Dedicated Brush Filament Densities</li>
              <li>Complimentary Express Delivery</li>
              <li>30-Day Satisfaction Guarantee</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-white uppercase tracking-wider mb-3 text-[11px]">
              Customer Concierge
            </h4>
            <p className="text-zinc-500 leading-relaxed mb-3">
              For order inquiries, bulk allocations, or product support:
            </p>
            <div className="font-mono text-white font-medium mb-1">
              info@xoroniq.store
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Operational Hours: 24/7 Dispatch Team
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600 font-mono">
          <div>
            &copy; {new Date().getFullYear()} XORONIQ Automotive. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
