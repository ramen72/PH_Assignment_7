"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("paymentId");

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-4 size-16 text-green-500" />

        <h1 className="text-2xl font-bold">
          Payment Successful
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your asset purchase payment has been completed successfully.
        </p>

        {paymentId && (
          <p className="mt-4 text-sm text-muted-foreground">
            Payment ID: {paymentId}
          </p>
        )}
        <Button variant="outline" nativeButton={false} className={"mt-2"} render={<Link href="/super-admin/asset-purchases">
            Back to Purchases
          </Link>}>
          
        </Button>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
      </div>
    </div>
  );
}