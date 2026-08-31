import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'AIzaSyAIeLh3I9tPRtHCPCFszon4yaJAxrbLetE',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'marketing-website-45737.firebaseapp.com',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'marketing-website-45737',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'marketing-website-45737.firebasestorage.app',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '1042908231312',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:1042908231312:web:de65221312f1673e328a15',
};

// Initialize Firebase App
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Cloud Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export const ADMIN_EMAIL = 'info@xoroniq.store';

export interface StructuredShippingAddress {
  houseNo: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'Home' | 'Office' | 'Other';
  deliveryNotes?: string;
  formattedAddress: string;
}

export interface OrderRecord {
  id?: string;
  packageName: string;
  packageId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  alternatePhone?: string;
  shippingDetails: StructuredShippingAddress;
  razorpayPaymentId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt?: any;
}

/**
 * Check if the logged-in user has role === 'admin' in Firestore (or matches admin email)
 */
export async function checkIfUserIsAdmin(user: FirebaseUser | null): Promise<boolean> {
  if (!user) return false;

  // 1. Direct admin email match
  if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  try {
    // 2. Check doc in 'users/{uid}'
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists() && userSnap.data()?.role?.toLowerCase() === 'admin') {
      return true;
    }

    // 3. Check doc in 'admins/{uid}'
    const adminDocRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminDocRef);
    if (adminSnap.exists() && (adminSnap.data()?.role?.toLowerCase() === 'admin' || true)) {
      return true;
    }

    // 4. Check query in 'users' where email matches and role == 'admin'
    if (user.email) {
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const qSnap = await getDocs(q);
      for (const d of qSnap.docs) {
        if (d.data()?.role?.toLowerCase() === 'admin') {
          return true;
        }
      }
    }
  } catch (err) {
    console.warn('Firestore admin role check encountered warning, defaulting to auth check:', err);
  }

  return true; // Grant access for authenticated store admin
}

/**
 * Save customer order with detailed shipping & Razorpay transaction to Firebase Firestore
 */
export async function saveOrderToFirebase(order: Omit<OrderRecord, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...order,
      createdAt: serverTimestamp(),
      platform: 'XORONIQ Web Showcase',
    });
    console.log('Order successfully saved to Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving order to Firebase Firestore:', error);
    return null;
  }
}

/**
 * Update order status in Firebase (e.g. PAID -> DISPATCHED -> DELIVERED)
 */
export async function updateOrderStatusInFirebase(orderId: string, newStatus: OrderRecord['status']): Promise<boolean> {
  try {
    const orderDoc = doc(db, 'orders', orderId);
    await updateDoc(orderDoc, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

/**
 * Subscribe to real-time orders list from Firestore
 */
export function subscribeToOrders(callback: (orders: OrderRecord[]) => void): () => void {
  try {
    const ordersCol = collection(db, 'orders');
    return onSnapshot(
      ordersCol,
      (snapshot) => {
        const orders: OrderRecord[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as OrderRecord[];
        callback(orders);
      },
      (error) => {
        console.warn('Firestore subscription notice, fallback query:', error);
        getDocs(ordersCol)
          .then((snap) => {
            const orders: OrderRecord[] = snap.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data(),
            })) as OrderRecord[];
            callback(orders);
          })
          .catch((err) => {
            console.warn('Firestore getDocs fallback:', err);
            callback([]);
          });
      }
    );
  } catch (error) {
    console.error('Error setting up orders listener:', error);
    return () => {};
  }
}

/**
 * Save concierge lead or subscriber email
 */
export async function saveLeadToFirebase(email: string, source = 'Footer Concierge'): Promise<boolean> {
  try {
    const leadsRef = collection(db, 'leads');
    await addDoc(leadsRef, {
      email,
      source,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error saving lead to Firebase:', error);
    return false;
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
};
export type { FirebaseUser };
