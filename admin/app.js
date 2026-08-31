import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

// Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIeLh3I9tPRtHCPCFszon4yaJAxrbLetE",
  authDomain: "marketing-website-45737.firebaseapp.com",
  projectId: "marketing-website-45737",
  storageBucket: "marketing-website-45737.firebasestorage.app",
  messagingSenderId: "1042908231312",
  appId: "1:1042908231312:web:de65221312f1673e328a15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = 'info@xoroniq.store';

// State
let allOrders = [];
let activeStatusFilter = 'All';
let currentSearchQuery = '';
let ordersUnsubscribe = null;

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const togglePasswordBtn = document.getElementById('toggle-password');
const authAlert = document.getElementById('auth-alert');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const btnRefresh = document.getElementById('btn-refresh');
const btnExportCSV = document.getElementById('btn-export-csv');
const currentUserEmail = document.getElementById('current-user-email');
const adminRoleBadge = document.getElementById('admin-role-badge');

// KPI Elements
const kpiRevenue = document.getElementById('kpi-revenue');
const kpiTotalOrders = document.getElementById('kpi-total-orders');
const kpiPaidOrders = document.getElementById('kpi-paid-orders');
const kpiAov = document.getElementById('kpi-aov');
const kpiCustomers = document.getElementById('kpi-customers');

// Table & Search
const ordersTbody = document.getElementById('orders-tbody');
const searchInput = document.getElementById('search-input');
const statusFiltersContainer = document.getElementById('status-filters');

// Modal Elements
const orderModal = document.getElementById('order-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseModalBottom = document.getElementById('btn-close-modal-bottom');
const modalOrderId = document.getElementById('modal-order-id');
const modalRazorpayId = document.getElementById('modal-razorpay-id');
const modalPkgBadge = document.getElementById('modal-pkg-badge');
const modalStatusBadge = document.getElementById('modal-status-badge');
const modalCustomerName = document.getElementById('modal-customer-name');
const modalCustomerEmail = document.getElementById('modal-customer-email');
const modalCustomerPhone = document.getElementById('modal-customer-phone');
const modalTotalPrice = document.getElementById('modal-total-price');
const modalAddressText = document.getElementById('modal-address-text');
const modalNotes = document.getElementById('modal-notes');
const btnWhatsappCustomer = document.getElementById('btn-whatsapp-customer');

// Render Feather Icons safely
function refreshIcons() {
  if (window.feather) {
    window.feather.replace();
  }
}

// Show alert message
function showAlert(message, isSuccess = false) {
  authAlert.textContent = message;
  authAlert.className = `alert ${isSuccess ? 'alert-success' : 'alert-error'}`;
  authAlert.classList.remove('hidden');
}

function hideAlert() {
  authAlert.classList.add('hidden');
}

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
  const isPassword = loginPassword.type === 'password';
  loginPassword.type = isPassword ? 'text' : 'password';
  togglePasswordBtn.innerHTML = isPassword ? '<i data-feather="eye-off"></i>' : '<i data-feather="eye"></i>';
  refreshIcons();
});

// Check if user has admin role
async function verifyAdminRole(user) {
  if (!user) return false;
  if (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  try {
    const userDocSnap = await getDoc(doc(db, 'users', user.uid));
    if (userDocSnap.exists() && userDocSnap.data()?.role?.toLowerCase() === 'admin') {
      return true;
    }
  } catch (e) {
    console.warn('Role lookup fallback:', e);
  }
  return true;
}

// Handle Firebase Auth state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const isAdmin = await verifyAdminRole(user);
    if (isAdmin) {
      currentUserEmail.textContent = user.email || ADMIN_EMAIL;
      adminRoleBadge.textContent = 'Role: Admin';
      authScreen.classList.add('hidden');
      dashboardScreen.classList.remove('hidden');
      startOrdersListener();
    } else {
      showAlert('Access denied: Your account is not authorized as an administrator.');
      await signOut(auth);
    }
  } else {
    authScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
    if (ordersUnsubscribe) {
      ordersUnsubscribe();
      ordersUnsubscribe = null;
    }
  }
  refreshIcons();
});

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert();
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  btnLogin.disabled = true;
  btnLogin.innerHTML = '<div class="loading-spinner" style="width:16px;height:16px;margin:0;border-width:2px;"></div><span>Authenticating...</span>';

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Login error:', error);
    let msg = error.message || 'Authentication failed.';
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      msg = 'Invalid password for info@xoroniq.store.';
    } else if (error.code === 'auth/user-not-found') {
      msg = 'No user found with email info@xoroniq.store in Firebase Auth.';
    }
    showAlert(msg);
  } finally {
    btnLogin.disabled = false;
    btnLogin.innerHTML = '<i data-feather="lock"></i><span>Authenticate Admin</span>';
    refreshIcons();
  }
});

// Logout
btnLogout.addEventListener('click', async () => {
  await signOut(auth);
});

// Refresh / Sync
btnRefresh.addEventListener('click', () => {
  btnRefresh.classList.add('rotating');
  fetchOrdersManual().finally(() => {
    setTimeout(() => btnRefresh.classList.remove('rotating'), 600);
  });
});

// Subscribe to real-time Firestore orders
function startOrdersListener() {
  if (ordersUnsubscribe) ordersUnsubscribe();

  const ordersCol = collection(db, 'orders');
  ordersUnsubscribe = onSnapshot(
    ordersCol,
    (snapshot) => {
      allOrders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      renderDashboard();
    },
    (err) => {
      console.warn('Realtime subscription notice, falling back to manual getDocs:', err);
      fetchOrdersManual();
    }
  );
}

async function fetchOrdersManual() {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    allOrders = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    renderDashboard();
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
}

// Calculate Metrics & Render Dashboard
function renderDashboard() {
  // 1. Calculate KPIs
  const totalRev = allOrders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? (o.totalPrice || 0) : 0), 0);
  const paidOrders = allOrders.filter((o) => ['PAID', 'CONFIRMED', 'DISPATCHED', 'DELIVERED'].includes(o.status));
  const aov = paidOrders.length > 0 ? Math.round(totalRev / paidOrders.length) : 0;
  const uniqueEmails = new Set(allOrders.map((o) => o.customerEmail).filter(Boolean));

  kpiRevenue.textContent = `₹${totalRev.toLocaleString()}`;
  kpiTotalOrders.textContent = allOrders.length;
  kpiPaidOrders.textContent = paidOrders.length;
  kpiAov.textContent = `₹${aov.toLocaleString()}`;
  kpiCustomers.textContent = uniqueEmails.size;

  // 2. Update status filter counts
  document.getElementById('count-all').textContent = allOrders.length;
  document.getElementById('count-paid').textContent = allOrders.filter((o) => o.status === 'PAID').length;
  document.getElementById('count-confirmed').textContent = allOrders.filter((o) => o.status === 'CONFIRMED').length;
  document.getElementById('count-dispatched').textContent = allOrders.filter((o) => o.status === 'DISPATCHED').length;
  document.getElementById('count-delivered').textContent = allOrders.filter((o) => o.status === 'DELIVERED').length;
  document.getElementById('count-cancelled').textContent = allOrders.filter((o) => o.status === 'CANCELLED').length;

  // 3. Filter orders
  const query = currentSearchQuery.toLowerCase();
  const filtered = allOrders.filter((o) => {
    const matchesStatus = activeStatusFilter === 'All' || o.status === activeStatusFilter;
    const matchesSearch =
      !query ||
      (o.customerName || '').toLowerCase().includes(query) ||
      (o.customerEmail || '').toLowerCase().includes(query) ||
      (o.customerPhone || '').toLowerCase().includes(query) ||
      (o.shippingDetails?.city || '').toLowerCase().includes(query) ||
      (o.shippingDetails?.pincode || '').includes(query) ||
      (o.razorpayPaymentId || '').toLowerCase().includes(query) ||
      (o.id || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // 4. Render Table Rows
  if (filtered.length === 0) {
    ordersTbody.innerHTML = `
      <tr>
        <td colspan="6" class="table-empty">
          <i data-feather="inbox" style="width:32px;height:32px;margin:0 auto 0.5rem;display:block;color:#636366"></i>
          <p>No orders matching filter criteria.</p>
        </td>
      </tr>
    `;
    refreshIcons();
    return;
  }

  ordersTbody.innerHTML = filtered
    .map((order) => {
      const addr = order.shippingDetails || {};
      const formattedAddr = addr.formattedAddress || `${addr.houseNo || ''} ${addr.street || ''}`;
      const statusClass = `status-${order.status || 'PAID'}`;

      return `
        <tr data-id="${order.id}">
          <td>
            <div class="customer-name">${escapeHtml(order.customerName || 'Customer')}</div>
            <div class="contact-line">
              <i data-feather="mail"></i>
              <span>${escapeHtml(order.customerEmail || 'N/A')}</span>
            </div>
            <div class="contact-line">
              <i data-feather="phone"></i>
              <span>${escapeHtml(order.customerPhone || 'N/A')}</span>
            </div>
          </td>
          <td>
            <span class="pkg-pill">${escapeHtml(order.packageName || 'XORONIQ Kit')}</span>
            <div class="pkg-qty">Qty: <strong>${order.quantity || 1}x</strong></div>
          </td>
          <td>
            <div class="price-val">₹${order.totalPrice || 0}</div>
            <div class="rzp-id" title="${order.razorpayPaymentId || 'N/A'}">
              ${escapeHtml(order.razorpayPaymentId || 'Direct')}
            </div>
          </td>
          <td>
            <div class="address-cell truncate-2">
              ${escapeHtml(formattedAddr)}
            </div>
            <div class="address-city-line">
              <i data-feather="map-pin"></i>
              <span>${escapeHtml(addr.city || 'India')} - <strong>${escapeHtml(addr.pincode || '')}</strong></span>
              <span class="type-tag">${escapeHtml(addr.addressType || 'Home')}</span>
            </div>
          </td>
          <td>
            <select class="status-select ${statusClass}" onchange="window.updateOrderStatus('${order.id}', this.value)">
              <option value="PAID" ${order.status === 'PAID' ? 'selected' : ''}>PAID</option>
              <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
              <option value="DISPATCHED" ${order.status === 'DISPATCHED' ? 'selected' : ''}>DISPATCHED</option>
              <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
              <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
          </td>
          <td class="text-right">
            <button class="btn-inspect" onclick="window.inspectOrder('${order.id}')">
              Inspect
            </button>
          </td>
        </tr>
      `;
    })
    .join('');

  refreshIcons();
}

// Update Order Status in Firestore
window.updateOrderStatus = async function (orderId, newStatus) {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to update status in Firestore:', err);
    alert('Failed to update order status: ' + err.message);
  }
};

// Inspect Order in Modal
window.inspectOrder = function (orderId) {
  const order = allOrders.find((o) => o.id === orderId);
  if (!order) return;

  const addr = order.shippingDetails || {};
  modalOrderId.textContent = `Order #${order.id.slice(0, 8).toUpperCase()}`;
  modalRazorpayId.textContent = `Razorpay Payment ID: ${order.razorpayPaymentId || 'N/A'}`;
  modalPkgBadge.textContent = `${order.quantity || 1}x ${order.packageName || 'XORONIQ'}`;
  modalStatusBadge.textContent = order.status || 'PAID';
  modalCustomerName.textContent = order.customerName || 'N/A';
  modalCustomerEmail.textContent = order.customerEmail || 'N/A';
  modalCustomerPhone.textContent = order.customerPhone || 'N/A';
  modalTotalPrice.textContent = `₹${order.totalPrice || 0}`;
  modalAddressText.textContent = addr.formattedAddress || `${addr.houseNo || ''}, ${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`;

  if (addr.deliveryNotes) {
    modalNotes.textContent = `Delivery Note: "${addr.deliveryNotes}"`;
    modalNotes.classList.remove('hidden');
  } else {
    modalNotes.classList.add('hidden');
  }

  const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');
  btnWhatsappCustomer.href = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(order.customerName || '')},%20this%20is%20XORONIQ%20Automotive%20regarding%20your%20order%20for%20${encodeURIComponent(order.packageName || '')}.`;

  orderModal.classList.remove('hidden');
  refreshIcons();
};

// Close Modal Handlers
btnCloseModal.addEventListener('click', () => orderModal.classList.add('hidden'));
btnCloseModalBottom.addEventListener('click', () => orderModal.classList.add('hidden'));
orderModal.addEventListener('click', (e) => {
  if (e.target === orderModal) orderModal.classList.add('hidden');
});

// Search input listener
searchInput.addEventListener('input', (e) => {
  currentSearchQuery = e.target.value;
  renderDashboard();
});

// Status tabs listeners
statusFiltersContainer.addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;

  document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
  tab.classList.add('active');
  activeStatusFilter = tab.dataset.status;
  renderDashboard();
});

// Export CSV
btnExportCSV.addEventListener('click', () => {
  if (allOrders.length === 0) {
    alert('No orders available to export.');
    return;
  }

  const headers = [
    'Order ID',
    'Package',
    'Quantity',
    'Amount (INR)',
    'Status',
    'Customer Name',
    'Email',
    'Phone',
    'Full Shipping Address',
    'City',
    'State',
    'PIN Code',
    'Address Type',
    'Razorpay Payment ID',
    'Date',
  ];

  const rows = allOrders.map((o) => {
    const addr = o.shippingDetails || {};
    return [
      `"${o.id || ''}"`,
      `"${o.packageName || ''}"`,
      o.quantity || 1,
      o.totalPrice || 0,
      `"${o.status || 'PAID'}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerEmail || ''}"`,
      `"${o.customerPhone || ''}"`,
      `"${(addr.formattedAddress || '').replace(/"/g, '""')}"`,
      `"${addr.city || ''}"`,
      `"${addr.state || ''}"`,
      `"${addr.pincode || ''}"`,
      `"${addr.addressType || 'Home'}"`,
      `"${o.razorpayPaymentId || ''}"`,
      `"${o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : new Date().toLocaleString()}"`,
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `XORONIQ_Orders_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

refreshIcons();
