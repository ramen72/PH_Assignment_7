
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ArrowLeft, ClipboardList, Loader2, Send } from "lucide-react";
import Link from "next/link";

import { useCreateAssetRequest } from "@/hooks";
import { useGetAllAssetCategories } from "@/hooks";
import { useGetAllAssets } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Asset, Category } from "@/types";
import { toast } from "../../ui/toast";

const assetRequestSchema = z.object({
  categoryId: z.string().uuid("Please select an asset category."),
  requestedAssetId: z.string(),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
  reason: z
    .string()
    .trim()
    .min(5, "Reason must be at least 5 characters.")
    .max(1000, "Reason cannot exceed 1000 characters."),
});

type AssetRequestFormValues = z.infer<typeof assetRequestSchema>;

const initialValues: AssetRequestFormValues = {
  categoryId: "",
  requestedAssetId: "",
  quantity: 1,
  reason: "",
};

export default function AssetRequestForm() {
  const router = useRouter();

  const createMutation = useCreateAssetRequest();

  const {
    data: categoryResponse,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetAllAssetCategories();

  const {
    data: assetResponse,
    isLoading: assetsLoading,
    isError: assetsError,
  } = useGetAllAssets({ page: 1, limit: 100 });

  const categories = categoryResponse?.data ?? [];
  const assets = assetResponse?.data ?? [];

  const form = useForm({
    defaultValues: initialValues,

    onSubmit: async ({ value }) => {
      const parsed = assetRequestSchema.safeParse(value);

      if (!parsed.success) {
        toast.add({
            type:"error",
            title:"Please check the form.",
            description:parsed.error.issues[0]?.message ?? "Please check the form."
        })
        return;
      }

      const payload = {
        categoryId: parsed.data.categoryId,
        ...(parsed.data.requestedAssetId
          ? { requestedAssetId: parsed.data.requestedAssetId }
          : {}),
        quantity: parsed.data.quantity,
        reason: parsed.data.reason,
      };

      try {
        await createMutation.mutateAsync(payload);

        toast.add({
            type:"success",
            title:"Asset request submitted successfully."
        })

        router.push("/admin/asset-requests");
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to submit asset request.";

            toast.add({
            type:"error",
            title:"Please check the form.",
            description:message
        })
      }
    },
  });

  const [categoryId, requestedAssetId] = form.state.values
    ? [
        form.state.values.categoryId,
        form.state.values.requestedAssetId,
      ]
    : ["", ""];

  const filteredAssets = useMemo(
    () =>
      assets.filter(
        (asset:Asset) =>
          asset.categoryId === categoryId &&
          asset.status === "AVAILABLE",
      ),
    [assets, categoryId],
  );

  const isSubmitting = createMutation.isPending;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/employee/asset-requests"
          aria-label="Back to asset requests"
          className="inline-flex size-10 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create Asset Request
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Request the equipment you need for your work.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b px-6 py-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <ClipboardList className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">Request details</h2>
            <p className="text-sm text-muted-foreground">
              Complete the fields below to submit your request.
            </p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-6 p-6"
        >
          {/* Category */}
          <form.Field
            name="categoryId"
            validators={{
              onBlur: ({ value }) => {
                const result = z.string().uuid().safeParse(value);
                return result.success
                  ? undefined
                  : "Please select an asset category.";
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Asset Category <span className="text-destructive">*</span>
                </Label>

                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    form.setFieldValue("requestedAssetId", "");
                  }}
                  disabled={categoriesLoading || categoriesError}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : categoriesError
                        ? "Unable to load categories"
                        : "Select a category"}
                  </option>

                  {categories.map((category:Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}

                {categories.length === 0 && !categoriesLoading && !categoriesError && (
                  <p className="text-sm text-muted-foreground">
                    No asset categories are available.
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Specific asset */}
          <form.Field name="requestedAssetId">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Specific Asset{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>

                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  disabled={
                    !categoryId || assetsLoading || assetsError
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {!categoryId
                      ? "Select a category first"
                      : assetsLoading
                        ? "Loading assets..."
                        : assetsError
                          ? "Unable to load assets"
                          : "No specific asset"}
                  </option>

                  {filteredAssets.map((asset: Asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.assetTag} — {asset.name}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-muted-foreground">
                  Leave blank if you do not have a specific asset in mind.
                </p>

                {categoryId &&
                  !assetsLoading &&
                  !assetsError &&
                  filteredAssets.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No available assets found in this category. You can
                      still submit a category-based request.
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          {/* Quantity */}
          <form.Field
            name="quantity"
            validators={{
              onBlur: ({ value }) =>
                Number.isInteger(value) && value >= 1
                  ? undefined
                  : "Quantity must be a whole number of at least 1.",
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Quantity <span className="text-destructive">*</span>
                </Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  step={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value === ""
                        ? 0
                        : Number(event.target.value),
                    )
                  }
                  required
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Reason */}
          <form.Field
            name="reason"
            validators={{
              onBlur: ({ value }) => {
                const result = z
                  .string()
                  .trim()
                  .min(5, "Reason must be at least 5 characters.")
                  .max(1000, "Reason cannot exceed 1000 characters.")
                  .safeParse(value);

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor={field.name}>
                    Request Reason{" "}
                    <span className="text-destructive">*</span>
                  </Label>

                  <span className="text-xs text-muted-foreground">
                    {field.state.value.length}/1000
                  </span>
                </div>

                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="Explain why you need this asset and how it will be used..."
                  rows={5}
                  maxLength={1000}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  required
                  className="resize-y"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-medium">Before submitting</p>
            <p className="mt-1">
              Check your category, quantity, and reason. Your request will
              be submitted with a pending status for review.
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => router.push("/employee/asset-requests")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || categoriesLoading || categoriesError}
              className="bg-[#f15825] text-white hover:bg-[#d9481b]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
