import { z } from "zod";

export const assetRequestSchema = z.object({
  categoryId: z.string().uuid("Select a valid category"),

  requestedAssetId: z
    .union([z.string().uuid(), z.literal("")])
    .optional(),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),

  reason: z
    .string()
    .trim()
    .min(5, "Reason must be at least 5 characters")
    .max(1000, "Reason cannot exceed 1000 characters"),
});

export const rejectAssetRequestSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(5, "Please provide at least 5 characters")
    .max(1000, "Reason cannot exceed 1000 characters"),
});

export type AssetRequestFormValues = z.infer<
  typeof assetRequestSchema
>;

export type RejectRequestFormValues = z.infer<
  typeof rejectAssetRequestSchema
>;

// ======================================================= New =======================================
export const createAssetRequestSchema = z.object({
  categoryId: z.string().uuid("Select a valid category"),
  requestedAssetId: z.string().uuid().optional().or(z.literal("")),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  reason: z.string().trim()
    .min(5, "Reason must be at least 5 characters")
    .max(1000, "Reason cannot exceed 1000 characters"),
});

export const updateAssetRequestSchema = createAssetRequestSchema
  .partial()
  .refine(
    (value) => Object.values(value).some(
      (item) => item !== undefined,
    ),
    { message: "Provide at least one field to update" },
  );

export type CreateAssetRequestInput = z.infer<
  typeof createAssetRequestSchema
>;

export type UpdateAssetRequestInput = z.infer<
  typeof updateAssetRequestSchema
>;

export type RejectAssetRequestInput = z.infer<
  typeof rejectAssetRequestSchema
>;