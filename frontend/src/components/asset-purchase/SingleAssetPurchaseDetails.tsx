"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    FileText,
    Hash,
    Laptop,
    Loader2,
    MapPin,
    Package,
    RefreshCw,
    Receipt,
    ShieldCheck,
    Store,
    Tag,
    UserRound,
    XCircle,
    BadgeCheck,
} from "lucide-react";

import { useCreateBkashPayment, useGetSingleAssetPurchaseById } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
    assetPurchaseId: string;
}

interface AssetPurchase {
    id: string;
    invoiceNumber: string;
    quantity: number;
    unitPrice: number | string;
    totalAmount: number | string;
    purchaseDate: string;
    paymentStatus: string;
    invoiceUrl?: string | null;
    remarks?: string | null;
    asset?: {
        id: string;
        name: string;
        assetTag?: string;
        brand?: string;
        model?: string;
        serialNumber?: string;
    } | null;
    vendor?: {
        id: string;
        name: string;
        companyName?: string | null;
    } | null;
}

interface ApiResponse {
    success?: boolean;
    message?: string;
    data?: AssetPurchase;
}

const formatCurrency = (value: number | string) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) return "৳0.00";

    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("en-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

const getStatusConfig = (status: string) => {
    const normalizedStatus = status?.toUpperCase();

    switch (normalizedStatus) {
        case "PAID":
            return {
                label: "Paid",
                icon: CheckCircle2,
                badge:
                    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
                dot: "bg-emerald-500",
            };

        case "PENDING":
            return {
                label: "Pending",
                icon: Clock3,
                badge:
                    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
                dot: "bg-amber-500",
            };

        case "FAILED":
            return {
                label: "Failed",
                icon: XCircle,
                badge:
                    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
                dot: "bg-red-500",
            };

        case "CANCELLED":
            return {
                label: "Cancelled",
                icon: XCircle,
                badge:
                    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
                dot: "bg-slate-500",
            };

        default:
            return {
                label: normalizedStatus || "Unknown",
                icon: ShieldCheck,
                badge:
                    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
                dot: "bg-blue-500",
            };
    }
};

function PaymentBadge({ status }: { status: string }) {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
        <Badge
            variant="outline"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.badge}`}
        >
            <StatusIcon className="size-3.5" />
            {config.label}
        </Badge>
    );
}

function DetailItem({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value?: ReactNode;
    icon?: typeof Hash;
}) {
    return (
        <div className="group min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-900 dark:hover:bg-blue-950/20 sm:p-4">
            <div className="mb-2 flex items-center gap-2">
                {Icon && (
                    <Icon className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600" />
                )}

                <p className="text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
                    {label}
                </p>
            </div>

            <div className="break-words text-sm font-semibold leading-6 text-foreground sm:text-[15px]">
                {value ?? "-"}
            </div>
        </div>
    );
}

function SectionCard({
    title,
    description,
    icon: Icon,
    iconClass,
    children,
    className = "",
}: {
    title: string;
    description: string;
    icon: typeof Receipt;
    iconClass: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <Card
            className={`group h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 ${className}`}
        >
            <CardHeader className="border-b border-slate-100 px-4 py-5 dark:border-slate-800 sm:px-6">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                    >
                        <Icon className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <CardTitle className="text-base font-bold tracking-tight sm:text-lg">
                            {title}
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                            {description}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
                {children}
            </CardContent>
        </Card>
    );
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    gradient,
    iconBackground,
}: {
    title: string;
    value: string;
    description: string;
    icon: typeof Receipt;
    gradient: string;
    iconBackground: string;
}) {
    return (
        <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800">
            <div
                className={`absolute inset-x-0 top-0 h-1 ${gradient}`}
            />

            <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-slate-100/70 transition-transform duration-500 group-hover:scale-150 dark:bg-slate-800/40" />

            <CardContent className="relative flex min-w-0 items-start justify-between gap-3 p-4 pt-6 sm:p-5 sm:pt-7">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                        {title}
                    </p>

                    <p className="mt-3 break-words text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                        {value}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 sm:size-12 ${iconBackground}`}
                >
                    <Icon className="size-5 sm:size-6" />
                </div>
            </CardContent>
        </Card>
    );
}

function LoadingState() {
    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="animate-pulse space-y-3">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-10 w-64 max-w-full rounded-lg bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-36 animate-pulse rounded-2xl border bg-muted/40"
                    />
                ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-64 animate-pulse rounded-2xl border bg-muted/40"
                    />
                ))}
            </div>
        </div>
    );
}

export default function SingleAssetPurchaseDetails({
    assetPurchaseId,
}: Props) {

    const [payingPurchaseId, setPayingPurchaseId] = useState<string | null>(
        null,
    );


    // Collect Single Asset Purchase Data
    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useGetSingleAssetPurchaseById(assetPurchaseId);

    //   Pay Now 
    const {
        mutate: createPayment,
        isPending: isPaymentPending,
    } = useCreateBkashPayment();

    const handlePayNow = (purchaseId: string) => {
        setPayingPurchaseId(purchaseId);

        createPayment(purchaseId, {
            onSuccess: (response) => {
                setPayingPurchaseId(null);

                const paymentUrl =
                    response?.data?.paymentUrl ??
                    response?.data?.bkashURL ??
                    response?.data?.bkashUrl;

                if (paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                }

                console.error("bKash payment URL not found:", response);
            },

            onError: (error) => {
                setPayingPurchaseId(null);

                console.error("Failed to create bKash payment:", error);
            },
        });
    };

    const response = data as ApiResponse | undefined;
    const purchase = response?.data;

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError || !purchase) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-4 sm:p-8">
                <Card className="w-full max-w-lg overflow-hidden rounded-3xl border-0 shadow-xl">
                    <div className="h-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400" />

                    <CardContent className="flex flex-col items-center px-5 py-10 text-center sm:px-8 sm:py-12">
                        <div className="mb-5 flex size-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">
                            <Package className="size-10" />
                        </div>

                        <h2 className="text-xl font-bold tracking-tight">
                            Unable to load purchase
                        </h2>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                            The purchase may not exist, or the request failed.
                            Please try again.
                        </p>

                        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                variant="outline"
                                className="rounded-xl"

                            >
                                <Link href="/super-admin/asset-purchases">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Back to Purchases
                                </Link>
                            </Button>

                            <Button
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <RefreshCw
                                    className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""
                                        }`}
                                />
                                Retry
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statusConfig = getStatusConfig(purchase.paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen space-y-6 bg-slate-50/70 p-3 dark:bg-slate-950/40 sm:space-y-8 sm:p-5 md:p-6 lg:p-8">
            {/* Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* <Button
          variant="ghost"
          
          className="-ml-2 rounded-xl text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40"
        >
          <Link href="/super-admin/asset-purchases">
            <ArrowLeft className="mr-2 size-4" />
            All Purchases
          </Link>
        </Button> */}
                <Button
                    className="w-full rounded-xl bg-[#0d719e] text-white shadow-sm transition-all hover:bg-[#095c82] hover:shadow-md sm:w-auto"
                    render={<Link href="/super-admin/asset-purchases" className="flex items-center">
                        <ArrowLeft className="mr-2 size-4" />
                        All Purchases
                    </Link>}
                    nativeButton={false}
                ></Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    <span className="hidden sm:inline">Asset Management</span>
                    <span className="hidden sm:inline">/</span>
                    <span className="font-semibold text-foreground">
                        Purchase Details
                    </span>
                </div>
            </div>

            {/* Hero */}
            <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d719e] via-[#155e9a] to-[#4338a8] text-white shadow-xl shadow-blue-950/10">
                <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border-[35px] border-white/[0.07]" />
                <div className="pointer-events-none absolute -bottom-32 right-1/4 size-72 rounded-full bg-cyan-300/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 bottom-0 size-52 rounded-full bg-orange-400/10 blur-3xl" />

                <div className="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-9">
                    <div className="min-w-0">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50 backdrop-blur-md">
                            <Receipt className="size-3.5" />
                            Purchase Management
                        </div>

                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner backdrop-blur-md sm:size-14">
                                <FileText className="size-6 sm:size-7" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                                    Purchase Details
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-blue-100 sm:text-base">
                                    Review transaction, asset and vendor information
                                    in one place.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                                <Hash className="size-4 shrink-0 text-cyan-200" />
                                <span className="text-xs text-blue-100 sm:text-sm">
                                    Invoice
                                </span>
                                <span className="break-all text-sm font-bold sm:text-base">
                                    {purchase.invoiceNumber || "-"}
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-md lg:min-w-64">
                        <div className="flex items-center gap-2 text-sm text-blue-100">
                            <CreditCard className="size-4" />
                            Total Purchase Value
                        </div>

                        <p className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
                            {formatCurrency(purchase.totalAmount)}
                        </p>

                        <div className="h-px bg-white/15" />

                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-blue-100">Payment status</span>
                            <Badge variant="outline" className={`${purchase.paymentStatus === "PENDING" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} text-md`}>
                                <BadgeCheck data-icon="inline-start" />
                                {purchase.paymentStatus}
                            </Badge>
                        </div>
                        {
                            purchase.paymentStatus !== "PAID" && (
                                <>
                                    <div className="h-px bg-white/15" />
                                    <div className="flex justify-center items-center">
                                        <Button
                                            onClick={() => handlePayNow(purchase.id)}
                                            // variant={"secondary"} className={`w-full text-md`}>Pay now</Button>
                                            className={`w-full mb-5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-md font-medium text-blue-50 backdrop-blur-md mb-0`}>Pay Now</Button>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </section>

            {/* Summary Cards */}
            <section>
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#f15825]" />
                    <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                        Purchase Overview
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Amount"
                        value={formatCurrency(purchase.totalAmount)}
                        description="Total transaction value"
                        icon={CreditCard}
                        gradient="bg-gradient-to-r from-blue-500 to-cyan-400"
                        iconBackground="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300"
                    />

                    <SummaryCard
                        title="Quantity"
                        value={String(purchase.quantity)}
                        description="Units in this purchase"
                        icon={Package}
                        gradient="bg-gradient-to-r from-violet-500 to-purple-400"
                        iconBackground="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300"
                    />

                    <SummaryCard
                        title="Unit Price"
                        value={formatCurrency(purchase.unitPrice)}
                        description="Price per unit"
                        icon={Store}
                        gradient="bg-gradient-to-r from-orange-500 to-amber-400"
                        iconBackground="bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300"
                    />

                    <SummaryCard
                        title="Purchase Date"
                        value={formatDate(purchase.purchaseDate)}
                        description="Recorded transaction date"
                        icon={CalendarDays}
                        gradient="bg-gradient-to-r from-emerald-500 to-teal-400"
                        iconBackground="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                    />
                </div>
            </section>

            {/* Details Grid */}
            <section>
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-5 w-1 rounded-full bg-[#0d719e]" />
                    <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                        Transaction Information
                    </h2>
                </div>

                <div className="grid items-stretch gap-5 xl:grid-cols-2">
                    {/* Purchase Information */}
                    <SectionCard
                        title="Purchase Information"
                        description="Invoice and payment breakdown"
                        icon={Receipt}
                        iconClass="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    >
                        <DetailItem
                            label="Invoice Number"
                            value={purchase.invoiceNumber}
                            icon={FileText}
                        />

                        <DetailItem
                            label="Purchase Date"
                            value={formatDate(purchase.purchaseDate)}
                            icon={CalendarDays}
                        />

                        <DetailItem
                            label="Quantity"
                            value={purchase.quantity}
                            icon={Package}
                        />

                        <DetailItem
                            label="Unit Price"
                            value={formatCurrency(purchase.unitPrice)}
                            icon={CreditCard}
                        />

                        <DetailItem
                            label="Total Amount"
                            value={
                                <span className="text-base font-extrabold text-blue-700 dark:text-blue-300">
                                    {formatCurrency(purchase.totalAmount)}
                                </span>
                            }
                            icon={CreditCard}
                        />

                        <DetailItem
                            label="Payment Status"
                            value={
                                <PaymentBadge status={purchase.paymentStatus} />
                            }
                            icon={ShieldCheck}
                        />
                    </SectionCard>

                    {/* Asset Information */}
                    <SectionCard
                        title="Asset Information"
                        description="Specifications of the purchased asset"
                        icon={Laptop}
                        iconClass="bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                    >
                        <DetailItem
                            label="Asset Name"
                            value={purchase.asset?.name}
                            icon={Package}
                        />

                        <DetailItem
                            label="Asset Tag"
                            value={
                                purchase.asset?.assetTag ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-100 px-2 py-1 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                                        <Tag className="size-3.5" />
                                        {purchase.asset.assetTag}
                                    </span>
                                ) : (
                                    "-"
                                )
                            }
                            icon={Hash}
                        />

                        <DetailItem
                            label="Brand"
                            value={purchase.asset?.brand}
                            icon={Store}
                        />

                        <DetailItem
                            label="Model"
                            value={purchase.asset?.model}
                            icon={Laptop}
                        />

                        <DetailItem
                            label="Serial Number"
                            value={purchase.asset?.serialNumber}
                            icon={Hash}
                        />

                        <DetailItem
                            label="Asset ID"
                            value={
                                purchase.asset?.id ? (
                                    <span className="break-all font-mono text-xs">
                                        {purchase.asset.id}
                                    </span>
                                ) : (
                                    "-"
                                )
                            }
                            icon={ShieldCheck}
                        />
                    </SectionCard>

                    {/* Vendor Information */}
                    <SectionCard
                        title="Vendor Information"
                        description="Supplier details for this purchase"
                        icon={Store}
                        iconClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    >
                        <DetailItem
                            label="Vendor Name"
                            value={purchase.vendor?.name}
                            icon={UserRound}
                        />

                        <DetailItem
                            label="Company Name"
                            value={purchase.vendor?.companyName}
                            icon={Store}
                        />

                        <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/20 sm:col-span-2">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <ShieldCheck className="size-5" />
                                </div>

                                <div>
                                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                                        Supplier Record
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-emerald-800/80 dark:text-emerald-300/80">
                                        Vendor information is associated with this
                                        purchase transaction.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {purchase.vendor?.id && (
                            <DetailItem
                                label="Vendor ID"
                                value={
                                    <span className="break-all font-mono text-xs">
                                        {purchase.vendor.id}
                                    </span>
                                }
                                icon={Hash}
                            />
                        )}
                    </SectionCard>

                    {/* Additional Information */}
                    <SectionCard
                        title="Additional Information"
                        description="Remarks and supporting documents"
                        icon={FileText}
                        iconClass="bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                    >
                        <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 dark:border-orange-950 dark:bg-orange-950/20 sm:col-span-2">
                            <div className="mb-2 flex items-center gap-2">
                                <FileText className="size-4 text-orange-600 dark:text-orange-300" />
                                <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">
                                    Purchase Remarks
                                </p>
                            </div>

                            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                                {purchase.remarks?.trim() ||
                                    "No remarks provided for this purchase."}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50 sm:col-span-2">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                                        <FileText className="size-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="font-semibold">
                                            Invoice Document
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                            Supporting purchase invoice
                                        </p>
                                    </div>
                                </div>

                                {purchase.invoiceUrl ? (
                                    <Button
                                        className="w-full shrink-0 rounded-xl bg-[#f15825] text-white shadow-sm transition-all hover:bg-[#d94718] hover:shadow-md sm:w-auto"
                                    >
                                        <Link
                                            href={purchase.invoiceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex"
                                        >
                                            View Invoice
                                            <ArrowUpRight className="ml-2 size-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="w-fit rounded-lg px-3 py-2 text-muted-foreground"
                                    >
                                        No document uploaded
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-slate-100/80 p-4 dark:bg-slate-900 sm:col-span-2">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-slate-500" />

                            <p className="text-xs leading-5 text-muted-foreground">
                                This page displays the purchase information
                                returned by the asset management API.
                            </p>
                        </div>
                    </SectionCard>
                </div>
            </section>

            {/* Bottom Navigation */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-card p-4 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                    <p className="font-semibold">Finished reviewing this purchase?</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Return to your purchase records.
                    </p>
                </div>

                <Button
                    className="w-full rounded-xl bg-[#0d719e] text-white shadow-sm transition-all hover:bg-[#095c82] hover:shadow-md sm:w-auto"
                    render={<Link href="/super-admin/asset-purchases" className="flex items-center">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Purchases
                    </Link>}
                    nativeButton={false}
                >

                </Button>
            </div>
        </div>
    );
}
