"use client";

import Image from "next/image";

import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Hash,
  MapPin,
  Package,
  Pencil,
  ShieldCheck,
  Tag,
  User,
  XCircle,
} from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useGetAssetById } from "@/hooks";

import type { Asset } from "@/types";
import { Separator } from "../ui/separator";

interface AssetDetailsDialogProps {
  assetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssetDetailsDialog = ({
  assetId,
  open,
  onOpenChange,
}: AssetDetailsDialogProps) => {
  const { data, isLoading, isError } = useGetAssetById(assetId);

  const asset: Asset | undefined = data?.data;

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatPrice = (price?: string | number | null) => {
    if (price === null || price === undefined) {
      return "—";
    }

    return new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(price));
  };

  const formatLabel = (value?: string | null) => {
    if (!value) return "—";

    return value
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ");
  };

  const getStatusBadge = (status?: string) => {
    if (!status) {
      return (
        <Badge variant="outline">
          Unknown
        </Badge>
      );
    }

    const normalized = status.toLowerCase();

    if (normalized === "available") {
      return (
        <Badge className="gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50">
          <CheckCircle2 className="size-3.5" />
          {formatLabel(status)}
        </Badge>
      );
    }

    if (normalized === "assigned") {
      return (
        <Badge className="gap-1.5 border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 hover:bg-blue-50">
          <User className="size-3.5" />
          {formatLabel(status)}
        </Badge>
      );
    }

    if (
      normalized === "maintenance" ||
      normalized === "under_maintenance"
    ) {
      return (
        <Badge className="gap-1.5 border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 hover:bg-amber-50">
          <Pencil className="size-3.5" />
          {formatLabel(status)}
        </Badge>
      );
    }

    if (
      normalized === "retired" ||
      normalized === "disposed"
    ) {
      return (
        <Badge className="gap-1.5 border-red-200 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-50">
          <XCircle className="size-3.5" />
          {formatLabel(status)}
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        {formatLabel(status)}
      </Badge>
    );
  };

  const getConditionBadge = (condition?: string) => {
    if (!condition) {
      return (
        <Badge variant="outline">
          Unknown
        </Badge>
      );
    }

    const normalized = condition.toLowerCase();

    if (normalized === "new") {
      return (
        <Badge className="gap-1.5 border-violet-200 bg-violet-50 px-3 py-1 text-violet-700 hover:bg-violet-50">
          <ShieldCheck className="size-3.5" />
          {formatLabel(condition)}
        </Badge>
      );
    }

    if (normalized === "good") {
      return (
        <Badge className="gap-1.5 border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-700 hover:bg-cyan-50">
          <CheckCircle2 className="size-3.5" />
          {formatLabel(condition)}
        </Badge>
      );
    }

    if (normalized === "fair") {
      return (
        <Badge className="gap-1.5 border-amber-200 bg-amber-50 px-3 py-1 text-amber-700 hover:bg-amber-50">
          {formatLabel(condition)}
        </Badge>
      );
    }

    if (normalized === "poor") {
      return (
        <Badge className="gap-1.5 border-red-200 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-50">
          <XCircle className="size-3.5" />
          {formatLabel(condition)}
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        {formatLabel(condition)}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-4xl">
        {/* HEADER */}
        <DialogHeader className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-blue-50/60 px-5 py-5 sm:px-7">
          <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Package className="size-5" />
            </div>

            <div className="min-w-0">
              <DialogTitle className="text-xl font-bold tracking-tight">
                Asset Details
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm">
                View complete information and current status of this asset.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* LOADING */}
        {isLoading && (
          <div className="flex min-h-100 flex-col items-center justify-center gap-3 px-5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Package className="size-7 animate-pulse text-primary" />
            </div>

            <div className="text-center">
              <p className="font-medium">
                Loading asset details...
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while we fetch the asset information.
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="flex min-h-100 flex-col items-center justify-center gap-3 px-5">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="size-7 text-destructive" />
            </div>

            <div className="text-center">
              <p className="font-semibold">
                Failed to load asset
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Something went wrong while fetching this asset.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        )}

        {/* DATA */}
        {!isLoading && !isError && asset && (
          <>
            <div className="space-y-6 p-4 sm:p-6">
              {/* HERO */}
              <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 via-background to-primary/5 shadow-sm">
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-5 sm:flex-row">
                    {/* IMAGE */}
                    <div className="group relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-2xl border bg-muted shadow-sm sm:mx-0 sm:h-40 sm:w-40">
                      {asset.imageUrl ? (
                        <Image
                          src={asset.imageUrl}
                          alt={asset.name || "Asset"}
                          fill
                          sizes="160px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-blue-100">
                          <Package className="size-12 text-primary/50" />
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3">
                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Asset
                          </p>

                          <h2 className="break-words text-2xl font-bold tracking-tight">
                            {asset.name}
                          </h2>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {asset.brand || "Unknown Brand"}
                            {asset.model
                              ? ` • ${asset.model}`
                              : ""}
                          </p>
                        </div>

                        {/* BADGES */}
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(asset.status)}
                          {getConditionBadge(asset.condition)}
                        </div>

                        {/* ASSET TAG */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-xs">
                            <Tag className="size-3.5 text-primary" />

                            <span className="text-xs text-muted-foreground">
                              Asset Tag
                            </span>

                            <span className="font-mono text-xs font-semibold">
                              {asset.assetTag || "—"}
                            </span>
                          </div>

                          {asset.serialNumber && (
                            <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-xs">
                              <Hash className="size-3.5 text-blue-500" />

                              <span className="text-xs text-muted-foreground">
                                Serial
                              </span>

                              <span className="font-mono text-xs font-semibold">
                                {asset.serialNumber}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENERAL INFORMATION */}
              <DetailSection
                icon={
                  <Package className="size-4" />
                }
                title="General Information"
                description="Basic information about this asset"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCard
                    icon={<Tag />}
                    label="Asset Tag"
                    value={asset.assetTag}
                    iconClassName="bg-violet-100 text-violet-600"
                  />

                  <InfoCard
                    icon={<Hash />}
                    label="Serial Number"
                    value={asset.serialNumber}
                    iconClassName="bg-blue-100 text-blue-600"
                  />

                  <InfoCard
                    icon={<Package />}
                    label="Category"
                    value={asset.category?.name}
                    iconClassName="bg-emerald-100 text-emerald-600"
                  />

                  <InfoCard
                    icon={<User />}
                    label="Vendor"
                    value={asset.vendor?.name}
                    iconClassName="bg-orange-100 text-orange-600"
                  />

                  <InfoCard
                    label="Brand"
                    value={asset.brand}
                    iconClassName="bg-pink-100 text-pink-600"
                  />

                  <InfoCard
                    label="Model"
                    value={asset.model}
                    iconClassName="bg-cyan-100 text-cyan-600"
                  />

                  <InfoCard
                    icon={<MapPin />}
                    label="Location"
                    value={asset.location}
                    iconClassName="bg-rose-100 text-rose-600"
                  />
                </div>
              </DetailSection>

              {/* PURCHASE INFORMATION */}
              <DetailSection
                icon={
                  <CircleDollarSign className="size-4" />
                }
                title="Purchase Information"
                description="Financial and warranty details"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCard
                    icon={<CircleDollarSign />}
                    label="Purchase Price"
                    value={
                      asset.purchasePrice !== undefined &&
                      asset.purchasePrice !== null
                        ? `৳ ${formatPrice(asset.purchasePrice)}`
                        : undefined
                    }
                    iconClassName="bg-emerald-100 text-emerald-600"
                    valueClassName="text-emerald-700"
                  />

                  <InfoCard
                    icon={<CalendarDays />}
                    label="Purchase Date"
                    value={formatDate(asset.purchaseDate)}
                    iconClassName="bg-blue-100 text-blue-600"
                  />

                  <InfoCard
                    icon={<ShieldCheck />}
                    label="Warranty Expiry"
                    value={formatDate(asset.warrantyExpiry)}
                    iconClassName="bg-violet-100 text-violet-600"
                  />
                </div>
              </DetailSection>

              {/* DESCRIPTION */}
              <DetailSection
                icon={
                  <FileText className="size-4" />
                }
                title="Description"
                description="Additional information about the asset"
              >
                <div className="rounded-xl border bg-muted/20 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                    {asset.description ||
                      "No description available for this asset."}
                  </p>
                </div>
              </DetailSection>

              {/* ASSIGNMENT */}
              {asset.assignedTo && (
                <DetailSection
                  icon={
                    <User className="size-4" />
                  }
                  title="Assignment"
                  description="Current asset assignment"
                >
                  <div className="flex items-center gap-4 rounded-xl border bg-gradient-to-r from-blue-50/70 to-background p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <User className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {asset.assignedTo.name}
                      </p>

                      {asset.assignedTo.email && (
                        <p className="truncate text-sm text-muted-foreground">
                          {asset.assignedTo.email}
                        </p>
                      )}
                    </div>
                  </div>
                </DetailSection>
              )}

              {/* SYSTEM INFORMATION */}
              <DetailSection
                icon={
                  <CalendarDays className="size-4" />
                }
                title="System Information"
                description="Record timestamps"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoCard
                    icon={<CalendarDays />}
                    label="Created At"
                    value={formatDate(asset.createdAt)}
                    iconClassName="bg-slate-100 text-slate-600"
                  />

                  <InfoCard
                    icon={<CalendarDays />}
                    label="Last Updated"
                    value={formatDate(asset.updatedAt)}
                    iconClassName="bg-slate-100 text-slate-600"
                  />
                </div>
              </DetailSection>
            </div>

            {/* FOOTER */}
            <DialogFooter className="border-t-1 bg-muted/20 py-5 sm:px-6 mx-0">
              <DialogClose
              render={<Button variant="outline">
                  Close
                </Button>}
              >
                
              </DialogClose>
            </DialogFooter>
          </>
        )}

        {/* NOT FOUND */}
        {!isLoading && !isError && !asset && (
          <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-5">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Package className="size-7 text-muted-foreground" />
            </div>

            <div className="text-center">
              <p className="font-semibold">
                Asset not found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                The requested asset could not be found.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* -------------------------------------------------------------------------- */
/* DETAIL SECTION                                                             */
/* -------------------------------------------------------------------------- */

interface DetailSectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DetailSection = ({
  icon,
  title,
  description,
  children,
}: DetailSectionProps) => {
  return (
    <section className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* INFO CARD                                                                  */
/* -------------------------------------------------------------------------- */

interface InfoCardProps {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
  iconClassName?: string;
  valueClassName?: string;
}

const InfoCard = ({
  label,
  value,
  icon,
  iconClassName = "bg-primary/10 text-primary",
  valueClassName = "",
}: InfoCardProps) => {
  return (
    <div className="group rounded-xl border bg-background p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">
            {label}
          </p>

          <p
            className={`mt-1 break-words text-sm font-semibold ${
              valueClassName || "text-foreground"
            }`}
          >
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsDialog;