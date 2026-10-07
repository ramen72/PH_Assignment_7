"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateBkashPayment } from "@/hooks";

interface BkashPayButtonProps {
  purchaseId: string;
  paymentStatus: string;
}

export function BkashPayButton({
  purchaseId,
  paymentStatus,
}: BkashPayButtonProps) {
  const { mutate, isPending } = useCreateBkashPayment();

  const handlePayment = () => {
    mutate(purchaseId, {
      onSuccess: (response) => {
        const paymentUrl = response?.data?.paymentUrl;

        if (!paymentUrl) {
          console.error("bKash payment URL not found");
          return;
        }

        window.location.href = paymentUrl;
      },
      onError: (error) => {
        console.error("bKash payment creation failed", error);
      },
    });
  };

  if (paymentStatus === "PAID") {
    return (
      <Button disabled>
        Payment Completed
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={isPending}
    >
      {isPending && (
        <Loader2 className="mr-2 size-4 animate-spin" />
      )}

      {isPending ? "Processing..." : "Pay with bKash"}
    </Button>
  );
}