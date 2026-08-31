import React, { useState } from 'react';
import { KIT_ITEMS, KitItem } from '../data/x3Kit';
import { soundFx } from '../lib/SoundFx';
import { Sparkles, Layers, ShieldCheck, CheckCircle2, X, Search, Info, Package } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cleaners & Polish',
  'Brushes & Tools',
  'Microfiber & Pads',
  'Interior & Fragrance',
  'Kit / Bag',
] as const;

interface KitExplorerProps {
  onOpenCheckout?: () => void;
  selectedItem?: KitItem | null;
  onSelectItem?: (item: KitItem | null) => void;
}

export const KitExplorer: React.FC<KitExplorerProps> = ({
  onOpenCheckout,
  selectedItem,
  onSelectItem,
}) => {
  const [activePackage, setActivePackage] = useState<'all' | 'x1' | 'x2' | 'x3'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalItem, setModalItem] = useState<KitItem | null>(selectedItem || null);

  const filteredItems = KIT_ITEMS.filter((item) => {
    const matchesPackage = activePackage === 'all' || item.tiers.includes(activePackage);
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPackage && matchesCategory && matchesSearch;
  });

  const totalPieces = KIT_ITEMS.reduce((sum, item) => sum + item.quantity, 0);

  const handlePackageChange = (pkg: 'all' | 'x1' | 'x2' | 'x3') => {
    soundFx.play('click');
    setActivePackage(pkg);
  };

  const handleCategoryChange = (cat: string) => {
    soundFx.play('click');
    setActiveCategory(cat);
  };

  const handleOpenItem = (item: KitItem) => {
    soundFx.play('click');
    setModalItem(item);
    if (onSelectItem) onSelectItem(item);
  };

  const handleCloseModal = () => {
    soundFx.play('click');
    setModalItem(null);
    if (onSelectItem) onSelectItem(null);
  };

  return (
    <section id="whats-inside" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-xoroniq-red/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase mb-4">
          <Layers className="w-3.5 h-3.5 text-xoroniq-red" />
          <span>Universal Tool & Chemical Catalog</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight">
          What's Inside <span className="text-transparent bg-clip-text bg-gradient-to-r from-xoroniq-red via-red-500 to-white">The Packages</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light">
          Browse every tool, brush geometry, applicator, and liquid formulation across the X1, X2, and X3 systems.
        </p>
      </div>

      {/* Package Tier Filter Selector */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 p-2 bg-white/[0.03] border border-white/10 rounded-2xl max-w-2xl mx-auto">
        <button
          onClick={() => handlePackageChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activePackage === 'all'
              ? 'bg-xoroniq-red text-white font-bold shadow-glow-red'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All Items ({totalPieces} Pcs)
        </button>
        <button
          onClick={() => handlePackageChange('x1')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activePackage === 'x1'
              ? 'bg-xoroniq-red text-white font-bold shadow-glow-red'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          X1 Essential (7 Pcs)
        </button>
        <button
          onClick={() => handlePackageChange('x2')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activePackage === 'x2'
              ? 'bg-xoroniq-red text-white font-bold shadow-glow-red'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          X2 Advanced (11 Pcs)
        </button>
        <button
          onClick={() => handlePackageChange('x3')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activePackage === 'x3'
              ? 'bg-xoroniq-red text-white font-bold shadow-glow-red'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          X3 Supreme (18 Pcs)
        </button>
      </div>

      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((category) => {
            const count =
              category === 'All'
                ? filteredItems.length
                : filteredItems.filter((i) => i.category === category).length;

            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold border border-white/30'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5'
                }`}
              >
                <span>{category}</span>
                <span className="text-[10px] px-1 py-0.2 rounded-full font-mono bg-white/10 text-zinc-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tools or liquids..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 hover:bg-white/[0.07] focus:bg-white/10 border border-white/10 focus:border-xoroniq-red/50 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenItem(item)}
            className="group glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            {/* Top Row: Category & Tiers Badge */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-xoroniq-red bg-xoroniq-red/10 px-2 py-0.5 rounded border border-xoroniq-red/20">
                  {item.badge}
                </span>
                <div className="flex gap-1">
                  {item.tiers.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-bold text-white font-display tracking-tight group-hover:text-red-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs font-medium text-zinc-400 mt-1">
                {item.tagline}
              </p>

              {/* Description snippet */}
              <p className="text-xs text-zinc-500 mt-3 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-zinc-400" />
                <span>Usage & Tips</span>
              </span>
              <span className="text-white group-hover:text-xoroniq-red transition-colors font-medium">
                Inspect &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-zinc-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p className="text-base font-medium text-zinc-400">No matching items found for this selection.</p>
          <p className="text-xs text-zinc-600 mt-1">Try resetting the package tier filter or search query.</p>
        </div>
      )}

      {/* Item Detail Modal */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-lg bg-[#0A0A0C] border border-white/20 rounded-3xl p-8 shadow-2xl glass-card text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded bg-xoroniq-red/15 border border-xoroniq-red/30 text-xoroniq-red text-xs font-mono font-semibold uppercase">
                {modalItem.category}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-zinc-300 text-xs font-mono">
                Included in: {modalItem.tiers.map((t) => t.toUpperCase()).join(', ')}
              </span>
            </div>

            <h3 className="text-3xl font-extrabold text-white font-display">
              {modalItem.name}
            </h3>
            <p className="text-sm font-medium text-zinc-300 mt-1">
              {modalItem.tagline}
            </p>

            <div className="my-6 h-[1px] bg-white/10" />

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-xoroniq-red" />
                  Product Purpose & Design
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {modalItem.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Recommended Application
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {modalItem.usage}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all text-center"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  handleCloseModal();
                  if (onOpenCheckout) onOpenCheckout();
                }}
                className="flex-1 py-3 rounded-xl bg-xoroniq-red hover:bg-red-600 text-xs font-semibold text-white tracking-wide transition-all shadow-glow-red flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Order Package</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
