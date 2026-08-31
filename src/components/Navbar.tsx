import React, { useState, useEffect } from 'react';
import { soundFx } from '../lib/SoundFx';
import { Volume2, VolumeX, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCheckout }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    const unsubscribeSound = soundFx.onMuteChange((muted) => {
      setIsMuted(muted);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeSound();
    };
  }, []);

  const handleNavClick = (id: string) => {
    soundFx.play('click');
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSound = () => {
    soundFx.toggleMute();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-black/75 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo ONLY (Clean & Enlarged) */}
        <div
          onClick={() => handleNavClick('overview')}
          className="flex items-center cursor-pointer group py-1"
        >
          <img
            src="/assets/logo.png"
            alt="XORONIQ"
            className="h-9 sm:h-11 w-auto object-contain brightness-125 group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wide text-zinc-300">
          <button
            onClick={() => handleNavClick('tier-comparison')}
            className="hover:text-white transition-colors text-white font-semibold flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-xoroniq-red" />
            <span>Packages (X1 &bull; X2 &bull; X3)</span>
          </button>
          <button
            onClick={() => handleNavClick('overview')}
            className="hover:text-white transition-colors"
          >
            Story & Unpack
          </button>
          <button
            onClick={() => handleNavClick('whats-inside')}
            className="hover:text-white transition-colors"
          >
            What's Inside
          </button>
          <button
            onClick={() => handleNavClick('detailing-workflow')}
            className="hover:text-white transition-colors"
          >
            Detailing
          </button>
          <button
            onClick={() => handleNavClick('engineering')}
            className="hover:text-white transition-colors"
          >
            Engineering
          </button>
          <button
            onClick={() => handleNavClick('faq-section')}
            className="hover:text-white transition-colors"
          >
            Specifications
          </button>
        </nav>

        {/* Right: Sound Control & CTA */}
        <div className="flex items-center gap-2.5">
          {/* Sound Mute/Unmute Button */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Enable interaction sounds' : 'Mute sounds'}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-mono"
            title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden lg:inline text-[10px] text-zinc-500">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-xoroniq-red animate-pulse" />
                <span className="hidden lg:inline text-[10px] text-zinc-300">Sound ON</span>
              </>
            )}
          </button>

          {/* Explore / Order CTA */}
          <button
            onClick={() => {
              soundFx.play('open');
              onOpenCheckout();
            }}
            className="px-4 sm:px-5 py-2 rounded-full bg-xoroniq-red hover:bg-red-600 text-xs font-semibold text-white tracking-wide shadow-glow-red transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 hidden sm:inline" />
            <span>Order Packages</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-fadeIn">
          <button
            onClick={() => handleNavClick('tier-comparison')}
            className="block w-full text-left py-2 text-sm font-semibold text-white"
          >
            Packages (X1, X2, X3 Lineup)
          </button>
          <button
            onClick={() => handleNavClick('overview')}
            className="block w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Story & Unpack Animation
          </button>
          <button
            onClick={() => handleNavClick('whats-inside')}
            className="block w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            What's Inside (Catalog)
          </button>
          <button
            onClick={() => handleNavClick('detailing-workflow')}
            className="block w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Detailing Masterclass
          </button>
          <button
            onClick={() => handleNavClick('engineering')}
            className="block w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Engineering & Materials
          </button>
          <button
            onClick={() => handleNavClick('faq-section')}
            className="block w-full text-left py-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            Specifications & FAQ
          </button>
        </div>
      )}
    </header>
  );
};
