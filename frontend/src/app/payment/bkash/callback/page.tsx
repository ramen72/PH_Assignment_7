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
