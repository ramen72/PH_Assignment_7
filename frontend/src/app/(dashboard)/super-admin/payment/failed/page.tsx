"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <XCircle className="mx-auto mb-4 size-16 text-red-500" />

        <h1 className="text-2xl font-bold">
          Payment Failed
        </h1>

        <p className="mt-2 text-muted-foreground">
          Your bKash payment could not be completed.
        </p>

        <Button asChild className="mt-6">
          <Link href="/asset-purchases">
            Back to Purchases
          </Link>
        </Button>
      </div>
    </div>
  );
}