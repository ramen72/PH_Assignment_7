"use client";

import { useParams } from "next/navigation";
import { useGetSingleAssetRequestById } from "@/hooks";

export default function EditAssetRequestPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isPending, isError, error } =
    useGetSingleAssetRequestById(id);

  if (isPending) {
    return <p className="p-6">Loading asset request...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-rose-600">
        {error.message || "Failed to load asset request."}
      </p>
    );
  }

  // Confirm the actual API response shape before using data.
  const request = data?.data;

  if (!request) {
    return <p className="p-6">Asset request not found.</p>;
  }

  // Render your edit form here using request.
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Edit Asset Request</h1>
      <p className="mt-2 text-sm text-slate-500">
        Request ID: {id}
      </p>

      {/* Connect your TanStack Form and Zod schema here. */}
    </main>
  );
}