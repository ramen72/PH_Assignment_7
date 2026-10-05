"use client";

import {
  AlertTriangle,
  Loader2,
  Package,
  Trash2,
} from "lucide-react";

import Image from "next/image";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Asset } from "@/types";

interface AssetDeleteDialogProps {
  asset: Asset | null;
  open: boolean;
  isDeleting: boolean;

  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const AssetDeleteDialog = ({
  asset,
  open,
  isDeleting,
  onOpenChange,
  onConfirm,
}: AssetDeleteDialogProps) => {
  if (!asset) {
    return null;
  }

  const formattedStatus = asset.status
    ?.toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          p-0
          shadow-2xl
          sm:max-w-lg
        "
      >
        {/* HEADER / TOP WARNING AREA */}
        <div className="relative overflow-hidden border-b bg-destructive/[0.04] px-5 pb-5 pt-6 sm:px-6">
          {/* Decorative background */}
          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-10
              h-32
              w-32
              rounded-full
              bg-destructive/10
              blur-2xl
            "
          />

          <div className="relative flex items-start gap-4">
            {/* Warning Icon */}
            <div
              className="
                flex
                size-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-destructive/10
                ring-1
                ring-destructive/15
                sm:size-14
              "
            >
              <AlertTriangle
                className="
                  size-6
                  text-destructive
                  sm:size-7
                "
              />
            </div>

            {/* Title */}
            <AlertDialogHeader className="space-y-1 text-left">
              <AlertDialogTitle className="text-lg font-semibold sm:text-xl">
                Delete asset?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm leading-relaxed">
                This action will permanently remove this
                asset from your inventory.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        {/* ASSET INFORMATION */}
        <div className="px-5 py-5 sm:px-6">
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              bg-muted/30
              p-3
              sm:gap-4
              sm:p-4
            "
          >
            {/* Asset Image */}
            <div
              className="
                flex
                size-14
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                bg-background
                shadow-sm
                sm:size-16
              "
            >
              {asset.imageUrl ? (
                <Image
                  src={asset.imageUrl}
                  alt={asset.name || "Asset"}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/5">
                  <Package className="size-6 text-primary/60" />
                </div>
              )}
            </div>

            {/* Asset Details */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold sm:text-base">
                  {asset.name || "Unnamed Asset"}
                </h3>

                {asset.status && (
                  <Badge
                    variant="outline"
                    className="
                      shrink-0
                      border-blue-200
                      bg-blue-50
                      text-[10px]
                      text-blue-700
                      dark:border-blue-800
                      dark:bg-blue-950/40
                      dark:text-blue-300
                    "
                  >
                    {formattedStatus}
                  </Badge>
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                {asset.assetTag && (
                  <span
                    className="
                      rounded-md
                      bg-muted
                      px-2
                      py-0.5
                      font-mono
                      text-[11px]
                      font-medium
                      text-muted-foreground
                    "
                  >
                    {asset.assetTag}
                  </span>
                )}

                {asset.category?.name && (
                  <span className="truncate text-xs text-muted-foreground">
                    {asset.category.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* WARNING MESSAGE */}
          <div
            className="
              mt-4
              flex
              gap-3
              rounded-xl
              border
              border-amber-200
              bg-amber-50
              p-3
              dark:border-amber-900/50
              dark:bg-amber-950/20
            "
          >
            <AlertTriangle
              className="
                mt-0.5
                size-4
                shrink-0
                text-amber-600
                dark:text-amber-400
              "
            />

            <p
              className="
                text-xs
                leading-relaxed
                text-amber-800
                dark:text-amber-300
              "
            >
              <span className="font-semibold">
                Please note:
              </span>{" "}
              Deleting this asset is permanent. You will
              not be able to recover it after deletion.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <AlertDialogFooter
          className="
            flex-col-reverse
            gap-2
            border-t
            bg-muted/20
            px-5
            py-4
            sm:flex-row
            sm:justify-end
            sm:px-6
            sm:pb-7
          "
        >
          <AlertDialogCancel
            disabled={isDeleting}
            className="
              m-0
              w-full
              rounded-lg
              sm:w-auto
            "
          >
            Cancel
          </AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
            className="
              w-full
              rounded-lg
              shadow-sm
              transition-all
              hover:shadow-md
              sm:w-auto
            "
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting asset...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Delete asset
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AssetDeleteDialog;