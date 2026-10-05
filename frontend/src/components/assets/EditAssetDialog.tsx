"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    FileText,
    Hash,
    Laptop,
    Loader2,
    MapPin,
    Package,
    Pencil,
    Tag,
    Wrench,
} from "lucide-react";

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
    } = useGetAssetById(assetId ?? "");


    // UPDATE ASSET
    const updateAssetMutation = useUpdateAsset();
    const asset: Asset | undefined = data?.data;


    // POPULATE FORM
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
    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
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

                    warrantyExpiry:
                        warrantyExpiry || undefined,
                },
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            },
        );
    };


    // DIALOG CHANGE
    const handleDialogChange = (value: boolean) => {
        if (updateAssetMutation.isPending) return;

        onOpenChange(value);
    };


    // INPUT CLASS
    const inputClass =
        "h-10 rounded-lg border-border/70 bg-background/70 transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20";


    // UI
    return (
        <Dialog
            open={open}
            onOpenChange={handleDialogChange}
        >
            <DialogContent
                className="
            w-[calc(100%-1rem)]
            max-w-5xl
            gap-0
            overflow-hidden
            rounded-2xl
            border-0
            bg-background
            p-0
            shadow-2xl
            sm:w-[95vw]
            lg:max-w-5xl
            xl:max-w-6xl
        "
            >

                {/* HEADER */}
                <DialogHeader
                    className="
            relative
            overflow-hidden
            border-b
            px-5
            py-5
            sm:px-7
            sm:py-6
          "
                >
                    {/* Decorative background */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-background to-violet-500/5" />

                    <div className="relative flex items-start gap-4">
                        {/* Icon */}
                        <div
                            className="
                flex
                size-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-primary-foreground
                shadow-lg
                shadow-primary/20
                sm:size-12
              "
                        >
                            <Pencil className="size-5 sm:size-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <DialogTitle className="text-lg font-semibold tracking-tight sm:text-xl">
                                Edit Asset
                            </DialogTitle>

                            <DialogDescription className="mt-1 max-w-xl text-xs leading-5 sm:text-sm">
                                Update asset information, status, pricing and
                                warranty details.
                            </DialogDescription>

                            {/* Asset identity */}
                            {asset && (
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-mono text-[11px] font-medium text-muted-foreground">
                                        <Hash className="size-3" />
                                        {asset.assetTag}
                                    </span>

                                    {asset.brand && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                                            <Package className="size-3" />
                                            {asset.brand}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {/* CONTENT */}
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {/* LOADING */}
                    {isAssetLoading && (
                        <div className="flex min-h-100 flex-col items-center justify-center gap-3 px-5">
                            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                                <Loader2 className="size-5 animate-spin text-primary" />
                            </div>

                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    Loading asset
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Please wait while we load the asset details.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ERROR */}
                    {isAssetError && (
                        <div className="flex min-h-75 items-center justify-center px-5">
                            <div className="w-full max-w-md rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center">
                                <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-destructive/10">
                                    <FileText className="size-5 text-destructive" />
                                </div>

                                <p className="mt-3 font-medium text-destructive">
                                    Failed to load asset
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    We could not retrieve this asset. Please close
                                    the dialog and try again.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* FORM */}

                    {!isAssetLoading &&
                        !isAssetError &&
                        asset && (
                            <form
                                id="edit-asset-form"
                                onSubmit={handleSubmit}
                                className="space-y-6 px-5 py-5 sm:px-7 sm:py-6"
                            >
                                {/* BASIC INFORMATION */}
                                <section className="space-y-4">
                                    <SectionHeader
                                        icon={
                                            <Package className="size-4" />
                                        }
                                        title="Basic Information"
                                        description="General information about this asset."
                                    />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* NAME */}
                                        <FormField
                                            label="Asset Name"
                                            htmlFor="asset-name"
                                            required
                                        >
                                            <Input
                                                id="asset-name"
                                                value={name}
                                                onChange={(event) =>
                                                    setName(event.target.value)
                                                }
                                                placeholder="e.g. Dell Latitude 5420"
                                                className={inputClass}
                                                required
                                            />
                                        </FormField>

                                        {/* ASSET TAG */}
                                        <FormField
                                            label="Asset Tag"
                                            htmlFor="asset-tag"
                                            required
                                        >
                                            <Input
                                                id="asset-tag"
                                                value={assetTag}
                                                onChange={(event) =>
                                                    setAssetTag(event.target.value)
                                                }
                                                placeholder="e.g. AST-001"
                                                className={`${inputClass} font-mono`}
                                                required
                                            />
                                        </FormField>

                                        {/* BRAND */}
                                        <FormField
                                            label="Brand"
                                            htmlFor="asset-brand"
                                        >
                                            <Input
                                                id="asset-brand"
                                                value={brand}
                                                onChange={(event) =>
                                                    setBrand(event.target.value)
                                                }
                                                placeholder="e.g. Dell"
                                                className={inputClass}
                                            />
                                        </FormField>

                                        {/* MODEL */}
                                        <FormField
                                            label="Model"
                                            htmlFor="asset-model"
                                        >
                                            <Input
                                                id="asset-model"
                                                value={model}
                                                onChange={(event) =>
                                                    setModel(event.target.value)
                                                }
                                                placeholder="e.g. Latitude 5420"
                                                className={inputClass}
                                            />
                                        </FormField>

                                        {/* SERIAL */}
                                        <FormField
                                            label="Serial Number"
                                            htmlFor="asset-serial"
                                        >
                                            <Input
                                                id="asset-serial"
                                                value={serialNumber}
                                                onChange={(event) =>
                                                    setSerialNumber(
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Enter serial number"
                                                className={`${inputClass} font-mono`}
                                            />
                                        </FormField>

                                        {/* LOCATION */}
                                        <FormField
                                            label="Location"
                                            htmlFor="asset-location"
                                        >
                                            <div className="relative">
                                                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                <Input
                                                    id="asset-location"
                                                    value={location}
                                                    onChange={(event) =>
                                                        setLocation(
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Head Office"
                                                    className={`${inputClass} pl-9`}
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                </section>

                                {/* STATUS & CONDITION */}
                                <section className="space-y-4 border p-4 rounded-xl">
                                    <SectionHeader
                                        icon={
                                            <Wrench className="size-4" />
                                        }
                                        title="Status & Condition"
                                        description="Current operational state of the asset."
                                    />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t pt-4">
                                        {/* STATUS */}
                                        <FormField label="Status" required>
                                            <Select
                                                value={status}
                                                onValueChange={(value) => {
                                                    if (value !== null) {
                                                        setStatus(value);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={inputClass}
                                                >
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="AVAILABLE">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-emerald-500" />
                                                            Available
                                                        </span>
                                                    </SelectItem>

                                                    <SelectItem value="ASSIGNED">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-blue-500" />
                                                            Assigned
                                                        </span>
                                                    </SelectItem>

                                                    <SelectItem value="UNDER_MAINTENANCE">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-amber-500" />
                                                            Under Maintenance
                                                        </span>
                                                    </SelectItem>

                                                    <SelectItem value="RETIRED">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-red-500" />
                                                            Retired
                                                        </span>
                                                    </SelectItem>

                                                    <SelectItem value="DISPOSED">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-gray-500" />
                                                            Disposed
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>

                                        {/* CONDITION */}
                                        <FormField label="Condition" required>
                                            <Select
                                                value={condition}
                                                onValueChange={(value) => {
                                                    if (value !== null) {
                                                        setCondition(value);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger
                                                    className={inputClass}
                                                >
                                                    <SelectValue placeholder="Select condition" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="NEW">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-emerald-500" />
                                                            New
                                                        </span>
                                                    </SelectItem>

                                                    <SelectItem value="GOOD">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-blue-500" />
                                                            Good
                                                        </span>
                                                    </SelectItem>

                                                    <SelectItem value="FAIR">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-amber-500" />
                                                            Fair
                                                        </span>
                                                    </SelectItem>

                                                    <SelectItem value="POOR">
                                                        <span className="flex items-center gap-2">
                                                            <span className="size-2 rounded-full bg-red-500" />
                                                            Poor
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                    </div>
                                </section>

                                {/* PURCHASE INFORMATION */}
                                <section className="space-y-4">
                                    <SectionHeader
                                        icon={
                                            <Tag className="size-4" />
                                        }
                                        title="Purchase Information"
                                        description="Financial and purchase-related details."
                                    />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* PRICE */}
                                        <FormField
                                            label="Purchase Price"
                                            htmlFor="purchase-price"
                                        >
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                                    ৳
                                                </span>

                                                <Input
                                                    id="purchase-price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={purchasePrice}
                                                    onChange={(event) =>
                                                        setPurchasePrice(
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="0.00"
                                                    className={`${inputClass} pl-8`}
                                                />
                                            </div>
                                        </FormField>

                                        {/* PURCHASE DATE */}
                                        <FormField
                                            label="Purchase Date"
                                            htmlFor="purchase-date"
                                        >
                                            <div className="relative">
                                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                <Input
                                                    id="purchase-date"
                                                    type="date"
                                                    value={purchaseDate}
                                                    onChange={(event) =>
                                                        setPurchaseDate(
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} pl-9`}
                                                />
                                            </div>
                                        </FormField>

                                        {/* WARRANTY */}
                                        <FormField
                                            label="Warranty Expiry"
                                            htmlFor="warranty-expiry"
                                        >
                                            <div className="relative">
                                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                <Input
                                                    id="warranty-expiry"
                                                    type="date"
                                                    value={warrantyExpiry}
                                                    onChange={(event) =>
                                                        setWarrantyExpiry(
                                                            event.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} pl-9`}
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                </section>

                                {/* DESCRIPTION */}
                                <section className="space-y-4">
                                    <SectionHeader
                                        icon={
                                            <FileText className="size-4" />
                                        }
                                        title="Description"
                                        description="Add additional information about this asset."
                                    />

                                    <Textarea
                                        id="asset-description"
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Enter asset description..."
                                        rows={4}
                                        className="
                      resize-none
                      rounded-xl
                      border-border/70
                      bg-background/70
                      transition-all
                      focus-visible:border-primary
                      focus-visible:ring-2
                      focus-visible:ring-primary/20
                    "
                                    />
                                </section>
                            </form>
                        )}
                </div>


                {/* FOOTER */}
                {!isAssetLoading &&
                    !isAssetError &&
                    asset && (
                        <DialogFooter
                            className="
                sticky
                bottom-0
                border-t
                bg-background/95
                px-5
                py-4
                backdrop-blur
                sm:px-7
              "
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-lg"
                                disabled={
                                    updateAssetMutation.isPending
                                }
                                onClick={() =>
                                    onOpenChange(false)
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                form="edit-asset-form"
                                disabled={
                                    updateAssetMutation.isPending
                                }
                                className="
                  min-w-32
                  rounded-lg
                  shadow-md
                  shadow-primary/20
                "
                            >
                                {updateAssetMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Pencil className="mr-2 size-4" />
                                        Update Asset
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    )}
            </DialogContent>
        </Dialog>
    );
};

// REUSABLE FORM FIELD
interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
}

const FormField = ({
    label,
    children,
    htmlFor,
    required,
}: FormFieldProps) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={htmlFor}
                className="text-sm font-medium"
            >
                {label}

                {required && (
                    <span className="ml-1 text-destructive">
                        *
                    </span>
                )}
            </label>

            {children}
        </div>
    );
};

// SECTION HEADER
interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const SectionHeader = ({
    icon,
    title,
    description,
}: SectionHeaderProps) => {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>

            <div className="min-w-0">
                <h3 className="text-sm font-semibold">
                    {title}
                </h3>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default EditAssetDialog;