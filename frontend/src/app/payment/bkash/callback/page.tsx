'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PaymentFailed from '@/components/payments/PaymentFailed';
import PaymentSuccess from '@/components/payments/PaymentSuccess';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const paymentID = searchParams.get('paymentID');
  const status = searchParams.get('status');
  const signature = searchParams.get('signature');

  useEffect(() => {
    async function verifyPayment() {
      if (!paymentID || !status) {
        setErrorMessage('Invalid payment parameters.');
        setLoading(false);
        return;
      }

      if (status !== 'success') {
        setPaymentStatus('failed');
        setLoading(false);
        return;
      }

      try {
        // Send request to your Express/Node backend to verify and update DB status
        const res = await fetch(
          `http://localhost:5000/api/v1/bkash/callback?paymentID=${paymentID}&status=${status}&signature=${signature}`
        );
        const data = await res.json();

        if (data.success && data.data.paymentStatus === 'PAID') {
          setPaymentStatus('success');
        } else {
          setPaymentStatus('failed');
          setErrorMessage(data.message || 'Payment verification failed.');
        }
      } catch (error) {
        setErrorMessage('Failed to connect to backend server.');
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [paymentID, status, signature]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold">Verifying your payment, please wait...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <PaymentFailed/>
      <PaymentSuccess/>
    </div>
  );
}