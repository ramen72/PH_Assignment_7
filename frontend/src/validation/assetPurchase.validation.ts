import z from "zod";

export const createPurchaseSchema = z.object({
    assetId: z
        .string()
        .min(1, "Asset is required"),

    vendorId: z
        .string()
        .min(1, "Vendor is required"),

    invoiceNumber: z
        .string()
        .min(1, "Invoice number is required")
        .max(100, "Invoice number must be less than 100 characters"),

    quantity: z
        .number()
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1"),

    unitPrice: z
        .number()
        .min(0, "Unit price cannot be negative"),

    purchaseDate: z
        .string()
        .optional(),

    paymentStatus: z.enum([
        "PENDING",
        "PAID",
        "PARTIAL",
        "CANCELLED",
    ]),

    invoiceUrl: z
        .union([
            z.string().url("Invalid invoice URL"),
            z.literal(""),
        ])
        .optional(),

    remarks: z
        .string()
        .max(1000, "Remarks must be less than 1000 characters")
        .optional(),
});