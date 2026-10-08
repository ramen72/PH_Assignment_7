"use client";

import { useEffect, useRef } from "react";
import { Loader2, Smartphone } from "lucide-react";
// import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCreateBkashPayment } from "@/hooks";
import { toast } from "../ui/toast";
import type { BkashPayButtonProps } from "@/types";



export function BkashPayButton({
  purchaseId as ,
  disabled = false,
  className,
}: BkashPayButtonProps) {
  const { mutate, isPending, reset } =
    useCreateBkashPayment();

  const redirectingRef = useRef(false);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handlePayment = () => {
    if (!purchaseId) {
    toast.add({
        type: "error",
        title:"Purchase ID is required.",
        description:"Must Provide Purchase ID."
    })
      return;
    }

    if (isPending || redirectingRef.current) {
      return;
    }

    mutate(purchaseId, {
      onSuccess: (response) => {
        const paymentUrl = response?.data?.paymentUrl;

        if (!paymentUrl) {
          toast.add(
            {
                type: "error",
                title: "Payment URL not found.",
                description: "Unable to create bKash payment. Payment URL not found."
            }
          );
          return;
        }

        redirectingRef.current = true;

        toast.add({
            type:"success",
            title:"Redirecting to bKash...",
            description:"Redirect to Bkash Payment Gateway."
        })

        window.location.assign(paymentUrl);
      },

      onError: (error) => {
        redirectingRef.current = false;

        console.error(
          "bKash payment creation failed:",
          error,
        );

        toast.add(
          {
            type: "error",
            title:"Unable to start bKash payment.",
            description:"Unable to start bKash payment. Please try again.",
          }
        );
        console.log("Unable to start bKash payment. Please try again.")
      },
    });
  };

  return (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={
        disabled ||
        isPending ||
        redirectingRef.current
      }
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Smartphone className="mr-2 size-4" />
          Pay with bKash
        </>
      )}
    </Button>
  );
}