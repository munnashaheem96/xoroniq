import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollyStory } from './components/ScrollyStory';
import { KitExplorer } from './components/KitExplorer';
import { KitComparison } from './components/KitComparison';
import { DetailingWorkflow } from './components/DetailingWorkflow';
import { MaterialScience } from './components/MaterialScience';
import { SpecsSection } from './components/SpecsSection';
import { Footer } from './components/Footer';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { KitItem, KitTier, KIT_TIERS } from './data/x3Kit';

export function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedKitItem, setSelectedKitItem] = useState<KitItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<KitTier | null>(KIT_TIERS[2]);

  const handleOpenCheckout = (tier?: KitTier) => {
    if (tier) {
      setSelectedTier(tier);
    }
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const handleSelectTier = (tier: KitTier) => {
    setSelectedTier(tier);
    setIsCheckoutOpen(true);
  };

  const handleOpenItemModal = (item: KitItem) => {
    setSelectedKitItem(item);
    const el = document.getElementById('whats-inside');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-xoroniq-red selection:text-white">
      {/* Apple-grade Sticky Navigation */}
      <Navbar onOpenCheckout={() => handleOpenCheckout()} />

      {/* Main Scrollytelling & Showcase Experience */}
      <main className="flex-1 w-full">
        {/* Reversible 240-Frame Image Sequence Story Timeline */}
        <ScrollyStory
          onOpenItemModal={handleOpenItemModal}
          onOpenCheckout={() => handleOpenCheckout()}
        />

        {/* Universal Package Explorer with Category & Tier Filters */}
        <KitExplorer
          onOpenCheckout={() => handleOpenCheckout()}
          selectedItem={selectedKitItem}
          onSelectItem={setSelectedKitItem}
        />

        {/* X1 vs X2 vs X3 Supreme Comparison & Brush Recruitment Matrix */}
        <KitComparison onSelectTier={handleSelectTier} />

        {/* 4-Step Detailing Masterclass */}
        <DetailingWorkflow onOpenCheckout={() => handleOpenCheckout()} />

        {/* Material & Engineering Section */}
        <MaterialScience />

        {/* Specifications & FAQ Section */}
        <SpecsSection />
      </main>

      {/* Luxury Customer Footer */}
      <Footer onOpenCheckout={() => handleOpenCheckout()} />

      {/* Luxury Slide-in Checkout & Reservation Drawer */}
      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        selectedTier={selectedTier}
      />
    </div>
  );
}

export default App;
