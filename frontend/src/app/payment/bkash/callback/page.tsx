// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// import PaymentFailed from "@/components/payments/PaymentFailed";
// import PaymentSuccess from "@/components/payments/PaymentSuccess";

// function PaymentCallbackContent() {
//   const searchParams = useSearchParams();

//   const [loading, setLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState<
//     "success" | "failed" | null
//   >(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   const paymentID = searchParams.get("paymentID");
//   const status = searchParams.get("status");
//   const signature = searchParams.get("signature");

//   useEffect(() => {
//     const verifyPayment = async () => {
//       // --------------------------------------------------
//       // Validate payment parameters
//       // --------------------------------------------------
//       if (!paymentID || !status) {
//         setErrorMessage("Invalid payment parameters.");
//         setPaymentStatus("failed");
//         setLoading(false);
//         return;
//       }

//       // --------------------------------------------------
//       // bKash cancelled / failed payment
//       // --------------------------------------------------
//       if (status !== "success") {
//         setErrorMessage(
//           status === "cancel"
//             ? "Payment was cancelled."
//             : "Payment was not successful.",
//         );

//         setPaymentStatus("failed");
//         setLoading(false);
//         return;
//       }

//       try {
//         // --------------------------------------------------
//         // Verify payment with backend
//         // --------------------------------------------------
//         const backendUrl =
//           process.env.NEXT_PUBLIC_API_URL ??
//           "http://localhost:5000/api/v1";

//         const queryParams = new URLSearchParams({
//           paymentID,
//           status,
//         });

//         if (signature) {
//           queryParams.append("signature", signature);
//         }

//         const response = await fetch(
//           `${backendUrl}/bkash/callback?${queryParams.toString()}`,
//           {
//             method: "GET",
//             credentials: "include",
//           },
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Payment verification failed with status ${response.status}`,
//           );
//         }

//         const data = await response.json();

//         // --------------------------------------------------
//         // Check backend verification result
//         // --------------------------------------------------
//         if (
//           data?.success &&
//           data?.data?.paymentStatus === "PAID"
//         ) {
//           setPaymentStatus("success");
//           setErrorMessage("");
//         } else {
//           setPaymentStatus("failed");
//           setErrorMessage(
//             data?.message ?? "Payment verification failed.",
//           );
//         }
//       } catch (error) {
//         console.error("bKash payment verification error:", error);

//         setPaymentStatus("failed");
//         setErrorMessage(
//           "Failed to verify your payment. Please contact support if money was deducted.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     void verifyPayment();
//   }, [paymentID, status, signature]);

//   // --------------------------------------------------
//   // Loading
//   // --------------------------------------------------
//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center p-6">
//         <div className="text-center">
//           <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

//           <p className="text-lg font-semibold">
//             Verifying your payment...
//           </p>

//           <p className="mt-2 text-sm text-muted-foreground">
//             Please wait while we confirm your bKash payment.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Success
//   // --------------------------------------------------
//   if (paymentStatus === "success") {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center p-6">
//         <PaymentSuccess />
//       </div>
//     );
//   }

//   // --------------------------------------------------
//   // Failed
//   // --------------------------------------------------
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-6">
//       <PaymentFailed />

//       {errorMessage && (
//         <p className="mt-4 max-w-md text-center text-sm text-red-600">
//           {errorMessage}
//         </p>
//       )}
//     </div>
//   );
// }

// // --------------------------------------------------
// // Page
// // --------------------------------------------------
// function PaymentCallbackPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex min-h-screen items-center justify-center p-6">
//           <div className="text-center">
//             <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />

//             <p className="text-lg font-semibold">
//               Loading payment information...
//             </p>
//           </div>
//         </div>
//       }
//     >
//       <PaymentCallbackContent />
//     </Suspense>
//   );
// }

// export default PaymentCallbackPage;


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import PaymentFailed from '@/components/payments/PaymentFailed';
// import PaymentSuccess from '@/components/payments/PaymentSuccess';

// export default function PaymentCallbackPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState('');

//   const paymentID = searchParams.get('paymentID');
//   const status = searchParams.get('status');
//   const signature = searchParams.get('signature');

//   useEffect(() => {
//     async function verifyPayment() {
//       if (!paymentID || !status) {
//         setErrorMessage('Invalid payment parameters.');
//         setLoading(false);
//         return;
//       }

//       if (status !== 'success') {
//         setPaymentStatus('failed');
//         setLoading(false);
//         return;
//       }

//       try {
//         // Send request to your Express/Node backend to verify and update DB status
//         const res = await fetch(
//           `http://localhost:5000/api/v1/bkash/callback?paymentID=${paymentID}&status=${status}&signature=${signature}`
//         );
//         const data = await res.json();

//         if (data.success && data.data.paymentStatus === 'PAID') {
//           setPaymentStatus('success');
//         } else {
//           setPaymentStatus('failed');
//           setErrorMessage(data.message || 'Payment verification failed.');
//         }
//       } catch (error) {
//         setErrorMessage('Failed to connect to backend server.');
//         setPaymentStatus('failed');
//       } finally {
//         setLoading(false);
//       }
//     }

//     verifyPayment();
//   }, [paymentID, status, signature]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <p className="text-lg font-semibold">Verifying your payment, please wait...</p>
//       </div>
//     );
//   }


//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-6">
//       {
//         paymentStatus === "success" && (
//           <PaymentSuccess/>
//         )
//       }
//       {
//         paymentStatus === "failed" && (
//           <PaymentFailed/>
//         )
//       }
//     </div>
//   );
// }


// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// import PaymentFailed from "@/components/payments/PaymentFailed";
// import PaymentSuccess from "@/components/payments/PaymentSuccess";

// function PaymentCallbackContent() {
//   const searchParams = useSearchParams();

//   const [loading, setLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   const paymentID = searchParams.get("paymentID");
//   const status = searchParams.get("status");
//   const signature = searchParams.get("signature");

//   useEffect(() => {
//     let cancelled = false;

//     async function verifyPayment() {
//       if (!paymentID || !status) {
//         setErrorMessage("Invalid payment parameters.");
//         setPaymentStatus("failed");
//         setLoading(false);
//         return;
//       }

//       if (status !== "success") {
//         setPaymentStatus("failed");
//         setErrorMessage("Payment was not completed.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const params = new URLSearchParams({
//           paymentID,
//           status,
//         });

//         if (signature) {
//           params.set("signature", signature);
//         }

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"}/bkash/callback?${params.toString()}`,
//           {
//             method: "GET",
//             credentials: "include",
//             cache: "no-store",
//           },
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(
//             data.message || "Payment verification failed.",
//           );
//         }

//         if (cancelled) return;

//         if (data.success && data.data?.paymentStatus === "PAID") {
//           setPaymentStatus("success");
//           setErrorMessage("");
//         } else {
//           setPaymentStatus("failed");
//           setErrorMessage(
//             data.message || "Payment verification failed.",
//           );
//         }
//       } catch (error) {
//         if (cancelled) return;

//         console.error("bKash callback verification error:", error);

//         setPaymentStatus("failed");
//         setErrorMessage(
//           error instanceof Error
//             ? error.message
//             : "Failed to connect to backend server.",
//         );
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     void verifyPayment();

//     return () => {
//       cancelled = true;
//     };
//   }, [paymentID, status, signature]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center p-6">
//         <p className="text-center text-lg font-semibold">
//           Verifying your payment, please wait...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-6">
//       {paymentStatus === "success" ? (
//         <PaymentSuccess />
//       ) : (
//         <PaymentFailed />
//       )}

//       {errorMessage && (
//         <p
//           role="alert"
//           className="mt-4 max-w-lg text-center text-sm text-red-600"
//         >
//           {errorMessage}
//         </p>
//       )}
//     </div>
//   );
// }

// export default function PaymentCallbackPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex min-h-screen items-center justify-center p-6">
//           <p className="text-center text-lg font-semibold">
//             Loading payment status...
//           </p>
//         </div>
//       }
//     >
//       <PaymentCallbackContent />
//     </Suspense>
//   );
// }


// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// import PaymentFailed from "@/components/payments/PaymentFailed";
// import PaymentSuccess from "@/components/payments/PaymentSuccess";

// type PaymentStatus = "success" | "failed" | "pending";

// interface PaymentStatusResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     paymentStatus?: string;
//   };
// }

// const API_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ??
//   "http://localhost:5000/api/v1";

// function PaymentCallbackContent() {
//   const searchParams = useSearchParams();

//   const paymentID = searchParams.get("paymentID");
//   const status = searchParams.get("status");

//   const [loading, setLoading] = useState(true);
//   const [paymentStatus, setPaymentStatus] =
//     useState<PaymentStatus>("pending");
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     async function verifyPayment() {
//       if (!paymentID || !status) {
//         setPaymentStatus("failed");
//         setErrorMessage("Invalid payment parameters.");
//         setLoading(false);
//         return;
//       }

//       if (status !== "success") {
//         setPaymentStatus("failed");
//         setErrorMessage("Payment was not completed.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const params = new URLSearchParams({ paymentID });

//         const response = await fetch(
//           `${API_URL}/bkash/payment-status?${params.toString()}`,
//           {
//             method: "GET",
//             credentials: "include",
//             cache: "no-store",
//           },
//         );

//         const result: PaymentStatusResponse =
//           await response.json();

//         if (!response.ok || !result.success) {
//           throw new Error(
//             result.message || "Payment verification failed.",
//           );
//         }

//         if (cancelled) return;

//         if (result.data?.paymentStatus === "PAID") {
//           setPaymentStatus("success");
//           setErrorMessage("");
//         } else if (
//           result.data?.paymentStatus === "PENDING"
//         ) {
//           setPaymentStatus("pending");
//           setErrorMessage("Payment is still being processed.");
//         } else {
//           setPaymentStatus("failed");
//           setErrorMessage(
//             result.message || "Payment verification failed.",
//           );
//         }
//       } catch (error) {
//         if (cancelled) return;

//         console.error("Payment verification error:", error);

//         setPaymentStatus("failed");
//         setErrorMessage(
//           error instanceof Error
//             ? error.message
//             : "Unable to verify payment.",
//         );
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     void verifyPayment();

//     return () => {
//       cancelled = true;
//     };
//   }, [paymentID, status]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center p-6">
//         <p className="text-center text-lg font-semibold">
//           Verifying your payment...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-6">
//       {paymentStatus === "success" ? (
//         <PaymentSuccess />
//       ) : (
//         <PaymentFailed />
//       )}

//       {errorMessage && (
//         <p
//           role="alert"
//           className="mt-4 text-center text-sm text-red-600"
//         >
//           {errorMessage}
//         </p>
//       )}
//     </div>
//   );
// }

// export default function PaymentCallbackPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex min-h-screen items-center justify-center p-6">
//           <p className="text-lg font-semibold">
//             Loading payment status...
//           </p>
//         </div>
//       }
//     >
//       <PaymentCallbackContent />
//     </Suspense>
//   );
// }


"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import PaymentFailed from "@/components/payments/PaymentFailed";
import PaymentSuccess from "@/components/payments/PaymentSuccess";

type PaymentStatus = "success" | "failed" | "pending";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const paymentID = searchParams.get("paymentID");

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("pending");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!paymentID || !status) {
      setPaymentStatus("failed");
      setErrorMessage("Invalid payment callback parameters.");
      setLoading(false);
      return;
    }

    if (
      status !== "success" &&
      status !== "failed" &&
      status !== "pending"
    ) {
      setPaymentStatus("failed");
      setErrorMessage("Invalid payment status.");
      setLoading(false);
      return;
    }

    setPaymentStatus(status);

    if (status === "failed") {
      setErrorMessage("Your bKash payment was not completed.");
    } else if (status === "pending") {
      setErrorMessage(
        "Your payment is still being processed. Please check your purchase history.",
      );
    } else {
      setErrorMessage("");
    }

    setLoading(false);
  }, [paymentID, status]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-center text-lg font-semibold">
          Checking payment result...
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      {paymentStatus === "success" ? (
        <PaymentSuccess />
      ) : (
        <PaymentFailed />
      )}

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 max-w-md text-center text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-6">
          <p className="text-lg font-semibold">
            Loading payment result...
          </p>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
