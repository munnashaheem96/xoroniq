import React, { useState, useEffect } from 'react';
import { KIT_TIERS, KitTier } from '../data/x3Kit';
import { soundFx } from '../lib/SoundFx';
import { openRazorpayCheckout } from '../lib/razorpay';
import { saveOrderToFirebase, StructuredShippingAddress } from '../lib/firebase';
import {
  X,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  CheckCircle,
  CreditCard,
  Lock,
  MapPin,
  Building,
  Home,
  Briefcase,
  Phone,
  Mail,
  User,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Chandigarh',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
];

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier?: KitTier | null;
}

export const CheckoutDrawer: React.FC<CheckoutDrawerProps> = ({
  isOpen,
  onClose,
  selectedTier,
}) => {
  const [activeTier, setActiveTier] = useState<KitTier>(selectedTier || KIT_TIERS[2]);
  const [quantity, setQuantity] = useState<number>(1);

  // Customer Details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [alternatePhone, setAlternatePhone] = useState<string>('');

  // Detailed Structured Shipping Address
  const [houseNo, setHouseNo] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('Maharashtra');
  const [pincode, setPincode] = useState<string>('');
  const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentId, setPaymentId] = useState<string>('');
  const [firebaseOrderId, setFirebaseOrderId] = useState<string>('');
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTier) {
      setActiveTier(selectedTier);
    }
  }, [selectedTier]);

  if (!isOpen) return null;

  const unitPrice = activeTier.price;
  const totalPrice = unitPrice * quantity;

  const handleIncrement = () => {
    soundFx.play('click');
    setQuantity((q) => Math.min(5, q + 1));
  };

  const handleDecrement = () => {
    soundFx.play('click');
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleTierChange = (tier: KitTier) => {
    soundFx.play('click');
    setActiveTier(tier);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.play('click');
    setIsSubmitting(true);

    const formattedAddress = `${houseNo}, ${street}${landmark ? ', Near ' + landmark : ''}, ${city}, ${state} - ${pincode} (${addressType})`;

    const structuredAddress: StructuredShippingAddress = {
      houseNo,
      street,
      landmark: landmark || undefined,
      city,
      state,
      pincode,
      addressType,
      deliveryNotes: deliveryNotes || undefined,
      formattedAddress,
    };

    // Trigger Razorpay Payment Gateway
    openRazorpayCheckout({
      packageName: `${quantity}x ${activeTier.name}`,
      amountInRupees: totalPrice,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone || '9999999999',
      address: formattedAddress,
      onSuccess: async (res) => {
        setPaymentId(res.razorpay_payment_id);

        // Save order and detailed shipping address to Firebase Firestore
        const fbId = await saveOrderToFirebase({
          packageName: activeTier.name,
          packageId: activeTier.id,
          quantity: quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          alternatePhone: alternatePhone || undefined,
          shippingDetails: structuredAddress,
          razorpayPaymentId: res.razorpay_payment_id,
          status: 'PAID',
        });

        if (fbId) {
          setFirebaseOrderId(fbId);
        }

        setIsSubmitting(false);
        setIsOrderPlaced(true);
        soundFx.play('chime');
      },
      onError: (err) => {
        console.warn('Razorpay checkout status:', err);
        setIsSubmitting(false);
      },
    });
  };

  const handleClose = () => {
    soundFx.play('click');
    setIsOrderPlaced(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0A0A0C] border-l border-white/15 h-full flex flex-col justify-between overflow-y-auto p-6 sm:p-10 shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-xoroniq-red font-semibold mb-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Razorpay &bull; Firebase Secured Checkout</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Reserve Your XORONIQ Package
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {!isOrderPlaced ? (
          <form onSubmit={handleSubmit} className="flex-1 py-6 space-y-6">
            {/* Tier Selector Pills */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                1. Choose Package Tier:
              </div>
              <div className="grid grid-cols-3 gap-2">
                {KIT_TIERS.map((tier) => {
                  const isSelected = activeTier.id === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleTierChange(tier)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-xoroniq-red text-white border-xoroniq-red font-bold shadow-glow-red'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                      }`}
                    >
                      <div className="text-xs font-display">{tier.name}</div>
                      <div className="text-[11px] font-mono opacity-90">₹{tier.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Card with Package Image */}
            <div className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 rounded-xl bg-black border border-white/10 overflow-hidden flex-shrink-0">
                  <img
                    src={activeTier.image}
                    alt={activeTier.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-display">
                    {activeTier.name}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {activeTier.brushCount} Brushes &bull; {activeTier.clothCount}
                  </p>
                  <div className="text-xs font-mono text-xoroniq-red font-semibold mt-1">
                    ₹{activeTier.price} <span className="text-zinc-500 line-through text-[11px]">₹{activeTier.originalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm disabled:opacity-30"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-mono font-bold text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= 5}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-xoroniq-red" />
                <span>2. Contact Information</span>
              </div>
              <input
                type="text"
                placeholder="Full Name (Receiver's Name) *"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="Email Address (for Invoice) *"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="tel"
                    placeholder="Mobile / WhatsApp Number *"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
                  />
                </div>
              </div>
              <input
                type="tel"
                placeholder="Alternative Phone Number (Optional)"
                value={alternatePhone}
                onChange={(e) => setAlternatePhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
              />
            </div>

            {/* Section 3: Detailed Structured Shipping Address */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-xoroniq-red" />
                  <span>3. Detailed Shipping Address</span>
                </span>
                <span className="text-[10px] text-zinc-500">All India Courier Delivery</span>
              </div>

              {/* Address Type Selector */}
              <div className="grid grid-cols-3 gap-2">
                {(['Home', 'Office', 'Other'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      addressType === type
                        ? 'bg-white/15 border-white/30 text-white font-semibold'
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {type === 'Home' && <Home className="w-3 h-3 text-xoroniq-red" />}
                    {type === 'Office' && <Briefcase className="w-3 h-3 text-blue-400" />}
                    {type === 'Other' && <Building className="w-3 h-3 text-zinc-400" />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>

              {/* Flat / House No / Building */}
              <input
                type="text"
                placeholder="Flat / House No. / Building / Floor / Company *"
                required
                value={houseNo}
                onChange={(e) => setHouseNo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
              />

              {/* Area / Street / Sector */}
              <input
                type="text"
                placeholder="Area / Street / Sector / Colony *"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
              />

              {/* Landmark & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Famous Landmark (e.g. Near Metro / Mall)"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
                />
                <input
                  type="text"
                  placeholder="Town / City *"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
                />
              </div>

              {/* State & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#111115] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-xoroniq-red transition-colors cursor-pointer"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="PIN Code (6 Digits) *"
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  title="Please enter a valid 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
                />
              </div>

              {/* Delivery Instructions (Optional) */}
              <input
                type="text"
                placeholder="Delivery Notes (e.g. Call before delivery / Gate drop)"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
              />
            </div>

            {/* Payment Methods Supported Badge */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/20 via-black to-blue-950/20 border border-blue-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>UPI, GPay, PhonePe, Cards & NetBanking</span>
              </div>
              <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                Razorpay + Firebase
              </span>
            </div>

            {/* Shipping & Guarantee Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5 text-xs text-zinc-300">
                <Truck className="w-4 h-4 text-xoroniq-red flex-shrink-0" />
                <span>Free Express Delivery Across India</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5 text-xs text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Guaranteed Safe Delivery</span>
              </div>
            </div>

            {/* Price & Razorpay Checkout Action */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-400">Total Payable Amount:</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    ₹{totalPrice}
                  </span>
                  <div className="text-[10px] text-emerald-400 font-mono">Free Express Delivery Included</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-xoroniq-red hover:bg-red-600 font-bold text-sm text-white tracking-wide shadow-glow-red transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Gateway & Database...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Pay with Razorpay — ₹{totalPrice}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Order Confirmation View */
          <div className="flex-1 py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-1">
                Payment Verified // Order Placed
              </div>
              <h4 className="text-3xl font-extrabold text-white font-display">
                Thank You, {fullName || 'Valued Detailer'}
              </h4>
              <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
                Your <span className="text-white font-medium">{activeTier.name}</span> Package has been secured via Razorpay and logged in our Firebase system. A tracking notification will be sent to <span className="text-white font-medium">{email || 'your email'}</span> and <span className="text-white font-medium">{phone}</span>.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left w-full max-w-md space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Razorpay Payment ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{paymentId || 'pay_demo_9824'}</span>
              </div>
              {firebaseOrderId && (
                <div className="flex justify-between text-zinc-400">
                  <span>Firebase Order ID:</span>
                  <span className="font-mono text-zinc-300 font-bold">{firebaseOrderId}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Package Selected:</span>
                <span className="text-white">{quantity}x {activeTier.name}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Amount Paid:</span>
                <span className="font-mono text-emerald-400 font-bold">₹{totalPrice}</span>
              </div>
              <div className="border-t border-white/5 pt-2">
                <span className="text-zinc-400 block mb-1">Delivery Destination:</span>
                <p className="text-zinc-200 font-mono text-[11px] leading-relaxed">
                  {houseNo}, {street}{landmark ? ', Near ' + landmark : ''}, {city}, {state} - {pincode} ({addressType})
                </p>
              </div>
              <div className="flex justify-between text-zinc-400 pt-1">
                <span>Dispatch Window:</span>
                <span className="text-white">Ships in 24 Hours</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all"
            >
              Return To Showcase
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
