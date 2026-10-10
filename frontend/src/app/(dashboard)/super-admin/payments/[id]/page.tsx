
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Hash,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  XCircle,
} from "lucide-react";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { useGetSinglePaymentsById } from "@/hooks";
import { Payment } from "@/types";

// import type { Payment } from "@/types/payment.types";

const formatMoney = (
  amount: string | number,
  currency = "BDT",
) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (value: string | null) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(date);
};

const displayTransactionId = (value: string | null) => {
  if (!value || !value.trim() || value === '""') {
    return "Not generated yet";
  }

  return value;
};

function DetailItem({
  label,
  value,
  icon: Icon,
  copyable = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  copyable?: boolean;
}) {
  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.add({
        type:"success",
        title:"copied successfully"
      });
    } catch {
      toast.add({
        type:"error",
        title:"Unable to copy. Please copy it manually."
      });
    }
  };

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 transition-colors hover:border-sky-200">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-all text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>

      {copyable && value !== "Not generated yet" && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={copyValue}
          aria-label={`Copy ${label}`}
        >
          <Copy className="size-4" />
        </Button>
      )}
    </div>
  );
}

function PaymentDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-52 rounded-3xl" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    </div>
  );
}

export default function SinglePaymentPage() {
  const params = useParams<{ id: string }>();
  const paymentId = params.id;
  console.log(params)

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetSinglePaymentsById(paymentId);
  
  

  // Supports both a direct Payment and { data: Payment }.
  const payment: Payment | null = response?.data[0]

console.log("API response:", response);
console.log("Extracted payment:", payment);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <PaymentDetailsSkeleton />
      </main>
    );
  }

  if (isError || !payment) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <Button nativeButton={false} variant="ghost" className="mb-6" render={<Link href="/super-admin/payments">
              <ArrowLeft className="mr-2 size-4" />
              Back to Payments
            </Link>}>
            
          </Button>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex flex-col items-center px-5 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <XCircle className="size-8" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                Payment not found
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                We could not load this payment. It may not exist,
                or the request may have failed.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button onClick={() => refetch()}>
                  <RefreshCw className="mr-2 size-4" />
                  Try again
                </Button>

                <Button nativeButton = {false} variant="outline"
                render={
                    <Link href="/super-admin/payments">
                    All Payments
                  </Link>
                }>
                  
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const isPaid = payment.paymentStatus === "PAID";
  const isPending = payment.paymentStatus === "PENDING";
  const transactionId = displayTransactionId(payment.transactionId);

  return (
    <main className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb and actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" className="-ml-3">
            <Link href="/super-admin/payments">
              <ArrowLeft className="mr-2 size-4" />
              Back to Payments
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 size-56 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-sky-100">
                <ShieldCheck className="size-4" />
                Payment Details
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Transaction Overview
              </h1>

              <p className="mt-2 break-all text-sm text-slate-300">
                Payment ID: {payment.id}
              </p>

              <div className="mt-4">
                <PaymentStatusBadge
                  status={payment.paymentStatus}
                />
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm md:min-w-64">
              <p className="text-sm text-slate-300">
                Payment Amount
              </p>

              <h2 className="mt-2 break-words text-3xl font-bold tracking-tight sm:text-4xl">
                {formatMoney(payment.amount, payment.currency)}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                <Wallet className="size-4" />
                {payment.provider}
                <span className="text-slate-500">·</span>
                {payment.currency}
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Payment information */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200/70">
              <CardHeader className="border-b border-slate-100 p-5 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="size-5 text-sky-600" />
                  Transaction Information
                </CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6">
                <DetailItem
                  label="Transaction ID"
                  value={transactionId}
                  icon={Hash}
                  copyable
                />

                <DetailItem
                  label="Payment Provider"
                  value={payment.provider}
                  icon={Wallet}
                />

                <DetailItem
                  label="Payment Status"
                  value={payment.paymentStatus}
                  icon={ShieldCheck}
                />

                <DetailItem
                  label="Amount"
                  value={formatMoney(
                    payment.amount,
                    payment.currency,
                  )}
                  icon={CreditCard}
                  copyable
                />

                <DetailItem
                  label="Payment Record ID"
                  value={payment.id}
                  icon={FileText}
                  copyable
                />

                <DetailItem
                  label="Related Purchase ID"
                  value={payment.purchaseId}
                  icon={ShoppingBag}
                  copyable
                />

                <DetailItem
                  label="User ID"
                  value={payment.userId}
                  icon={ShieldCheck}
                  copyable
                />

                <DetailItem
                  label="Currency"
                  value={payment.currency}
                  icon={Wallet}
                />
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 shadow-sm ring-1 ring-slate-200/70">
              <CardHeader className="p-5 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="size-5 text-violet-600" />
                  Payment Timeline
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Recorded timestamps for this transaction.
                </p>
              </CardHeader>

              <CardContent className="px-5 pb-6 sm:px-6">
                <div className="relative space-y-6">
                  <div className="absolute bottom-5 left-[15px] top-5 w-px bg-slate-200" />

                  <div className="relative flex gap-4">
                    <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 ring-4 ring-white">
                      <FileText className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1 pb-1">
                      <p className="font-semibold text-slate-900">
                        Payment created
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        The payment record was created.
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-600">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div
                      className={`z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                        isPaid
                          ? "bg-emerald-100 text-emerald-700"
                          : isPending
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isPaid ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Clock3 className="size-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pb-1">
                      <p className="font-semibold text-slate-900">
                        {isPaid
                          ? "Payment successful"
                          : isPending
                            ? "Awaiting confirmation"
                            : `Payment ${payment.paymentStatus.toLowerCase()}`}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {isPaid
                          ? "The payment is marked as paid."
                          : isPending
                            ? "The payment has not been confirmed as successful."
                            : "Review the provider response for further details."}
                      </p>

                      <p className="mt-2 text-xs font-medium text-slate-600">
                        {payment.paidAt
                          ? formatDate(payment.paidAt)
                          : `Last updated: ${formatDate(payment.updatedAt)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200/70">
              <CardHeader className="border-b border-slate-100 p-5">
                <CardTitle className="text-lg">
                  Payment Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Payment amount
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(payment.amount, payment.currency)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Provider
                  </span>
                  <span className="font-semibold text-slate-900">
                    {payment.provider}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>
                  <PaymentStatusBadge
                    status={payment.paymentStatus}
                  />
                </div>

                <Separator />

                <div className="space-y-1">
                  <p className="text-sm text-slate-500">
                    Paid At
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(payment.paidAt)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-slate-500">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(payment.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment provider link */}
            <Card className="border-0 shadow-sm ring-1 ring-slate-200/70">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base">
                  Payment Provider
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-2">
                <div className="flex items-center gap-3 rounded-xl bg-pink-50 p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-700">
                    <Wallet className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">
                      {payment.provider}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Payment gateway
                    </p>
                  </div>
                </div>

                {payment.paymentUrl && (
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => {
                      toast.add({
                        type: "success",
                        title:"Use the payment URL only if you trust the gateway and intend to open it.",

                      }
                      );
                    }}
                  >
                    <a
                      href={payment.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Payment URL
                      <ExternalLink className="ml-2 size-4" />
                    </a>
                  </Button>
                )}

                {!payment.paymentUrl && (
                  <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                    No payment URL is available for this record.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Purchase link */}
            <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm ring-1 ring-orange-100">
              <CardContent className="p-5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <ShoppingBag className="size-5" />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Related Purchase
                </h3>

                <p className="mt-2 break-all text-xs leading-5 text-slate-600">
                  {payment.purchaseId}
                </p>

                <Button
                  variant="outline"
                  className="mt-4 w-full border-orange-200 bg-white hover:bg-orange-100"
                >
                  <Link
                    href={`/super-admin/asset-purchases/${payment.purchaseId}`}
                    className="flex justify-center items-center"
                  >
                    View Purchase
                    <ArrowUpRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
