import { z } from "zod";

export const createAssetSchema = z.object({
    assetTag: z
        .string()
        .min(1, "Asset tag is required")
        .max(50, "Asset tag must be less than 50 characters"),

    name: z
        .string()
        .min(1, "Asset name is required")
        .max(150, "Asset name must be less than 150 characters"),

    categoryId: z
        .string()
        .uuid("Please select a valid category"),

    brand: z
        .string().min(1, "Brand is required.")
        .max(100, "Brand must be less than 100 characters"),

    model: z
        .string().min(1,"Model Number must be enter.")
        .max(100, "Model must be less than 100 characters"),

    serialNumber: z
        .string().min(1,"Serial Number must be enter.")
        .max(
            100,
            "Serial number must be less than 100 characters",
        ),

    description: z
        .string()
        .max(
            1000,
            "Description must be less than 1000 characters",
        ),

    purchasePrice: z
        .number()
        .min(1, "Purchase price cannot be negative"),

    purchaseDate: z
        .string()
        .min(1, "Purchase date is required"),

    warrantyExpiry: z.string().min(1, "Warranty date is required"),

    condition: z.enum([
        "NEW",
        "GOOD",
        "FAIR",
        "POOR",
        "DAMAGED",
    ]),

    location: z
        .string()
        .max(
            200,
            "Location must be less than 200 characters",
        ),

    imageUrl: z
        .string()
        .url("Please enter a valid image URL")
        .or(z.literal("")),

    vendorId: z
        .string()
        .uuid("Please select a valid vendor")
        .or(z.literal("")),
});

export type CreateAssetFormValues = z.infer<
    typeof createAssetSchema
>