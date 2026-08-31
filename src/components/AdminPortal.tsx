import React, { useState, useEffect } from 'react';
import {
  auth,
  ADMIN_EMAIL,
  OrderRecord,
  subscribeToOrders,
  updateOrderStatusInFirebase,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  checkIfUserIsAdmin,
  FirebaseUser,
} from '../lib/firebase';
import { soundFx } from '../lib/SoundFx';
import {
  ShieldCheck,
  Lock,
  LogOut,
  X,
  Search,
  Download,
  CheckCircle,
  Package,
  IndianRupee,
  Users,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdminRole, setIsAdminRole] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Auth form states
  const [email, setEmail] = useState<string>(ADMIN_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string>('');
  const [isProcessingAuth, setIsProcessingAuth] = useState<boolean>(false);

  // Orders and dashboard states
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isAuthAdmin = await checkIfUserIsAdmin(currentUser);
        setIsAdminRole(isAuthAdmin);
      } else {
        setIsAdminRole(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to real-time orders from Firestore when authenticated
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
    });
    return () => unsubscribe();
  }, [user]);

  if (!isOpen) return null;

  // Handle Login
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setIsProcessingAuth(true);
    soundFx.play('click');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      soundFx.play('chime');
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let msg = err.message || 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Invalid password for info@xoroniq.store.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No user registered under this email in Firebase Authentication.';
      }
      setAuthError(msg);
    } finally {
      setIsProcessingAuth(false);
    }
  };

  // Handle Password Reset
  const handleResetPassword = async () => {
    if (!email) {
      setAuthError('Please enter admin email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthSuccessMsg(`Password reset email sent to ${email}. Check your inbox.`);
      soundFx.play('chime');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send reset email.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    soundFx.play('click');
    await signOut(auth);
  };

  // Handle Order Status Update
  const handleStatusChange = async (orderId: string, newStatus: OrderRecord['status']) => {
    soundFx.play('click');
    setUpdatingOrderId(orderId);
    await updateOrderStatusInFirebase(orderId, newStatus);
    setUpdatingOrderId(null);
  };

  // Export Orders to CSV
  const handleExportCSV = () => {
    soundFx.play('click');
    if (orders.length === 0) return;

    const headers = [
      'Order ID',
      'Package',
      'Quantity',
      'Amount (INR)',
      'Status',
      'Customer Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'PIN Code',
      'Address Type',
      'Razorpay ID',
      'Created At',
    ];

    const rows = orders.map((o) => [
      `"${o.id || ''}"`,
      `"${o.packageName}"`,
      o.quantity,
      o.totalPrice,
      `"${o.status}"`,
      `"${o.customerName}"`,
      `"${o.customerEmail}"`,
      `"${o.customerPhone}"`,
      `"${(o.shippingDetails?.formattedAddress || '').replace(/"/g, '""')}"`,
      `"${o.shippingDetails?.city || ''}"`,
      `"${o.shippingDetails?.state || ''}"`,
      `"${o.shippingDetails?.pincode || ''}"`,
      `"${o.shippingDetails?.addressType || ''}"`,
      `"${o.razorpayPaymentId || ''}"`,
      `"${o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : new Date().toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `XORONIQ_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      (o.shippingDetails?.city || '').toLowerCase().includes(q) ||
      (o.shippingDetails?.pincode || '').includes(q) ||
      (o.razorpayPaymentId || '').toLowerCase().includes(q) ||
      (o.id || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalPrice : 0), 0);
  const totalPaidOrders = orders.filter((o) => o.status === 'PAID' || o.status === 'CONFIRMED' || o.status === 'DISPATCHED' || o.status === 'DELIVERED').length;
  const avgOrderValue = totalPaidOrders > 0 ? Math.round(totalRevenue / totalPaidOrders) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl bg-[#0A0A0C] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Command Bar */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-black/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-xoroniq-red/20 border border-xoroniq-red/40 flex items-center justify-center text-xoroniq-red">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-display">
                  XORONIQ Admin Command Center
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {isAdminRole ? 'Role: admin' : 'Firebase Live'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Admin Console: <span className="text-white font-semibold">{user?.email || ADMIN_EMAIL}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Loading State */}
        {authLoading ? (
          <div className="p-20 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-xoroniq-red animate-spin" />
            <span className="text-xs font-mono">Verifying Firebase Authentication...</span>
          </div>
        ) : !user ? (
          /* ========================================================================= */
          /* ADMIN LOGIN VIEW (NO PUBLIC REGISTRATION LINK) */
          /* ========================================================================= */
          <div className="p-8 sm:p-14 flex items-center justify-center flex-1">
            <div className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl glass-card text-left">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-black border border-white/10 flex items-center justify-center p-3">
                  <img src="/assets/logo.png" alt="XORONIQ" className="w-full h-auto object-contain brightness-125" />
                </div>
                <h4 className="text-2xl font-bold text-white font-display">
                  Admin Portal Login
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Private management console for authorized administrators.
                </p>
              </div>

              {authError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccessMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors font-mono"
                    placeholder="info@xoroniq.store"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end text-[11px] pt-1">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-zinc-400 hover:text-white underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingAuth}
                  className="w-full mt-4 py-3.5 rounded-xl bg-xoroniq-red hover:bg-red-600 font-bold text-xs text-white tracking-wider uppercase shadow-glow-red transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingAuth ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authenticate Admin</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* AUTHENTICATED ADMIN DASHBOARD */
          /* ========================================================================= */
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Total Revenue</span>
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">Live Firestore Transactions</div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Total Orders</span>
                  <Package className="w-4 h-4 text-xoroniq-red" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {orders.length}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                  {totalPaidOrders} Paid & Confirmed
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Average Order (AOV)</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  ₹{avgOrderValue.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">Per Checkout Basket</div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider">Active Customers</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {new Set(orders.map((o) => o.customerEmail)).size}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">Unique Verified Buyers</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                {['All', 'PAID', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      soundFx.play('click');
                      setStatusFilter(st);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      statusFilter === st
                        ? 'bg-xoroniq-red text-white font-bold shadow-glow-red'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st} (
                    {st === 'All' ? orders.length : orders.filter((o) => o.status === st).length})
                  </button>
                ))}
              </div>

              {/* Search & Export Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search name, phone, PIN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-xoroniq-red transition-colors"
                  />
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white flex items-center gap-1.5 transition-all flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 border-b border-white/10 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Customer & Contact</th>
                      <th className="p-4">Package</th>
                      <th className="p-4">Amount & Razorpay</th>
                      <th className="p-4">Detailed Shipping Address</th>
                      <th className="p-4">Fulfillment Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {filteredOrders.map((order) => (
                      <tr key={order.id || Math.random()} className="hover:bg-white/[0.02] transition-colors">
                        {/* Customer Info */}
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{order.customerName}</div>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono mt-0.5">
                            <Mail className="w-3 h-3 text-zinc-500" />
                            <span>{order.customerEmail}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono mt-0.5">
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{order.customerPhone}</span>
                            {order.alternatePhone && (
                              <span className="text-[10px] text-zinc-600">/ Alt: {order.alternatePhone}</span>
                            )}
                          </div>
                        </td>

                        {/* Package Info */}
                        <td className="p-4 font-mono">
                          <span className="px-2 py-0.5 rounded bg-xoroniq-red/15 text-xoroniq-red font-bold text-xs border border-xoroniq-red/30">
                            {order.packageName}
                          </span>
                          <div className="text-[11px] text-zinc-400 mt-1">
                            Qty: <span className="text-white font-semibold">{order.quantity}x</span>
                          </div>
                        </td>

                        {/* Amount & Razorpay ID */}
                        <td className="p-4 font-mono">
                          <div className="text-sm font-bold text-emerald-400">
                            ₹{order.totalPrice}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-[140px]" title={order.razorpayPaymentId}>
                            {order.razorpayPaymentId || 'N/A'}
                          </div>
                        </td>

                        {/* Detailed Shipping Address */}
                        <td className="p-4 max-w-xs">
                          <div className="text-xs text-zinc-200 leading-relaxed">
                            {order.shippingDetails?.houseNo}, {order.shippingDetails?.street}
                            {order.shippingDetails?.landmark && (
                              <span className="text-zinc-400 block text-[11px]">
                                Landmark: Near {order.shippingDetails.landmark}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-xoroniq-red" />
                            <span>
                              {order.shippingDetails?.city}, {order.shippingDetails?.state} -{' '}
                              <strong className="text-white">{order.shippingDetails?.pincode}</strong>
                            </span>
                            <span className="text-[10px] px-1 rounded bg-white/10 text-zinc-300 ml-1">
                              {order.shippingDetails?.addressType || 'Home'}
                            </span>
                          </div>
                        </td>

                        {/* Status Selector */}
                        <td className="p-4">
                          <select
                            value={order.status}
                            disabled={updatingOrderId === order.id}
                            onChange={(e) =>
                              order.id && handleStatusChange(order.id, e.target.value as OrderRecord['status'])
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold focus:outline-none cursor-pointer border ${
                              order.status === 'PAID'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : order.status === 'DISPATCHED'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : order.status === 'DELIVERED'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                            }`}
                          >
                            <option value="PAID" className="bg-[#111115] text-white">PAID</option>
                            <option value="CONFIRMED" className="bg-[#111115] text-white">CONFIRMED</option>
                            <option value="DISPATCHED" className="bg-[#111115] text-white">DISPATCHED</option>
                            <option value="DELIVERED" className="bg-[#111115] text-white">DELIVERED</option>
                            <option value="CANCELLED" className="bg-[#111115] text-white">CANCELLED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              soundFx.play('click');
                              setSelectedOrder(order);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-white transition-all font-mono"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-zinc-500 font-mono">
                          No orders matching current search or status filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Order Inspection Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="relative w-full max-w-lg bg-[#0A0A0C] border border-white/20 rounded-3xl p-8 shadow-2xl glass-card text-left text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded bg-xoroniq-red text-white font-mono font-bold uppercase">
                  {selectedOrder.packageName}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  Status: {selectedOrder.status}
                </span>
              </div>

              <h4 className="text-2xl font-bold text-white font-display mb-1">
                Order #{selectedOrder.id || 'N/A'}
              </h4>
              <p className="text-zinc-400 font-mono text-[11px]">
                Razorpay ID: {selectedOrder.razorpayPaymentId || 'N/A'}
              </p>

              <div className="my-5 h-[1px] bg-white/10" />

              <div className="space-y-3 font-mono text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Customer Name:</span>
                  <span className="text-white font-bold">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email:</span>
                  <span>{selectedOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Phone:</span>
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Price:</span>
                  <span className="text-emerald-400 font-bold text-sm">₹{selectedOrder.totalPrice}</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Full Courier Shipping Address:
                </div>
                <p className="text-zinc-200 text-xs leading-relaxed">
                  {selectedOrder.shippingDetails?.formattedAddress}
                </p>
                {selectedOrder.shippingDetails?.deliveryNotes && (
                  <div className="text-[11px] text-amber-400 mt-2">
                    Note: "{selectedOrder.shippingDetails.deliveryNotes}"
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`https://wa.me/91${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Customer</span>
                </a>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
