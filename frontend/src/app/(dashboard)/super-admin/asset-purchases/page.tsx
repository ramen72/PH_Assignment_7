"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  FileText,
  Loader2,
  MoreHorizontal,
  Package,
  RefreshCw,
  Search,
  Store,
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
import {
  Badge,
} from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAllAssetPurchases, useCreateBkashPayment } from '@/hooks';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | string;

interface Asset {
  id: string;
  name: string;
  assetTag?: string;
}

interface Vendor {
  id: string;
  name: string;
  companyName?: string | null;
}

interface AssetPurchase {
  id: string;
  invoiceNumber: string;
  quantity: number;
  unitPrice: number | string;
  totalAmount: number | string;
  purchaseDate: string;
  paymentStatus: PaymentStatus;
  invoiceUrl?: string | null;
  remarks?: string | null;

  asset?: Asset | null;
  vendor?: Vendor | null;
}

interface PurchaseResponse {
  data?: AssetPurchase[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatCurrency = (value: number | string) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "৳0.00";
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getPaymentStatusBadge = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return (
        <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50">
          Paid
        </Badge>
      );

    case "PENDING":
      return (
        <Badge className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
          Pending
        </Badge>
      );

    case "FAILED":
      return (
        <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
          Failed
        </Badge>
      );

    case "CANCELLED":
      return (
        <Badge className="border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-50">
          Cancelled
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AssetPurchasesPage() {
  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [search, setSearch] = useState("");

  const [paymentStatus, setPaymentStatus] =
    useState<string>("ALL");

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  /* ------------------------------------------------------------------------ */
  /* Query                                                                    */
  /* ------------------------------------------------------------------------ */

  const [payingPurchaseId, setPayingPurchaseId] = useState<string | null>(
  null,
);

  const {
  mutate: createPayment,
  isPending: isPaymentPending,
} = useCreateBkashPayment();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllAssetPurchases({
    page,
    limit,
  });

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
  /* ------------------------------------------------------------------------ */
  /* Normalize API response                                                   */
  /* ------------------------------------------------------------------------ */

  const response = data as PurchaseResponse | undefined;

  const purchases = response?.data ?? [];

  const total = response?.meta?.total ?? purchases.length;

  const totalPages =
    response?.meta?.totalPages ??
    Math.max(1, Math.ceil(total / limit));

  /* ------------------------------------------------------------------------ */
  /* Client-side search/filter                                                */
  /* ------------------------------------------------------------------------ */

  const filteredPurchases = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return purchases.filter((purchase) => {
      const matchesSearch =
        !keyword ||
        purchase.invoiceNumber
          ?.toLowerCase()
          .includes(keyword) ||
        purchase.asset?.name
          ?.toLowerCase()
          .includes(keyword) ||
        purchase.asset?.assetTag
          ?.toLowerCase()
          .includes(keyword) ||
        purchase.vendor?.name
          ?.toLowerCase()
          .includes(keyword) ||
        purchase.vendor?.companyName
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        paymentStatus === "ALL" ||
        purchase.paymentStatus === paymentStatus;

      return matchesSearch && matchesStatus;
    });
  }, [purchases, search, paymentStatus]);

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const statistics = useMemo(() => {
    const totalPurchases = purchases.length;

    const paidPurchases = purchases.filter(
      (purchase) => purchase.paymentStatus === "PAID",
    ).length;

    const pendingPurchases = purchases.filter(
      (purchase) => purchase.paymentStatus === "PENDING",
    ).length;

    const totalAmount = purchases.reduce(
      (sum, purchase) =>
        sum + Number(purchase.totalAmount || 0),
      0,
    );

    return {
      totalPurchases,
      paidPurchases,
      pendingPurchases,
      totalAmount,
    };
  }, [purchases]);

  /* ------------------------------------------------------------------------ */
  /* Handlers                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setPaymentStatus(value);
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((current) => current - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((current) => current + 1);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading purchases...
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (isError) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            <div className="rounded-full bg-red-100 p-3">
              <RefreshCw className="size-6 text-red-600" />
            </div>

            <div>
              <h3 className="font-semibold">
                Failed to load purchases
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Something went wrong while loading purchase records.
              </p>
            </div>

            <Button
              onClick={() => refetch()}
              variant="outline"
            >
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      
      {/* Header                                                             */}
      

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="size-6 text-primary" />

            <h1 className="text-2xl font-bold tracking-tight">
              Asset Purchases
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage asset purchases, invoices and payments.
          </p>
        </div>

        <Button>
          <Link href="/super-admin/asset-purchases/create">
            Create Purchase
          </Link>
        </Button>
      </div>

      
      {/* Statistics                                                         */}
      

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Purchases
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {statistics.totalPurchases}
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-3">
                <Package className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Paid
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {statistics.paidPurchases}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-3">
                <FileText className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold text-yellow-600">
                  {statistics.pendingPurchases}
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 p-3">
                <CalendarDays className="size-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Amount
                </p>

                <p className="mt-2 text-xl font-bold">
                  {formatCurrency(statistics.totalAmount)}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3">
                <Store className="size-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
      {/* Main Card                                                          */}
      

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Purchase Records</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                View and manage all asset purchases.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
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
        </CardHeader>

        <CardContent>
          {/* -------------------------------------------------------------- */}
          {/* Filters                                                        */}
          {/* -------------------------------------------------------------- */}

          <div className="mb-6 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  handleSearch(event.target.value)
                }
                placeholder="Search invoice, asset, vendor..."
                className="pl-9"
              />
            </div>

            <Select
              value={paymentStatus}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">
                  All Status
                </SelectItem>

                <SelectItem value="PENDING">
                  Pending
                </SelectItem>

                <SelectItem value="PAID">
                  Paid
                </SelectItem>

                <SelectItem value="FAILED">
                  Failed
                </SelectItem>

                <SelectItem value="CANCELLED">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Table                                                          */}
          {/* -------------------------------------------------------------- */}

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>

                  <TableHead>Asset</TableHead>

                  <TableHead>Vendor</TableHead>

                  <TableHead>Quantity</TableHead>

                  <TableHead>Unit Price</TableHead>

                  <TableHead>Total</TableHead>

                  <TableHead>Purchase Date</TableHead>

                  <TableHead>Payment</TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Package className="mb-2 size-8 text-muted-foreground/50" />

                        <p className="font-medium">
                          No purchases found
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      {/* Invoice */}
                      <TableCell>
                        <div className="font-medium">
                          {purchase.invoiceNumber}
                        </div>
                      </TableCell>

                      {/* Asset */}
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {purchase.asset?.name ?? "-"}
                          </p>

                          {purchase.asset?.assetTag && (
                            <p className="text-xs text-muted-foreground">
                              {purchase.asset.assetTag}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Vendor */}
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {purchase.vendor?.name ?? "-"}
                          </p>

                          {purchase.vendor?.companyName && (
                            <p className="text-xs text-muted-foreground">
                              {purchase.vendor.companyName}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Quantity */}
                      <TableCell>
                        {purchase.quantity}
                      </TableCell>

                      {/* Unit Price */}
                      <TableCell>
                        {formatCurrency(
                          purchase.unitPrice,
                        )}
                      </TableCell>

                      {/* Total */}
                      <TableCell>
                        <span className="font-semibold">
                          {formatCurrency(
                            purchase.totalAmount,
                          )}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        {formatDate(
                          purchase.purchaseDate,
                        )}
                      </TableCell>

                      {/* Payment */}
                      <TableCell>
                        {getPaymentStatusBadge(
                          purchase.paymentStatus,
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted"
                              title="Actions"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Open actions</span>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem>
                                <Link
                                  href={`/asset-purchases/${purchase.id}`}
                                  className="flex cursor-pointer items-center"
                                >
                                  <Eye className="mr-2 size-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>

                              {purchase.paymentStatus === "PENDING" && (
                                <DropdownMenuItem
                                  disabled={
                                    isPaymentPending &&
                                    payingPurchaseId === purchase.id
                                  }
                                  onClick={() => handlePayNow(purchase.id)}
                                  className="cursor-pointer"
                                >
                                  {isPaymentPending &&
                                    payingPurchaseId === purchase.id ? (
                                    <>
                                      <Loader2 className="mr-2 size-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CreditCard className="mr-2 size-4" />
                                      Pay Now
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Pagination                                                     */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>

              <Select
                value={String(limit)}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="10">
                    10
                  </SelectItem>

                  <SelectItem value="20">
                    20
                  </SelectItem>

                  <SelectItem value="50">
                    50
                  </SelectItem>

                  <SelectItem value="100">
                    100
                  </SelectItem>
                </SelectContent>
              </Select>

              <span>
                Page {page} of {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 1 || isFetching}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={
                  page >= totalPages || isFetching
                }
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}