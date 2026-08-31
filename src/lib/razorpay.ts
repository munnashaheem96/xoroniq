declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface PaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface InitiatePaymentParams {
  packageName: string;
  amountInRupees: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  onSuccess: (response: PaymentSuccessResponse) => void;
  onError?: (error: any) => void;
}

export const RAZORPAY_KEY_ID =
  (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_live_TWJriH4XFtLA4T';

export function openRazorpayCheckout({
  packageName,
  amountInRupees,
  customerName,
  customerEmail,
  customerPhone = '9999999999',
  address,
  onSuccess,
  onError,
}: InitiatePaymentParams): void {
  // Amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amountInRupees * 100);

  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  loadScript().then((loaded) => {
    if (loaded && window.Razorpay) {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: 'INR',
        name: 'XORONIQ Automotive',
        description: `${packageName} — Launch Allocation`,
        image: '/assets/logo.png',
        handler: function (response: PaymentSuccessResponse) {
          onSuccess(response);
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        notes: {
          package_name: packageName,
          delivery_address: address,
        },
        theme: {
          color: '#E50914', // XORONIQ Red
          backdrop_color: 'rgba(5, 5, 5, 0.9)',
        },
        modal: {
          ondismiss: function () {
            if (onError) onError({ message: 'Payment window closed' });
          },
        },
      };

      try {
        const rzpInstance = new window.Razorpay(options);
        rzpInstance.on('payment.failed', function (response: any) {
          if (onError) onError(response.error);
        });
        rzpInstance.open();
        return;
      } catch (err) {
        console.error('Error opening Razorpay modal:', err);
        if (onError) onError(err);
      }
    } else {
      console.warn('Razorpay script could not be loaded.');
      if (onError) onError({ message: 'Razorpay SDK unavailable' });
    }
  });
}
