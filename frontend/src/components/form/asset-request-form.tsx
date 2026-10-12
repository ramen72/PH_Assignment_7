"use client";

import { AssetRequestFormValues, assetRequestSchema } from "@/validation";
import { useCreateAssetRequest } from "@/hooks";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";

export function AssetRequestForm() {
  const router = useRouter();
  const createRequest = useCreateAssetRequest();
  console.log(createRequest)

  const form = useForm({
    defaultValues: {
      categoryId: "",
      requestedAssetId: "",
      quantity: 1,
      reason: "",
    } as AssetRequestFormValues,

    // validators: {
    //   onSubmit: assetRequestSchema,
    // },

    onSubmit: async ({ value }) => {
      try {
        const validated = assetRequestSchema.parse(value);

        await createRequest.mutateAsync({
          ...validated,
          requestedAssetId: validated.requestedAssetId || undefined,
        });

        router.push("/employee/asset-requests");
      } catch (error) {
        console.error("Failed to create asset request:", error);
        const errorMessage =
          typeof error === "object" &&
            error !== null &&
            "data" in error &&
            typeof error.data === "object" &&
            error.data !== null &&
            "message" in error.data &&
            typeof error.data.message === "string"
            ? error.data.message
            : error instanceof Error
              ? error.message
              : "Failed to create asset request.";
        toast.add({
          type: "error",
          title: errorMessage,
        });
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      className="mx-auto w-full max-w-3xl space-y-6"
    >
      {/* Form heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Request an Asset
        </h1>

        <p className="text-sm text-muted-foreground">
          Submit an asset request for your work requirements.
        </p>
      </div>

      {/* Category, Asset and Quantity */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Asset Category */}        
        <form.Field name="categoryId">
        {(field) => (
            <div className="space-y-2">
            <label
                htmlFor={field.name}
                className="text-sm font-medium"
            >
                Asset Category
            </label>

            <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                field.handleChange(event.target.value)
                }
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm"
                required
            >
                <option value="">Select a category</option>
            </select>

            {/* {field.state.meta.errors.map((error) => {
                const message =
                typeof error === "string" ? error : error?.message;

                if (!message) return null;

                return (
                <p
                    key={message}
                    className="text-xs text-destructive"
                >
                    {message}
                </p>
                );
            })} */}
            </div>
        )}
        </form.Field>


        {/* Specific Asset */}
        <form.Field name="requestedAssetId">
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-sm font-medium"
              >
                Specific Asset (Optional)
              </label>

              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value)
                }
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm"
              >
                <option value="">No specific asset</option>
                {/* Populate assets filtered by categoryId */}
              </select>

              {/* {field.state.meta.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-xs text-destructive"
                >
                  {typeof error === "string"
                    ? error
                    : error?.message}
                </p>
              ))} */}
            </div>
          )}
        </form.Field>

        {/* Quantity */}
        <form.Field name="quantity">
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-sm font-medium"
              >
                Quantity
              </label>

              <input
                id={field.name}
                name={field.name}
                type="number"
                min={1}
                step={1}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.valueAsNumber)
                }
                className="h-11 w-full rounded-lg border bg-background px-3 text-sm"
                required
              />

              {/* {field.state.meta.errors.map((error, index) => (
                <p
                  key={index}
                  className="text-xs text-destructive"
                >
                  {typeof error === "string"
                    ? error
                    : error?.message}
                </p>
              ))} */}
            </div>
          )}
        </form.Field>
      </div>

      {/* Request Reason */}
      <form.Field name="reason">
        {(field) => (
          <div className="space-y-2">
            <label
              htmlFor={field.name}
              className="text-sm font-medium"
            >
              Reason for Request
            </label>

            <textarea
              id={field.name}
              name={field.name}
              rows={5}
              maxLength={1000}
              placeholder="Explain why you need this asset..."
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.target.value)
              }
              className="w-full resize-y rounded-lg border bg-background p-3 text-sm"
              required
            />

            <p className="text-xs text-muted-foreground">
              {field.state.value.length}/1000 characters
            </p>

            {/* {field.state.meta.errors.map((error, index) => (
              <p
                key={index}
                className="text-xs text-destructive"
              >
                {typeof error === "string"
                  ? error
                  : error?.message}
              </p>
            ))} */}
          </div>
        )}
      </form.Field>

      {/* Form Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border px-5 py-2.5 text-sm font-medium"
        >
          Cancel
        </button>

        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={
                !canSubmit ||
                isSubmitting ||
                createRequest.isPending
              }
              className="rounded-lg bg-[#0d719e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#095b80] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting || createRequest.isPending
                ? "Submitting..."
                : "Submit Request"}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}