"use client";

import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>

          <AlertDialogTitle>Delete Asset?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {asset?.name}
            </span>
            ?

            <br />

            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AssetDeleteDialog;