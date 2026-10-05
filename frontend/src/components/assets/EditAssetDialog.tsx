"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import type { Asset } from "@/types";
import { useGetAssetById, useUpdateAsset } from "@/hooks";

interface EditAssetDialogProps {
  assetId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditAssetDialog = ({
  assetId,
  open,
  onOpenChange,
}: EditAssetDialogProps) => {
  const [name, setName] = useState("");
  const [assetTag, setAssetTag] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");

  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");

  // GET SINGLE ASSET
  const {
    data,
    isLoading: isAssetLoading,
    isError: isAssetError,
  } = useGetAssetById(assetId);

  // UPDATE
  const updateAssetMutation = useUpdateAsset();

  // BACKEND RESPONSE
  const asset: Asset | undefined = data?.data;

  // Populate form
  useEffect(() => {
    if (!asset) return;

    setName(asset.name ?? "");
    setAssetTag(asset.assetTag ?? "");
    setBrand(asset.brand ?? "");
    setModel(asset.model ?? "");
    setSerialNumber(asset.serialNumber ?? "");
    setDescription(asset.description ?? "");

    setStatus(asset.status ?? "");
    setCondition(asset.condition ?? "");
    setLocation(asset.location ?? "");

    setPurchasePrice(
      asset.purchasePrice !== undefined &&
        asset.purchasePrice !== null
        ? String(asset.purchasePrice)
        : "",
    );

    setPurchaseDate(
      asset.purchaseDate
        ? asset.purchaseDate.slice(0, 10)
        : "",
    );

    setWarrantyExpiry(
      asset.warrantyExpiry
        ? asset.warrantyExpiry.slice(0, 10)
        : "",
    );
  }, [asset]);

  // SUBMIT
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!assetId) return;

    updateAssetMutation.mutate(
      {
        assetId,
        payload: {
          name,
          assetTag,
          brand: brand || undefined,
          model: model || undefined,
          serialNumber: serialNumber || undefined,
          description: description || undefined,

          status,
          condition,
          location,

          purchasePrice: purchasePrice
            ? Number(purchasePrice)
            : undefined,

          purchaseDate: purchaseDate || undefined,

          warrantyExpiry: warrantyExpiry || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleDialogChange = (value: boolean) => {
    if (updateAssetMutation.isPending) return;

    onOpenChange(value);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>

          <DialogDescription>
            Update the asset information and save your changes.
          </DialogDescription>
        </DialogHeader>

        {/* LOADING */}
        {isAssetLoading && (
          <div className="flex min-h-60 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading asset...
            </div>
          </div>
        )}

        {/* ERROR */}
        {isAssetError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Failed to load asset.
          </div>
        )}

        {/* FORM */}
        {!isAssetLoading && !isAssetError && asset && (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* NAME */}
              <div className="space-y-2">
                <label
                  htmlFor="asset-name"
                  className="text-sm font-medium"
                >
                  Asset Name
                </label>

                <Input
                  id="asset-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter asset name"
                  required
                />
              </div>

              {/* ASSET TAG */}
              <div className="space-y-2">
                <label
                  htmlFor="asset-tag"
                  className="text-sm font-medium"
                >
                  Asset Tag
                </label>

                <Input
                  id="asset-tag"
                  value={assetTag}
                  onChange={(event) =>
                    setAssetTag(event.target.value)
                  }
                  placeholder="Enter asset tag"
                  required
                />
              </div>

              {/* BRAND */}
              <div className="space-y-2">
                <label
                  htmlFor="asset-brand"
                  className="text-sm font-medium"
                >
                  Brand
                </label>

                <Input
                  id="asset-brand"
                  value={brand}
                  onChange={(event) =>
                    setBrand(event.target.value)
                  }
                  placeholder="e.g. Dell"
                />
              </div>

              {/* MODEL */}
              <div className="space-y-2">
                <label
                  htmlFor="asset-model"
                  className="text-sm font-medium"
                >
                  Model
                </label>

                <Input
                  id="asset-model"
                  value={model}
                  onChange={(event) =>
                    setModel(event.target.value)
                  }
                  placeholder="e.g. Latitude 5420"
                />
              </div>

              {/* SERIAL */}
              <div className="space-y-2">
                <label
                  htmlFor="asset-serial"
                  className="text-sm font-medium"
                >
                  Serial Number
                </label>

                <Input
                  id="asset-serial"
                  value={serialNumber}
                  onChange={(event) =>
                    setSerialNumber(event.target.value)
                  }
                  placeholder="Enter serial number"
                />
              </div>

              {/* LOCATION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Location
                </label>

                <Input
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Enter location"
                />
              </div>

              {/* STATUS */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status
                </label>

                <Select
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="AVAILABLE">
                      Available
                    </SelectItem>

                    <SelectItem value="ASSIGNED">
                      Assigned
                    </SelectItem>

                    <SelectItem value="UNDER_MAINTENANCE">
                      Under Maintenance
                    </SelectItem>

                    <SelectItem value="RETIRED">
                      Retired
                    </SelectItem>

                    <SelectItem value="DISPOSED">
                      Disposed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CONDITION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Condition
                </label>

                <Select
                  value={condition}
                  onValueChange={setCondition}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="NEW">
                      New
                    </SelectItem>

                    <SelectItem value="GOOD">
                      Good
                    </SelectItem>

                    <SelectItem value="FAIR">
                      Fair
                    </SelectItem>

                    <SelectItem value="POOR">
                      Poor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PRICE */}
              <div className="space-y-2">
                <label
                  htmlFor="purchase-price"
                  className="text-sm font-medium"
                >
                  Purchase Price
                </label>

                <Input
                  id="purchase-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={purchasePrice}
                  onChange={(event) =>
                    setPurchasePrice(event.target.value)
                  }
                  placeholder="0.00"
                />
              </div>

              {/* PURCHASE DATE */}
              <div className="space-y-2">
                <label
                  htmlFor="purchase-date"
                  className="text-sm font-medium"
                >
                  Purchase Date
                </label>

                <Input
                  id="purchase-date"
                  type="date"
                  value={purchaseDate}
                  onChange={(event) =>
                    setPurchaseDate(event.target.value)
                  }
                />
              </div>

              {/* WARRANTY */}
              <div className="space-y-2">
                <label
                  htmlFor="warranty-expiry"
                  className="text-sm font-medium"
                >
                  Warranty Expiry
                </label>

                <Input
                  id="warranty-expiry"
                  type="date"
                  value={warrantyExpiry}
                  onChange={(event) =>
                    setWarrantyExpiry(event.target.value)
                  }
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label
                htmlFor="asset-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <Textarea
                id="asset-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter asset description"
                rows={4}
              />
            </div>

            {/* FOOTER */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateAssetMutation.isPending}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={updateAssetMutation.isPending}
              >
                {updateAssetMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {updateAssetMutation.isPending
                  ? "Updating..."
                  : "Update Asset"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAssetDialog;