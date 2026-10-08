"use client";

import { useForm } from "@tanstack/react-form";
import {
    ArrowLeft,
    Calculator,
    FileText,
    Loader2,
    Package,
    Save,
    ShoppingCart,
    Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import {
    useCreateAssetPurchase,
    useGetAllAssets,
    useGetAllVendors,
} from "@/hooks";
import type { Asset, AssetPurchasePayload, Vendor } from "@/types";
import { createPurchaseSchema } from "@/validation";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type CreatePurchaseFormValues = z.infer<typeof createPurchaseSchema>;

// Page
export default function CreateAssetPurchasePage() {
    const router = useRouter();

    const { mutate: createPurchase, isPending } = useCreateAssetPurchase();

    const {
        data: assetsData,
        isLoading: assetsLoading,
    } = useGetAllAssets({
        page: 1,
        limit: 100,
    });

    const {
        data: vendorsData,
        isLoading: vendorsLoading,
    } = useGetAllVendors();

    // Adjust these according to your actual API response shape.
    const assets: Asset[] = assetsData?.data ?? [];
    const vendors: Vendor[] = vendorsData?.data ?? [];

    const getTodayDate = () => {
    const today = new Date();

    return today.toISOString().split("T")[0];
};

    const form = useForm({
        defaultValues: {
            assetId: "",
            vendorId: "",
            invoiceNumber: "",
            quantity: 1,
            unitPrice: 0,
            purchaseDate: getTodayDate(),
            paymentStatus: "PENDING" as const,
            invoiceUrl: "",
            remarks: "",
        } satisfies CreatePurchaseFormValues,

        onSubmit: ({ value }) => {
            const parsed = createPurchaseSchema.safeParse(value);

            if (!parsed.success) {
                return;
            }
            const payload = {
                assetId: parsed.data.assetId,
                vendorId: parsed.data.vendorId,
                invoiceNumber: parsed.data.invoiceNumber,
                quantity: parsed.data.quantity,
                unitPrice: parsed.data.unitPrice,

                ...(parsed.data.purchaseDate
                    ? {
                        purchaseDate: parsed.data.purchaseDate,
                    }
                    : {}),

                paymentStatus: parsed.data.paymentStatus,

                ...(parsed.data.invoiceUrl
                    ? {
                        invoiceUrl: parsed.data.invoiceUrl,
                    }
                    : {}),

                ...(parsed.data.remarks
                    ? {
                        remarks: parsed.data.remarks,
                    }
                    : {}),
            };

            createPurchase(payload as AssetPurchasePayload, {
                onSuccess: () => {
                    router.push("/super-admin/asset-purchases");
                    router.refresh();
                },
            });
        },
    });

    // Total amount
    const quantity = form.getFieldValue("quantity");
    const unitPrice = form.getFieldValue("unitPrice");

    const totalAmount = useMemo(() => {
        return Number(quantity || 0) * Number(unitPrice || 0);
    }, [quantity, unitPrice]);

    // Submit
    const handleSubmit = async () => {
        await form.handleSubmit();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="shrink-0"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Create Purchase
                            </h1>

                            <p className="text-sm text-muted-foreground">
                                Create a new asset purchase record
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Form */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Purchase Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                    <ShoppingCart className="size-5 text-primary" />
                                </div>

                                <div>
                                    <CardTitle>Purchase Information</CardTitle>
                                    <CardDescription>
                                        Select the asset and vendor for this
                                        purchase.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Asset */}
                                {/* <form.Field
                                    name="assetId"
                                    validators={{
                                        onChange: ({ value }) => {
                                            const result =
                                                createPurchaseSchema.shape.assetId.safeParse(
                                                    value,
                                                );

                                            return result.success
                                                ? undefined
                                                : result.error.issues[0]
                                                      ?.message;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <div className="space-y-2">
                                            <label htmlFor="" className="text-sm font-medium">
                                                Asset{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>

                                            <Select
                                                value={field.state.value}
                                                onValueChange={(value) => {
                                                        if (value !== null) {
                                                            field.handleChange(value);
                                                        }
                                                    }}
                                                disabled={assetsLoading}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={
                                                            assetsLoading
                                                                ? "Loading assets..."
                                                                : "Select asset"
                                                        }
                                                    />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {assets.map((asset) => (
                                                        <SelectItem
                                                            key={asset.id}
                                                            value={asset.id}
                                                        >
                                                            {asset.assetTag} -{" "}
                                                            {asset.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {field.state.meta.errors.length >
                                                0 && (
                                                <p className="text-xs text-destructive">
                                                    {
                                                        field.state.meta
                                                            .errors[0]
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </form.Field> */}

                                <form.Field
                                    name="assetId"
                                    validators={{
                                        onChange:
                                            createPurchaseSchema.shape.assetId,
                                    }}
                                >
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel>
                                                    Asset ID
                                                </FieldLabel>

                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(value) => {
                                                        if (value) {
                                                            field.handleChange(value);
                                                        }
                                                    }}
                                                    disabled={assetsLoading}
                                                >
                                                    <SelectTrigger
                                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition-all hover:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                                        aria-invalid={isInvalid}
                                                    >
                                                        <SelectValue
                                                            placeholder={
                                                                assetsLoading
                                                                    ? "Loading Asset..."
                                                                    : "Select vendor"
                                                            }
                                                        >
                                                            {assets?.find(
                                                                (asset: Asset) =>
                                                                    asset.id === field.state.value,
                                                            )?.name}
                                                        </SelectValue>
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {assets?.map(
                                                            (asset: Asset) => (
                                                                <SelectItem
                                                                    key={asset.id}
                                                                    value={asset.id}
                                                                >
                                                                    {asset.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>

                                {/* Vendor */}
                                <form.Field
                                    name="vendorId"
                                    validators={{
                                        onChange:
                                            createPurchaseSchema.shape.vendorId,
                                    }}
                                >
                                    {(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched &&
                                            !field.state.meta.isValid;

                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel>
                                                    Vendor
                                                </FieldLabel>

                                                <Select
                                                    value={field.state.value}
                                                    onValueChange={(value) => {
                                                        if (value) {
                                                            field.handleChange(value);
                                                        }
                                                    }}
                                                    disabled={vendorsLoading}
                                                >
                                                    <SelectTrigger
                                                        className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition-all hover:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                                        aria-invalid={isInvalid}
                                                    >
                                                        <SelectValue
                                                            placeholder={
                                                                vendorsLoading
                                                                    ? "Loading vendor..."
                                                                    : "Select vendor"
                                                            }
                                                        >
                                                            {vendorsData?.data?.find(
                                                                (vendor: Vendor) =>
                                                                    vendor.id === field.state.value,
                                                            )?.name}
                                                        </SelectValue>
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {vendorsData?.data?.map(
                                                            (vendor: Vendor) => (
                                                                <SelectItem
                                                                    key={vendor.id}
                                                                    value={vendor.id}
                                                                >
                                                                    {vendor.name}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>

                                                {isInvalid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>

                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Invoice Number */}
                                <form.Field
                                    name="invoiceNumber"
                                    validators={{
                                        onChange: ({ value }) => {
                                            const result =
                                                createPurchaseSchema.shape.invoiceNumber.safeParse(
                                                    value,
                                                );

                                            return result.success
                                                ? undefined
                                                : result.error.issues[0]
                                                    ?.message;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <div className="space-y-2">
                                            <label htmlFor={""} className="text-sm font-medium">
                                                Invoice Number{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>

                                            <Input
                                                placeholder="INV-2026-000101"
                                                value={field.state.value}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                            />

                                            {field.state.meta.errors.length >
                                                0 && (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            field.state.meta
                                                                .errors[0]
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </form.Field>

                                {/* Purchase Date */}
                                <form.Field name="purchaseDate">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <label htmlFor={""} className="text-sm font-medium">
                                                Purchase Date
                                            </label>

                                            <Input
                                                type="date"
                                                value={field.state.value}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </form.Field>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Calculator className="size-5 text-primary" />
                                </div>

                                <div>
                                    <CardTitle>Pricing</CardTitle>
                                    <CardDescription>
                                        Enter purchase quantity and unit price.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Quantity */}
                                <form.Field
                                    name="quantity"
                                    validators={{
                                        onChange: ({ value }) => {
                                            const result =
                                                createPurchaseSchema.shape.quantity.safeParse(
                                                    value,
                                                );

                                            return result.success
                                                ? undefined
                                                : result.error.issues[0]
                                                    ?.message;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <div className="space-y-2">
                                            <label htmlFor={""} className="text-sm font-medium">
                                                Quantity{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>

                                            <Input
                                                type="number"
                                                min={1}
                                                step={1}
                                                value={field.state.value}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />

                                            {field.state.meta.errors.length >
                                                0 && (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            field.state.meta
                                                                .errors[0]
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </form.Field>

                                {/* Unit Price */}
                                <form.Field
                                    name="unitPrice"
                                    validators={{
                                        onChange: ({ value }) => {
                                            const result =
                                                createPurchaseSchema.shape.unitPrice.safeParse(
                                                    value,
                                                );

                                            return result.success
                                                ? undefined
                                                : result.error.issues[0]
                                                    ?.message;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <div className="space-y-2">
                                            <label htmlFor={""} className="text-sm font-medium">
                                                Unit Price (BDT){" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>

                                            <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                placeholder="500"
                                                value={field.state.value}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />

                                            {field.state.meta.errors.length >
                                                0 && (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            field.state.meta
                                                                .errors[0]
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </form.Field>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                                    <FileText className="size-5 text-primary" />
                                </div>

                                <div>
                                    <CardTitle>Payment & Invoice</CardTitle>
                                    <CardDescription>
                                        Add payment status and invoice
                                        information.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Payment Status */}
                                <form.Field name="paymentStatus">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <label htmlFor={""} className="text-sm font-medium">
                                                Payment Status{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </label>

                                            <Select
                                                value={field.state.value}
                                                onValueChange={field.handleChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="PENDING">
                                                        Pending
                                                    </SelectItem>

                                                    <SelectItem value="PAID">
                                                        Paid
                                                    </SelectItem>

                                                    <SelectItem value="PARTIAL">
                                                        Partial
                                                    </SelectItem>

                                                    <SelectItem value="CANCELLED">
                                                        Cancelled
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </form.Field>

                                {/* Invoice URL */}
                                <form.Field
                                    name="invoiceUrl"
                                    validators={{
                                        onChange: ({ value }) => {
                                            if (!value) return undefined;

                                            const result =
                                                createPurchaseSchema.shape.invoiceUrl.safeParse(
                                                    value,
                                                );

                                            return result.success
                                                ? undefined
                                                : result.error.issues[0]
                                                    ?.message;
                                        },
                                    }}
                                >
                                    {(field) => (
                                        <div className="space-y-2">
                                            <label htmlFor={""} className="text-sm font-medium">
                                                Invoice URL
                                            </label>

                                            <Input
                                                type="url"
                                                placeholder="https://example.com/invoice.pdf"
                                                value={field.state.value}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                            />

                                            {field.state.meta.errors.length >
                                                0 && (
                                                    <p className="text-xs text-destructive">
                                                        {
                                                            field.state.meta
                                                                .errors[0]
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </form.Field>
                            </div>

                            {/* Remarks */}
                            <form.Field
                                name="remarks"
                                validators={{
                                    onChange: ({ value }) => {
                                        const result =
                                            createPurchaseSchema.shape.remarks.safeParse(
                                                value,
                                            );

                                        return result.success
                                            ? undefined
                                            : result.error.issues[0]?.message;
                                    },
                                }}
                            >
                                {(field) => (
                                    <div className="space-y-2">
                                        <label htmlFor={""} className="text-sm font-medium">
                                            Remarks
                                        </label>

                                        <Textarea
                                            placeholder="Add any additional notes about this purchase..."
                                            rows={4}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                        />

                                        {field.state.meta.errors.length > 0 && (
                                            <p className="text-xs text-destructive">
                                                {field.state.meta.errors[0]}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() =>
                                router.push("/asset-purchases")
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            disabled={isPending}
                            onClick={handleSubmit}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 size-4" />
                                    Create Purchase
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Summary */}
                {/* <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Purchase Summary</CardTitle>
                            <CardDescription>
                                Review the purchase before submitting.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                    <Package className="size-5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Asset
                                    </p>

                                    <p className="truncate text-sm font-medium">
                                        {assets.find(
                                            (asset) =>
                                                asset.id ===
                                                form.getFieldValue(
                                                    "assetId",
                                                ),
                                        )?.name ?? "Not selected"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                    <Store className="size-5 text-muted-foreground" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">
                                        Vendor
                                    </p>

                                    <p className="truncate text-sm font-medium">
                                        {vendors.find(
                                            (vendor) =>
                                                vendor.id ===
                                                form.getFieldValue(
                                                    "vendorId",
                                                ),
                                        )?.name ?? "Not selected"}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Quantity
                                    </span>

                                    <span className="font-medium">
                                        {quantity || 0}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Unit Price
                                    </span>

                                    <span className="font-medium">
                                        ৳
                                        {Number(
                                            unitPrice || 0,
                                        ).toLocaleString("en-BD")}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <div className="rounded-lg bg-muted/60 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium"> htmlFor={""}
                                        Total Amount
                                    </span>

                                    <span className="text-xl font-bold">
                                        ৳
                                        {totalAmount.toLocaleString("en-BD", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* ================= */}
                {/* Summary */}
                <div className="lg:col-span-1">
                    <form.Subscribe
                        selector={(state) => ({
                            assetId: state.values.assetId,
                            vendorId: state.values.vendorId,
                            quantity: state.values.quantity,
                            unitPrice: state.values.unitPrice,
                        })}
                    >
                        {({ assetId, vendorId, quantity, unitPrice }) => {
                            const selectedAsset = assets.find(
                                (asset) => asset.id === assetId,
                            );

                            const selectedVendor = vendors.find(
                                (vendor) => vendor.id === vendorId,
                            );

                            const totalAmount =
                                Number(quantity || 0) * Number(unitPrice || 0);

                            return (
                                <Card className="sticky top-6">
                                    <CardHeader>
                                        <CardTitle>Purchase Summary</CardTitle>

                                        <CardDescription>
                                            Review the purchase before submitting.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-5">
                                        {/* Asset */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                <Package className="size-5 text-muted-foreground" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground">
                                                    Asset
                                                </p>

                                                <p className="truncate text-sm font-medium">
                                                    {selectedAsset?.name ??
                                                        "Not selected"}
                                                </p>

                                                {selectedAsset?.assetTag && (
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {selectedAsset.assetTag}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Vendor */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                <Store className="size-5 text-muted-foreground" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs text-muted-foreground">
                                                    Vendor
                                                </p>

                                                <p className="truncate text-sm font-medium">
                                                    {selectedVendor?.name ??
                                                        "Not selected"}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Pricing */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Quantity
                                                </span>

                                                <span className="font-medium">
                                                    {quantity || 0}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Unit Price
                                                </span>

                                                <span className="font-medium">
                                                    ৳
                                                    {Number(unitPrice || 0).toLocaleString(
                                                        "en-BD",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Total */}
                                        <div className="rounded-lg bg-muted/60 p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-sm font-medium">
                                                    Total Amount
                                                </span>

                                                <span className="text-xl font-bold">
                                                    ৳
                                                    {totalAmount.toLocaleString("en-BD", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        }}
                    </form.Subscribe>
                </div>
            </div>
        </div>
    );
}