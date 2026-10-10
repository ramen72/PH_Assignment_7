
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  ExternalLink,
  Eye,
  Filter,
  LayoutGrid,
  RefreshCw,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { useGetAllPayment } from "@/hooks";
import { Payment } from "@/types";
// import { useGetAllPayments } from "@/hooks/payment.hook";
// import type { Payment } from "@/types/payment.types";

const PAGE_SIZE = 10;

const formatMoney = (
  amount: string | number,
  currency = "BDT",
) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
};

const formatDate = (date: string | null) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
};

const shortId = (id: string, length = 8) =>
  id ? id.slice(0, length).toUpperCase() : "—";

function PaymentProviderIcon({
  provider,
}: {
  provider: string;
}) {
  const normalized = provider.toUpperCase();

  const colors: Record<string, string> = {
    BKASH: "bg-pink-100 text-pink-700",
    STRIPE: "bg-indigo-100 text-indigo-700",
    NAGAD: "bg-orange-100 text-orange-700",
    ROCKET: "bg-purple-100 text-purple-700",
  };

  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
        colors[normalized] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      <Wallet className="size-5" />
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  loading,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  loading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm ring-1 ring-slate-200/70 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            {loading ? (
              <Skeleton className="mt-3 h-8 w-32" />
            ) : (
              <h3 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {value}
              </h3>
            )}

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {description}
            </p>
          </div>

          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${gradient}`}
          >
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border p-4"
        >
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [provider, setProvider] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Adjust the hook arguments and response shape to match your API.
  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllPayment();

  // Supports either { data: Payment[] } or a direct Payment[] response.
  const payments: Payment[] = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !term ||
        payment.id.toLowerCase().includes(term) ||
        payment.purchaseId.toLowerCase().includes(term) ||
        (payment.transactionId ?? "").toLowerCase().includes(term) ||
        payment.provider.toLowerCase().includes(term);

      const matchesStatus =
        status === "ALL" || payment.paymentStatus === status;

      const matchesProvider =
        provider === "ALL" || payment.provider === provider;

      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [payments, search, status, provider]);

  // These figures describe the currently fetched API page.
  // Use backend aggregate statistics for accurate global totals.
  const stats = useMemo(() => {
    const paid = payments.filter(
      (payment) => payment.paymentStatus === "PAID",
    );

    const pending = payments.filter(
      (payment) => payment.paymentStatus === "PENDING",
    );

    return {
      count: payments.length,
      paidCount: paid.length,
      paidAmount: paid.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0,
      ),
      pendingAmount: pending.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0,
      ),
    };
  }, [payments]);

  const meta = Array.isArray(response)
    ? undefined
    : response?.meta;

  const totalPages = Math.max(
    1,
    meta?.totalPages ?? 1,
  );

  const totalRecords = meta?.total ?? payments.length;

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setProvider("ALL");
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)));
  };

  return (
    <main className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 size-56 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-sky-100">
                <ShieldCheck className="size-4" />
                Secure payment management
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Payments Overview
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Track transactions, monitor payment statuses,
                and manage asset purchase payments in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                <RefreshCw
                  className={`mr-2 size-4 ${
                    isFetching ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </div>
          </div>

          <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs text-slate-300 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              Payment tracking active
            </span>
            <span className="inline-flex items-center gap-2">
              <CreditCard className="size-4" />
              Multiple payment providers
            </span>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Fetched Payments"
            value={String(totalRecords)}
            description="Records reported by the API"
            icon={LayoutGrid}
            gradient="bg-sky-100 text-sky-700"
            loading={isLoading}
          />

          <StatCard
            title="Successful Payments"
            value={String(stats.paidCount)}
            description="Paid transactions on this page"
            icon={CheckCircle2}
            gradient="bg-emerald-100 text-emerald-700"
            loading={isLoading}
          />

          <StatCard
            title="Total Paid"
            value={formatMoney(stats.paidAmount)}
            description="Confirmed payments on this page"
            icon={ArrowUpRight}
            gradient="bg-violet-100 text-violet-700"
            loading={isLoading}
          />

          <StatCard
            title="Pending Amount"
            value={formatMoney(stats.pendingAmount)}
            description="Awaiting payment confirmation"
            icon={Clock3}
            gradient="bg-amber-100 text-amber-700"
            loading={isLoading}
          />
        </section>

        {/* Main list */}
        <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200/70">
          <CardHeader className="gap-4 border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-lg font-bold sm:text-xl">
                  Transaction History
                </CardTitle>
                <p className="mt-1 text-sm text-slate-500">
                  Search and review asset purchase payments.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="size-2 rounded-full bg-emerald-500" />
                {filteredPayments.length} displayed
              </div>
            </div>

            {/* Search and filters */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search transaction or purchase ID..."
                  className="h-11 border-slate-200 bg-white pl-9"
                />
              </div>

              <Select
                value={status}
                onValueChange={(value) => {
                    if(!value) return
                  setStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-11 w-full">
                  <Filter className="mr-2 size-4 text-slate-400" />
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={provider}
                onValueChange={(value) => {
                    if(!value) return
                  setProvider(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Payment provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All providers</SelectItem>
                  <SelectItem value="BKASH">bKash</SelectItem>
                  <SelectItem value="STRIPE">Stripe</SelectItem>
                  <SelectItem value="NAGAD">Nagad</SelectItem>
                  <SelectItem value="ROCKET">Rocket</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-11"
              >
                Reset filters
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-5 sm:p-6">
                <PaymentSkeleton />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center px-5 py-16 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <RefreshCw className="size-6" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  Unable to load payments
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Please check your connection and try again.
                </p>
                <Button
                  onClick={() => refetch()}
                  className="mt-5"
                >
                  Try again
                </Button>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center px-5 py-16 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <Search className="size-6" />
                </div>
                <h3 className="font-semibold text-slate-900">
                  No payments found
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  No transactions match your current search
                  and filters.
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="mt-5"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1050px] text-left">
                    <thead className="bg-slate-50/80">
                      <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                        <th className="px-6 py-4 font-semibold">
                          Transaction
                        </th>
                        <th className="px-6 py-4 font-semibold">
                          Provider
                        </th>
                        <th className="px-6 py-4 font-semibold">
                          Amount
                        </th>
                        <th className="px-6 py-4 font-semibold">
                          Status
                        </th>
                        <th className="px-6 py-4 font-semibold">
                          Paid At
                        </th>
                        <th className="px-6 py-4 text-right font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="transition-colors hover:bg-sky-50/40"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <PaymentProviderIcon
                                provider={payment.provider}
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900">
                                  {payment.transactionId &&
                                  payment.transactionId !== '""'
                                    ? payment.transactionId
                                    : "Not generated yet"}
                                </p>
                                <p
                                  className="mt-1 text-xs text-slate-500"
                                  title={payment.purchaseId}
                                >
                                  Purchase #{shortId(payment.purchaseId)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-medium text-slate-700">
                              {payment.provider}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">
                              {formatMoney(
                                payment.amount,
                                payment.currency,
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {payment.currency}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <PaymentStatusBadge
                              status={payment.paymentStatus}
                            />
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-700">
                              {payment.paidAt
                                ? formatDate(payment.paidAt)
                                : "Not paid yet"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Created {formatDate(payment.createdAt)}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <Button                              
                              variant="outline"
                              nativeButton={false}
                              size="sm"
                              className="rounded-lg"
                              render={
                                <Link
                                href={`/super-admin/payments/${payment.id}`}
                                className="flex justify-center items-center gap-x-1"
                              >
                                <Eye className="size-4" />
                                View
                              </Link>
                              }
                            >
                              
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile and tablet cards */}
                <div className="grid grid-cols-1 gap-3 p-4 sm:p-5 lg:hidden">
                  {filteredPayments.map((payment) => (
                    <article
                      key={payment.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <PaymentProviderIcon
                          provider={payment.provider}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-all text-sm font-bold text-slate-900">
                              {payment.transactionId &&
                              payment.transactionId !== '""'
                                ? payment.transactionId
                                : "Not generated yet"}
                            </h3>
                            <PaymentStatusBadge
                              status={payment.paymentStatus}
                            />
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {payment.provider} · Purchase #
                            {shortId(payment.purchaseId)}
                          </p>

                          <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                            {formatMoney(
                              payment.amount,
                              payment.currency,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                        <div className="flex items-start gap-2">
                          <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Created
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-xs text-slate-500">
                              Paid at
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {formatDate(payment.paidAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="mt-4 w-full"
                      >
                        <Link
                          href={`/super-admin/payments/${payment.id}`}
                        >
                          <Eye className="mr-2 size-4" />
                          View payment details
                        </Link>
                      </Button>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-sm text-slate-500">
                    Page{" "}
                    <span className="font-semibold text-slate-900">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {totalPages}
                    </span>
                    <span className="hidden sm:inline">
                      {" "}· {totalRecords} total records
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1 || isFetching}
                      onClick={() => changePage(currentPage - 1)}
                    >
                      <ChevronLeft className="mr-1 size-4" />
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        currentPage >= totalPages || isFetching
                      }
                      onClick={() => changePage(currentPage + 1)}
                    >
                      Next
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="px-1 text-center text-xs text-slate-400">
          Payment information is displayed according to the
          latest data returned by your payment API.
        </p>
      </div>
    </main>
  );
}
