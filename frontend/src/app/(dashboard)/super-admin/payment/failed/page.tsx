"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();

  const reason = searchParams.get("reason");

  const message =
    reason === "cancelled"
      ? "You cancelled the bKash payment."
      : reason === "payment_failed"
        ? "The bKash payment could not be completed."
        : "We could not complete your payment.";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="size-12 text-red-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Payment Failed
        </h1>

        <p className="mt-2 text-muted-foreground">
          {message}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline">
            <Link href="/asset-purchases">
              Back to Purchases
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}