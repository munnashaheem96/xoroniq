export interface KitItem {
  id: string;
  name: string;
  category: 'Cleaners & Polish' | 'Brushes & Tools' | 'Microfiber & Pads' | 'Interior & Fragrance' | 'Kit / Bag';
  tiers: ('x1' | 'x2' | 'x3')[];
  quantity: number;
  badge: string;
  tagline: string;
  description: string;
  usage: string;
  hotspot?: {
    x: number;
    y: number;
    label: string;
  };
}

export interface TierProduct {
  name: string;
  quantity: string | number;
  highlight?: boolean;
}

export interface KitTier {
  id: 'x1' | 'x2' | 'x3';
  name: string;
  tierBadge: string;
  price: number;
  originalPrice: number;
  tagline: string;
  description: string;
  image: string;
  brushCount: number;
  clothCount: string;
  isPopular?: boolean;
  brushes: string[];
  items: TierProduct[];
}

export const ANIMATION_CONFIG = {
  frameCount: 240,
  framePath: '/assets/x3-animation/frames/ezgif-frame-{index}.png',
  aspectRatio: 16 / 9,
  canvasBg: '#050505',
};

export const KIT_TIERS: KitTier[] = [
  {
    id: 'x1',
    name: 'XORONIQ X1',
    tierBadge: 'Essential Kit // 2 Brushes',
    price: 399,
    originalPrice: 599,
    tagline: 'Core Essentials For Fast & Safe Washing',
    description: 'The fundamental entry-level kit equipped with 2 core brushes, large & small microfibers, foam wash shampoo, wash mitt, applicator sponge, and luxury hanging perfume.',
    image: '/assets/packages/x1-package.jpg',
    brushCount: 2,
    clothCount: '2 (Large & Small)',
    brushes: ['Normal Detailing Brush (1x)', 'Alloy Cleaning Brush (1x)'],
    items: [
      { name: 'Microfiber Cloths (Large & Small)', quantity: '2 Pcs' },
      { name: 'Alloy Cleaning Brush', quantity: '1 Pc' },
      { name: 'Normal Detailing Brush', quantity: '1 Pc' },
      { name: 'Washing Shampoo', quantity: '1 Bottle' },
      { name: 'Washing Glove', quantity: '1 Pc' },
      { name: 'Applicator Sponge', quantity: '1 Pc' },
      { name: 'Perfume Hanging Air Purifier', quantity: '1 Pc' },
    ],
  },
  {
    id: 'x2',
    name: 'XORONIQ X2',
    tierBadge: 'Advanced Kit // 4 Brushes',
    price: 599,
    originalPrice: 899,
    tagline: 'Enhanced Cockpit & Wheel Maintenance',
    description: 'Expanded 4-brush suite adding AC vent cleaning and interior precision tools, specialized glass cloth, and tire dressing applicator pad.',
    image: '/assets/packages/x2-package.jpg',
    brushCount: 4,
    clothCount: '3 (L&S + Glass Cloth)',
    brushes: [
      'Normal Detailing Brush (1x)',
      'AC Vent Brush (1x)',
      'Interior Clean Brush (1x)',
      'Alloy Clean Brush (1x)',
    ],
    items: [
      { name: 'Microfiber Cloths (Large & Small)', quantity: '2 Pcs' },
      { name: 'Glass Cleaning Cloth', quantity: '1 Pc', highlight: true },
      { name: 'AC Vent Detailing Brush', quantity: '1 Pc', highlight: true },
      { name: 'Interior Clean Brush', quantity: '1 Pc', highlight: true },
      { name: 'Alloy Clean Brush', quantity: '1 Pc' },
      { name: 'Normal Detailing Brush', quantity: '1 Pc' },
      { name: 'Washing Shampoo', quantity: '1 Bottle' },
      { name: 'Washing Glove', quantity: '1 Pc' },
      { name: 'Tyre Polish Applicator', quantity: '1 Pc', highlight: true },
      { name: 'Applicator Sponge', quantity: '1 Pc' },
      { name: 'Perfume Hanging Air Purifier', quantity: '1 Pc' },
    ],
  },
  {
    id: 'x3',
    name: 'XORONIQ X3',
    tierBadge: 'Flagship Supreme // 6 Brushes',
    price: 899,
    originalPrice: 1299,
    tagline: 'The Complete 6-Brush & Full Chemical Arsenal',
    description: 'The definitive all-in-one automotive care system. Features the complete 6-brush recruitment suite, 4 ultra-soft buffing towels, 3 polishing pads, 3 dedicated formulations, luxury hanging air purifier, and reinforced modular transport bag.',
    image: '/assets/packages/x3-package.jpg',
    brushCount: 6,
    clothCount: '4 Ultra-Plush Towels',
    isPopular: true,
    brushes: [
      'Normal Detailing Brush (1x)',
      'AC Vent Slotted Brush (1x)',
      'Alloy Barrel Brush (1x)',
      'Interior Feather Brush (1x)',
      'Tyre Scrubbing Brush (1x)',
      'Wheel Multi-Spoke Brush (1x)',
    ],
    items: [
      { name: 'Microfiber Buffing Cloths', quantity: '4 Pcs', highlight: true },
      { name: 'Full 6-Brush Recruitment Arsenal', quantity: '6 Brushes', highlight: true },
      { name: 'Wet-Look Tyre Polish', quantity: '1 Bottle', highlight: true },
      { name: 'Dashboard Interior Cleaner', quantity: '1 Bottle', highlight: true },
      { name: 'High-Foam Washing Shampoo', quantity: '1 Bottle' },
      { name: 'Microfiber Washing Glove', quantity: '1 Pc' },
      { name: 'Ergonomic Polishing Sponges', quantity: '3 Pcs', highlight: true },
      { name: 'Perfume Hanging Air Purifier', quantity: '1 Pc' },
      { name: 'X3 Heavy-Duty Ballistic Bag', quantity: '1 Case', highlight: true },
    ],
  },
];

export const KIT_ITEMS: KitItem[] = [
  {
    id: 'x3-bag',
    name: 'X3 Car Care Bag',
    category: 'Kit / Bag',
    tiers: ['x3'],
    quantity: 1,
    badge: 'X3 Exclusive Case',
    tagline: 'Heavy-Duty Reinforced Organizer',
    description: 'Custom-fitted ballistic weave transport bag designed to securely hold all detailing tools and liquid formulations with dedicated internal compartments.',
    usage: 'Keeps the complete detailing system organized, dust-free, and ready in your vehicle trunk.',
    hotspot: { x: 50, y: 72, label: 'X3 Bag' },
  },
  {
    id: 'perfume-hanging-purifier',
    name: 'Perfume Hanging Air Purifier',
    category: 'Interior & Fragrance',
    tiers: ['x1', 'x2', 'x3'],
    quantity: 1,
    badge: 'All Packages (X1, X2, X3)',
    tagline: 'Luxury Long-Lasting Cabin Aromatics',
    description: 'Subtle high-end hanging air purifier infused with clean automotive scent notes that continuously refreshes cockpit ambient air.',
    usage: 'Hang from rearview mirror or place near interior AC vents for consistent fragrance diffusion.',
    hotspot: { x: 50, y: 22, label: 'Air Purifier' },
  },
  {
    id: 'washing-shampoo',
    name: 'Washing Shampoo',
    category: 'Cleaners & Polish',
    tiers: ['x1', 'x2', 'x3'],
    quantity: 1,
    badge: 'All Packages (X1, X2, X3)',
    tagline: 'High-Lubricity Concentrated Formula',
    description: 'Rich foaming wash shampoo formulated to gently encapsulate and lift road grime, brake dust, and surface dirt without stripping existing wax layers.',
    usage: 'Dilute in wash bucket or foam gun; creates an ultra-slick barrier for scratch-free washing.',
    hotspot: { x: 28, y: 38, label: 'Washing Shampoo' },
  },
  {
    id: 'washing-gloves',
    name: 'Washing Gloves',
    category: 'Microfiber & Pads',
    tiers: ['x1', 'x2', 'x3'],
    quantity: 1,
    badge: 'All Packages (X1, X2, X3)',
    tagline: 'Plush Microfiber Wash Mitt',
    description: 'High-density microfiber wash glove designed to trap dirt particles deep within the fibers away from your clear coat, preventing swirl marks.',
    usage: 'Wear on hand while washing exterior body panels from top to bottom.',
    hotspot: { x: 38, y: 28, label: 'Washing Glove' },
  },
  {
    id: 'alloy-wheel-brush',
    name: 'Alloy Wheel Brush',
    category: 'Brushes & Tools',
    tiers: ['x1', 'x2', 'x3'],
    quantity: 1,
    badge: 'In X1, X2, X3',
    tagline: 'Deep-Barrel Rim Cleaning Wand',
    description: 'Long-reach non-abrasive bristles engineered to reach deep into wheel barrels, around brake calipers, and behind complex alloy spoke designs.',
    usage: 'Pair with wheel cleaner to scrub deep inside alloy wheels without scratching rims.',
    hotspot: { x: 18, y: 52, label: 'Alloy Wheel Brush' },
  },
  {
    id: 'normal-detailing-brush',
    name: 'Normal Detailing Brush',
    category: 'Brushes & Tools',
    tiers: ['x1', 'x2', 'x3'],
    quantity: 1,
    badge: 'In X1, X2, X3',
    tagline: 'Versatile Trim & Emblem Brush',
    description: 'Medium-density chemical-resistant brush ideal for badges, window moldings, fuel filler doors, and exterior body seams.',
    usage: 'Agitate cleaner around intricate car emblems, front grilles, and rubber seals.',
    hotspot: { x: 62, y: 58, label: 'Detailing Brush' },
  },
  {
    id: 'ac-detailing-brush',
    name: 'AC Detailing Brush',
    category: 'Brushes & Tools',
    tiers: ['x2', 'x3'],
    quantity: 1,
    badge: 'In X2 & X3',
    tagline: 'Slotted Microfiber & Bristle Vent Tool',
    description: 'Triple-blade slotted cleaning tool engineered to slide between air conditioner louvers and grill slats to collect trapped dust.',
    usage: 'Insert between AC air vent slats to clean top and bottom blades in a single stroke.',
    hotspot: { x: 82, y: 56, label: 'AC Vent Brush' },
  },
  {
    id: 'interior-detailing-brush',
    name: 'Interior Detailing Brush',
    category: 'Brushes & Tools',
    tiers: ['x2', 'x3'],
    quantity: 1,
    badge: 'In X2 & X3',
    tagline: 'Ultra-Soft Feather-Tip Bristles',
    description: 'Delicate soft-bristle brush designed for dusting sensitive piano black trim, instrument clusters, steering wheel switches, and leather seams.',
    usage: 'Use dry to lift dust or lightly damp with Dashboard Cleaner for detailed interior crevices.',
    hotspot: { x: 74, y: 50, label: 'Interior Brush' },
  },
  {
    id: 'tyre-brush',
    name: 'Tyre Brush',
    category: 'Brushes & Tools',
    tiers: ['x3'],
    quantity: 1,
    badge: 'X3 Exclusive Brush',
    tagline: 'Ergonomic Stiff-Bristle Contoured Brush',
    description: 'Heavy-duty contoured bristle block designed to agitate stubborn tire browning, road oils, and old tire dressing off the rubber sidewall.',
    usage: 'Scrub tire sidewalls prior to applying tire polish for maximum dressing adherence.',
    hotspot: { x: 15, y: 68, label: 'Tyre Brush' },
  },
  {
    id: 'wheel-brush',
    name: 'Wheel Brush',
    category: 'Brushes & Tools',
    tiers: ['x3'],
    quantity: 1,
    badge: 'X3 Exclusive Brush',
    tagline: 'Multi-Spoke Face Cleaning Brush',
    description: 'Ergonomic handle with dense soft-tipped bristles crafted for rapid, thorough agitation of outer wheel faces and lug nut cavities.',
    usage: 'Clean the front face of alloy rims and wheel covers safely.',
    hotspot: { x: 25, y: 62, label: 'Wheel Face Brush' },
  },
  {
    id: 'tyre-polish',
    name: 'Tyre Polish',
    category: 'Cleaners & Polish',
    tiers: ['x3'],
    quantity: 1,
    badge: 'X3 Formulation',
    tagline: 'Deep Satin Wet-Look Restorer',
    description: 'Formulated to condition and restore dried rubber, delivering a dark, clean satin sheen while shielding sidewalls from UV fading and cracking.',
    usage: 'Apply onto clean, dry tire sidewall using an applicator pad for an even, sling-free finish.',
    hotspot: { x: 32, y: 55, label: 'Tyre Polish' },
  },
  {
    id: 'dashboard-cleaner',
    name: 'Dashboard Cleaner',
    category: 'Cleaners & Polish',
    tiers: ['x3'],
    quantity: 1,
    badge: 'X3 Formulation',
    tagline: 'Anti-Static Non-Greasy Interior Restorer',
    description: 'Gentle cockpit cleaning spray designed to remove dust, fingerprints, and smudges from dashboard plastics, vinyl, navigation screens, and door cards without greasy glare.',
    usage: 'Spray onto microfiber towel or surface and wipe for an OEM matte finish with UV protection.',
    hotspot: { x: 68, y: 38, label: 'Dashboard Cleaner' },
  },
  {
    id: 'polishing-sponges',
    name: 'Polishing Sponges',
    category: 'Microfiber & Pads',
    tiers: ['x3'],
    quantity: 3,
    badge: 'X3 (3x Pads)',
    tagline: 'Ergonomic Dual-Density Applicator Pads',
    description: 'Three high-resilience foam applicator discs designed for uniform, swirl-free application of waxes, paint sealants, and trim dressings.',
    usage: 'Apply small dollops of polish or protectant and spread in overlapping circular motions.',
    hotspot: { x: 85, y: 68, label: '3x Polishing Pads' },
  },
  {
    id: 'microfiber-cloths',
    name: 'Microfiber Buffing Cloths',
    category: 'Microfiber & Pads',
    tiers: ['x3'],
    quantity: 4,
    badge: 'X3 (4x Towels)',
    tagline: 'Ultra-Soft Edgeless Buffing Towels',
    description: 'Four multi-purpose high-absorption microfiber towels engineered for scratch-free buffing, glass cleaning, drying, and polish residue removal.',
    usage: 'Fold into quarters for multiple clean buffing faces on paint, glass, and interior surfaces.',
    hotspot: { x: 78, y: 28, label: '4x Microfiber Cloths' },
  },
  {
    id: 'glass-cleaning-cloth',
    name: 'Glass Cleaning Cloth',
    category: 'Microfiber & Pads',
    tiers: ['x2'],
    quantity: 1,
    badge: 'X2 Exclusive',
    tagline: 'Waffle-Weave Streak-Free Glass Towel',
    description: 'Specialized lint-free glass microfiber towel designed to leave vehicle windows and windshields crystal clear without streaks or hazing.',
    usage: 'Pair with glass cleaner or dry buff window glass to perfection.',
  },
  {
    id: 'tyre-polish-applicator',
    name: 'Tyre Polish Applicator',
    category: 'Microfiber & Pads',
    tiers: ['x2'],
    quantity: 1,
    badge: 'X2 Applicator',
    tagline: 'Curved Foam Sidewall Dressing Pad',
    description: 'Ergonomically contoured foam applicator pad shaped to match tire curvature for mess-free tire dressing application.',
    usage: 'Apply tire dressing evenly across the sidewall without getting product on alloy rims.',
  },
  {
    id: 'applicator-sponge',
    name: 'Applicator Sponge',
    category: 'Microfiber & Pads',
    tiers: ['x1', 'x2'],
    quantity: 1,
    badge: 'X1 & X2 Applicator',
    tagline: 'Multi-Surface Dense Foam Sponge',
    description: 'High-density foam pad for manual wax spreading, interior conditioning, and general trim application.',
    usage: 'Evenly distribute shampoo or protectant across vehicle surfaces.',
  },
];

export interface DetailingStep {
  stepNumber: string;
  title: string;
  phase: string;
  description: string;
  pairedProducts: string[];
  tips: string[];
}

export const DETAILING_STEPS: DetailingStep[] = [
  {
    stepNumber: '01',
    title: 'Pre-Wash & Foam Lift',
    phase: 'Exterior Foundation',
    description: 'Break down tough surface contaminants, road salt, and dirt layers without inducing clear-coat scratches.',
    pairedProducts: ['Washing Shampoo', 'Washing Gloves'],
    tips: [
      'Always wash in the shade on cool paintwork.',
      'Work from the roof downward to avoid pushing lower grime up.',
      'Rinse wash mitt frequently in clean water bucket.',
    ],
  },
  {
    stepNumber: '02',
    title: 'Deep Wheels & Tyre Restore',
    phase: 'Running Gear',
    description: 'Decontaminate brake dust embedded inside alloy barrels and rejuvenate oxidized brown tire sidewalls.',
    pairedProducts: ['Alloy Wheel Brush', 'Tyre Brush', 'Wheel Brush', 'Tyre Polish'],
    tips: [
      'Clean wheels before paintwork so brake dust does not splash onto clean body panels.',
      'Scrub tires until suds turn white, ensuring optimal dressing adhesion.',
      'Allow tire polish to dry before driving to eliminate sling.',
    ],
  },
  {
    stepNumber: '03',
    title: 'Precision Cockpit Detailing',
    phase: 'Interior Refresh & Aromatics',
    description: 'Restore dashboard, console screens, and AC vents to a factory-fresh finish, completed with our signature hanging air purifier.',
    pairedProducts: ['Dashboard Cleaner', 'AC Detailing Brush', 'Interior Detailing Brush', 'Perfume Hanging Air Purifier'],
    tips: [
      'Spray cleaner onto the brush or cloth rather than directly on electronics.',
      'Use the slotted AC brush to dust delicate vent louvers safely.',
      'Hang the air purifier from the mirror or vent for continuous luxury aroma.',
    ],
  },
  {
    stepNumber: '04',
    title: 'Mirror Finish',
    phase: 'Paint Perfection & Protection',
    description: 'Seal the paintwork, lock in gloss, and buff all glass and body panels to an ultra-slick showroom reflection.',
    pairedProducts: ['Polishing Sponges', 'Microfiber Buffing Cloths'],
    tips: [
      'Apply wax or polish thinly and evenly in straight or circular lines.',
      'Buff off using a clean, dry microfiber cloth folded in quarters.',
      'Check reflection under multiple light angles to ensure no residue remains.',
    ],
  },
];
