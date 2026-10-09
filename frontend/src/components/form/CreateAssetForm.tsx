"use client";

import { useForm } from "@tanstack/react-form";
import {
    CalendarDays,
    CheckCircle2,
    FileText,
    HardDrive,
    Loader2,
    MapPin,
    Package,
    Tag,
    WalletCards,
    Wrench,
} from "lucide-react";

import {
    useCreateAsset,
    useGetAllAssetCategories,
    useGetAllVendors,
} from "@/hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    type CreateAssetFormValues,
    createAssetSchema,
} from "@/validation";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { Category, Vendor } from "@/types";
import { toast } from "../ui/toast";

const CreateAssetForm = () => {
    const {
        mutate: createAsset,
        isPending,
    } = useCreateAsset();

    const {
        data: categories,
        isLoading: isCategoriesLoading,
    } = useGetAllAssetCategories();

    const {
        data: vendorsData,
        isLoading: isVendorLoading,
    } = useGetAllVendors();

    const brands = [
    {
        "id": "dell-technologies",
        "name": "Dell Technologies",
        "description": "Enterprise server infrastructure, PowerEdge systems, and corporate client devices",
        "created_at": "2026-01-15 08:30:00.000",
        "updated_at": "2026-01-15 08:30:00.000"
    },
    {
        "id": "hp-inc",
        "name": "HP Inc.",
        "description": "Personal computing hardware, workstation laptops, and commercial printing solutions",
        "created_at": "2026-01-18 10:15:22.100",
        "updated_at": "2026-02-01 14:05:10.500"
    },
    {
        "id": "asus",
        "name": "ASUS",
        "description": null,
        "created_at": "2026-01-20 12:00:00.000",
        "updated_at": "2026-01-20 12:00:00.000"
    },
    {
        "id": "lenovo-group",
        "name": "Lenovo Group",
        "description": "ThinkPad enterprise series, Legion gaming hardware, and data center solutions",
        "created_at": "2026-02-01 09:45:12.333",
        "updated_at": "2026-02-10 11:20:45.120"
    },
    {
        "id": "apple-inc",
        "name": "Apple Inc.",
        "description": "MacBook hardware, Apple Silicon chips, and macOS ecosystem software",
        "created_at": "2026-02-05 16:20:00.000",
        "updated_at": "2026-02-05 16:20:00.000"
    },
    {
        "id": "cisco-systems",
        "name": "Cisco Systems",
        "description": "Enterprise networking switches, routers, and industrial cybersecurity devices",
        "created_at": "2026-02-12 11:05:40.000",
        "updated_at": "2026-02-18 09:30:15.800"
    },
    {
        "id": "acer",
        "name": "Acer",
        "description": null,
        "created_at": "2026-02-15 14:10:05.500",
        "updated_at": "2026-02-15 14:10:05.500"
    },
    {
        "id": "ibm",
        "name": "IBM",
        "description": "Hybrid cloud infrastructure, zSystems mainframes, and AI software",
        "created_at": "2026-02-22 07:55:30.250",
        "updated_at": "2026-03-01 16:40:00.000"
    },
    {
        "id": "intel-corporation",
        "name": "Intel Corporation",
        "description": "Xeon server processors, Core client CPUs, and semiconductor manufacturing",
        "created_at": "2026-03-02 13:14:15.000",
        "updated_at": "2026-03-02 13:14:15.000"
    },
    {
        "id": "advanced-micro-devices-amd",
        "name": "Advanced Micro Devices (AMD)",
        "description": "EPYC cloud processors, Instinct AI accelerators, and Ryzen chips",
        "created_at": "2026-03-05 18:00:10.111",
        "updated_at": "2026-03-12 10:00:00.000"
    },
    {
        "id": "msi-micro-star-international",
        "name": "MSI (Micro-Star International)",
        "description": null,
        "created_at": "2026-03-10 08:00:00.000",
        "updated_at": "2026-03-10 08:00:00.000"
    },
    {
        "id": "nvidia-corporation",
        "name": "NVIDIA Corporation",
        "description": "GPU acceleration platforms, AI data center hardware, and CUDA software",
        "created_at": "2026-03-15 15:30:22.000",
        "updated_at": "2026-03-20 17:45:00.000"
    },
    {
        "id": "microsoft-hardware",
        "name": "Microsoft Hardware",
        "description": "Surface enterprise devices, HoloLens, and Xbox hardware engineering",
        "created_at": "2026-03-18 10:25:00.500",
        "updated_at": "2026-03-18 10:25:00.500"
    },
    {
        "id": "fujitsu",
        "name": "Fujitsu",
        "description": "Enterprise IT services, mainframe systems, and supercomputing hardware",
        "created_at": "2026-03-22 11:50:00.000",
        "updated_at": "2026-03-25 12:10:00.000"
    },
    {
        "id": "hewlett-packard-enterprise-hpe",
        "name": "Hewlett Packard Enterprise (HPE)",
        "description": "ProLiant servers, Nimble storage arrays, and Aruba networking hardware",
        "created_at": "2026-03-28 09:12:34.999",
        "updated_at": "2026-03-28 09:12:34.999"
    },
    {
        "id": "samsung-electronics",
        "name": "Samsung Electronics",
        "description": "Enterprise NVMe SSD storage, mobile devices, and semiconductor memory chips",
        "created_at": "2026-04-01 14:00:00.000",
        "updated_at": "2026-04-02 15:20:00.000"
    },
    {
        "id": "supermicro",
        "name": "Supermicro",
        "description": null,
        "created_at": "2026-04-05 16:45:10.000",
        "updated_at": "2026-04-05 16:45:10.000"
    },
    {
        "id": "seagate-technology",
        "name": "Seagate Technology",
        "description": "Enterprise mass-capacity hard drives and edge storage systems",
        "created_at": "2026-04-10 10:10:10.100",
        "updated_at": "2026-04-11 11:11:11.200"
    },
    {
        "id": "western-digital",
        "name": "Western Digital",
        "description": "SanDisk memory solutions, Ultrastar enterprise drives, and consumer SSDs",
        "created_at": "2026-04-15 08:05:00.000",
        "updated_at": "2026-04-15 08:05:00.000"
    },
    {
        "id": "gigabyte-technology",
        "name": "Gigabyte Technology",
        "description": "Server motherboards, GPU workstation chassis, and PC hardware components",
        "created_at": "2026-04-20 12:30:45.000",
        "updated_at": "2026-04-22 14:00:00.000"
    }
]

    const form = useForm({
        defaultValues: {
            assetTag: "",
            name: "",
            categoryId: "",
            brand: "",
            model: "",
            serialNumber: "",
            description: "",
            purchasePrice: 0,
            purchaseDate: "",
            warrantyExpiry: "",
            condition: "NEW",
            location: "",
            vendorId: "",
        } as CreateAssetFormValues,

        validators: {
            onSubmit: createAssetSchema,
        },

        // onSubmit: async ({ value }) => {
        //     const payload = {
        //         assetTag: value.assetTag,
        //         name: value.name,
        //         categoryId: value.categoryId,
        //         brand: value.brand,
        //         model: value.model,
        //         serialNumber: value.serialNumber,
        //         description: value.description,
        //         purchasePrice: value.purchasePrice,
        //         purchaseDate: value.purchaseDate,
        //         warrantyExpiry: value.warrantyExpiry,
        //         condition: value.condition,
        //         location: value.location,
        //         vendorId: value.vendorId,
        //     };

        //     createAsset(payload, {
        //         onSuccess: (value) => {
        //             form.reset();
        //             toast.add({
        //                 type: "success",
        //                 title: "Asset created successfully",
        //             });
        //         },

        //         onError: (error) => {
        //             console.error(
        //                 "Create asset failed:",
        //                 error,
        //             );
        //         },
        //     });
        // },
        onSubmit: async ({ value }) => {
            // console.log("Submitted values:", value);

            const result = createAssetSchema.safeParse(value);

            if (!result.success) {
                console.error(
                    "Validation failed:",
                    result.error.flatten(),
                );

                toast.add({
                    type: "error",
                    title: "Please check the required fields",
                });

                return;
            }

            const payload = result.data;

            createAsset(payload, {
                onSuccess: () => {
                    form.reset();

                    toast.add({
                        type: "success",
                        title: "Asset created successfully",
                    });
                },

                onError: (error) => {
                    console.error("Create asset failed:", error);

                    toast.add({
                        type: "error",
                        title: "Failed to create asset",
                    });
                },
            });
        },
    });

    const isSubmitting =
        isPending || form.state.isSubmitting;

    return (
        <div className="min-h-full bg-linear-to-br from-slate-50 via-white to-indigo-50/40 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">

                {/* ================= HEADER ================= */}
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                                <Package className="size-5" />
                            </div>

                            <span className="text-sm font-semibold tracking-wide text-indigo-600">
                                ASSET MANAGEMENT
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Create New Asset
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
                            Add a new company asset with its
                            complete information, purchase details
                            and current condition.
                        </p>
                    </div>

                    <div className="hidden rounded-2xl border border-indigo-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur sm:block">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-emerald-500" />

                            <span className="text-sm font-medium text-slate-600">
                                All information is securely stored
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= FORM ================= */}
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        form.handleSubmit();
                    }}
                >
                    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">

                        {/* Top accent */}
                        <div className="h-1.5 bg-linear-to-r from-indigo-600 via-violet-500 to-fuchsia-500" />

                        <div className="p-4 sm:p-6 lg:p-8">
                            <FieldGroup className="space-y-8">

                                
                                {/* BASIC INFORMATION */}
                                <FormSection
                                    icon={<Package className="size-5" />}
                                    title="Basic Information"
                                    description="Identify and categorize the asset."
                                >
                                    <div className="grid gap-5 md:grid-cols-2">

                                        {/* Asset Tag */}
                                        <form.Field
                                            name="assetTag"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.assetTag,
                                            }}
                                        >
                                            {(field) => (
                                                <FormInput
                                                    field={field}
                                                    label="Asset Tag"
                                                    placeholder="LAP-25-26"
                                                    icon={<Tag />}
                                                    required
                                                />
                                            )}
                                        </form.Field>

                                        {/* Asset Name */}
                                        <form.Field
                                            name="name"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.name,
                                            }}
                                        >
                                            {(field) => (
                                                <FormInput
                                                    field={field}
                                                    label="Asset Name"
                                                    placeholder="Dell Latitude 5420"
                                                    icon={<HardDrive />}
                                                    required
                                                />
                                            )}
                                        </form.Field>

                                        {/* Category */}
                                        <form.Field
                                            name="categoryId"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.categoryId,
                                            }}
                                        >
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta.isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field data-invalid={isInvalid}>
                                                        <FieldLabel>
                                                            Category
                                                            <Required />
                                                        </FieldLabel>

                                                        <Select
                                                            value={field.state.value}
                                                            onValueChange={(value) => {
                                                                if (value) {
                                                                    field.handleChange(value);
                                                                }
                                                            }}
                                                            disabled={isCategoriesLoading}
                                                        >
                                                            <SelectTrigger
                                                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition-all hover:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                                                aria-invalid={isInvalid}
                                                            >
                                                                <SelectValue
                                                                    placeholder={
                                                                        isCategoriesLoading
                                                                            ? "Loading categories..."
                                                                            : "Select category"
                                                                    }
                                                                >
                                                                    {categories?.data?.find(
                                                                        (category: Category) =>
                                                                            category.id === field.state.value,
                                                                    )?.name}
                                                                </SelectValue>
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                {categories?.data?.map(
                                                                    (category: Category) => (
                                                                        <SelectItem
                                                                            key={category.id}
                                                                            value={category.id}
                                                                        >
                                                                            {category.name}
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
                                                    createAssetSchema.shape.vendorId,
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
                                                            <Required />
                                                        </FieldLabel>

                                                        <Select
                                                            value={field.state.value}
                                                            onValueChange={(value) => {
                                                                if (value) {
                                                                    field.handleChange(value);
                                                                }
                                                            }}
                                                            disabled={isCategoriesLoading}
                                                        >
                                                            <SelectTrigger
                                                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition-all hover:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                                                aria-invalid={isInvalid}
                                                            >
                                                                <SelectValue
                                                                    placeholder={
                                                                        isCategoriesLoading
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
                                </FormSection>

                                
                                {/* PRODUCT DETAILS */}
                                <FormSection
                                    icon={<Wrench className="size-5" />}
                                    title="Product Details"
                                    description="Add the manufacturer's information and identification details."
                                >
                                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Brand */}
                                        <form.Field
                                            name="brand"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.brand,
                                            }}
                                        >
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta.isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field data-invalid={isInvalid}>
                                                        <FieldLabel>
                                                            Brand
                                                            <Required />
                                                        </FieldLabel>

                                                        <Select
                                                            value={field.state.value}
                                                            onValueChange={(value) => {
                                                                if (value) {
                                                                    field.handleChange(value);
                                                                }
                                                            }}
                                                            disabled={isCategoriesLoading}
                                                        >
                                                            <SelectTrigger
                                                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 transition-all hover:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                                                aria-invalid={isInvalid}
                                                            >
                                                                <SelectValue
                                                                    placeholder={
                                                                        isCategoriesLoading
                                                                            ? "Loading brand..."
                                                                            : "Select brand"
                                                                    }
                                                                >
                                                                    {brands?.find(
                                                                        (brand) =>
                                                                            brand.id === field.state.value,
                                                                    )?.name}
                                                                </SelectValue>
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                {brands?.map(
                                                                    (brand) => (
                                                                        <SelectItem
                                                                            key={brand.id}
                                                                            value={brand.id}
                                                                        >
                                                                            {brand.name}
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

                                    {/* Model */}
                                        <form.Field
                                            name="model"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.model,
                                            }}
                                        >
                                            {(field) => (
                                                <FormInput
                                                    field={field}
                                                    label="Model Number"
                                                    placeholder="Enter Model"
                                                    // icon={<Tag />}
                                                    required
                                                />
                                            )}
                                        </form.Field>

                                    {/* Serial Number */}
                                        <form.Field
                                            name="serialNumber"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.serialNumber,
                                            }}
                                        >
                                            {(field) => (
                                                <FormInput
                                                    field={field}
                                                    label="Asset Serial Number"
                                                    placeholder="Enter Model"
                                                    // icon={<Tag />}
                                                    required
                                                />
                                            )}
                                        </form.Field>
                                        </div>

                                    {/* Description */}
                                    <div className="mt-5">
                                        <form.Field
                                            name="description"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.description,
                                            }}
                                        >
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta.isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field data-invalid={isInvalid}>
                                                        <FieldLabel htmlFor={field.name}>
                                                            Description
                                                            <span className="ml-1 text-xs font-normal text-slate-400">
                                                                Optional
                                                            </span>
                                                        </FieldLabel>

                                                        <Textarea
                                                            id={field.name}
                                                            name={field.name}
                                                            placeholder="Enter asset description, specifications, notes..."
                                                            value={
                                                                field.state.value
                                                            }
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                field.handleChange(
                                                                    event
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            className="min-h-28 resize-none rounded-xl border-slate-200 bg-slate-50/50 transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                                            aria-invalid={
                                                                isInvalid
                                                            }
                                                        />

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
                                </FormSection>

                                
                                {/* PURCHASE INFORMATION */}
                                <FormSection
                                    icon={<WalletCards className="size-5" />}
                                    title="Purchase Information"
                                    description="Record the financial and warranty information."
                                >
                                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                                        {/* Price */}
                                        <form.Field
                                            name="purchasePrice"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.purchasePrice,
                                            }}
                                        >
                                            {(field) => {
                                                const isInvalid =
                                                    field.state.meta.isTouched &&
                                                    !field.state.meta.isValid;

                                                return (
                                                    <Field data-invalid={isInvalid}>
                                                        <FieldLabel htmlFor={field.name}>
                                                            Purchase Price
                                                            <Required />
                                                        </FieldLabel>

                                                        <div className="relative">
                                                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                                                                ৳
                                                            </span>

                                                            <Input
                                                                id={field.name}
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder="85000"
                                                                value={
                                                                    field.state.value
                                                                }
                                                                onBlur={
                                                                    field.handleBlur
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    field.handleChange(
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-8 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                                                aria-invalid={
                                                                    isInvalid
                                                                }
                                                            />
                                                        </div>

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

                                        {/* Purchase Date */}
                                        <form.Field
                                            name="purchaseDate"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.purchaseDate,
                                            }}
                                        >
                                            {(field) => (
                                                <FormInput
                                                    field={field}
                                                    label="Purchase Date"
                                                    type="date"
                                                    icon={
                                                        <CalendarDays />
                                                    }
                                                    required
                                                />
                                            )}
                                        </form.Field>

                                        {/* Warranty */}
                                        <form.Field
                                            name="warrantyExpiry"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.warrantyExpiry,
                                            }}
                                        >
                                            {(field) => (
                                                <FormInput
                                                    field={field}
                                                    label="Warranty Expiry"
                                                    type="date"
                                                    icon={
                                                        <CalendarDays />
                                                    }
                                                    optional
                                                />
                                            )}
                                        </form.Field>
                                    </div>
                                </FormSection>

                                
                                {/* ASSET STATUS */}
                                <FormSection
                                    icon={<CheckCircle2 className="size-5" />}
                                    title="Asset Status"
                                    description="Define the current condition and location of the asset."
                                >
                                    <div className="grid gap-5 md:grid-cols-2">

                                        {/* Condition */}
                                        <form.Field name="condition">
                                            {(field) => (
                                                <Field>
                                                    <FieldLabel>
                                                        Condition
                                                    </FieldLabel>

                                                    <Select
                                                        value={
                                                            field.state.value
                                                        }
                                                        onValueChange={(
                                                            value,
                                                        ) => {
                                                            if (value) {
                                                                field.handleChange(
                                                                    value as CreateAssetFormValues["condition"],
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/20">
                                                            <SelectValue />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            <SelectItem value="NEW">
                                                                🟢 New
                                                            </SelectItem>

                                                            <SelectItem value="GOOD">
                                                                🔵 Good
                                                            </SelectItem>

                                                            <SelectItem value="FAIR">
                                                                🟡 Fair
                                                            </SelectItem>

                                                            <SelectItem value="POOR">
                                                                🟠 Poor
                                                            </SelectItem>

                                                            <SelectItem value="DAMAGED">
                                                                🔴 Damaged
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </Field>
                                            )}
                                        </form.Field>

                                        {/* Location */}
                                        <form.Field
                                            name="location"
                                            validators={{
                                                onChange:
                                                    createAssetSchema.shape.location,
                                            }}
                                        >
                                            {(field) => (
                                                <FormInput
                                                    field={field}
                                                    label="Location"
                                                    placeholder="Dhaka Office"
                                                    icon={<MapPin />}
                                                    optional
                                                />
                                            )}
                                        </form.Field>
                                    </div>
                                </FormSection>

                                
                                {/* SUBMIT */}
                                

                                <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/70 via-white to-violet-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                            <FileText className="size-4" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Ready to create this asset?
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Please review the information
                                                before submitting.
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-11 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl disabled:opacity-70 sm:w-auto"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                Creating Asset...
                                            </>
                                        ) : (
                                            <>
                                                <Package className="size-4" />
                                                Create Asset
                                            </>
                                        )}
                                    </Button>
                                </div>

                            </FieldGroup>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssetForm;

/* HELPER COMPONENTS*/
const Required = () => (
    <span className="ml-1 text-red-500">*</span>
);

const FormSection = ({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) => {
    return (
        <section>
            <div className="mb-5 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200">
                    {icon}
                </div>

                <div>
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                        {title}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
};

const FormInput = ({
    field,
    label,
    placeholder,
    type = "text",
    icon,
    required = false,
    optional = false,
}: {
    field: any;
    label: string;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    required?: boolean;
    optional?: boolean;
}) => {
    const isInvalid =
        field.state.meta.isTouched &&
        !field.state.meta.isValid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>
                {label}

                {required && <Required />}

                {optional && (
                    <span className="ml-1 text-xs font-normal text-slate-400">
                        Optional
                    </span>
                )}
            </FieldLabel>

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400">
                        {icon}
                    </span>
                )}

                <Input
                    id={field.name}
                    name={field.name}
                    type={type}
                    placeholder={placeholder}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                        field.handleChange(
                            event.target.value,
                        )
                    }
                    className={`h-11 rounded-xl border-slate-200 bg-slate-50/50 transition-all hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/20 ${
                        icon ? "pl-10" : ""
                    }`}
                    aria-invalid={isInvalid}
                />
            </div>

            {isInvalid && (
                <FieldError
                    errors={field.state.meta.errors}
                />
            )}
        </Field>
    );
};
