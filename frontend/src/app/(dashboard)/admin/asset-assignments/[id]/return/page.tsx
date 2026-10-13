"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  PackageCheck,
  RotateCcw,
  UserRound,
  AlertCircle,
} from "lucide-react";

import { useGetAssetAssignmentById, useReturnAssetAssignment } from "@/hooks/assetAssignment.hooks";

const conditions = [
  { value: "NEW", label: "New" },
  { value: "GOOD", label: "Good" },
  { value: "FAIR", label: "Fair" },
  { value: "POOR", label: "Poor" },
  { value: "DAMAGED", label: "Damaged" },
] as const;

type ReturnCondition = (typeof conditions)[number]["value"];

const formatDate = (date?: string | null) => {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export default function ReturnAssetAssignmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: response, isLoading, isError } =
    useGetAssetAssignmentById(id);

  const returnMutation = useReturnAssetAssignment();

  const [returnCondition, setReturnCondition] =
    useState<ReturnCondition>("GOOD");
  const [remarks, setRemarks] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Supports APIs returning either { data: assignment } or the assignment directly.
  const assignment = response?.data ?? response;

  const isReturned = Boolean(assignment?.returnedAt);

  const handleReturn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (!id || !assignment) {
      setErrorMessage("Assignment information could not be found.");
      return;
    }

    if (isReturned) {
      setErrorMessage("This asset has already been returned.");
      return;
    }

    try {
      await returnMutation.mutateAsync({
        id,
        payload: {
          returnCondition,
          remarks: remarks.trim() || undefined,
        },
      });

      router.push(`/super-admin/asset-assignments/${id}`);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to return this asset. Please try again.";

      setErrorMessage(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d719e]" />
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <AlertCircle className="mb-3 h-7 w-7" />
          <h2 className="text-lg font-semibold">
            Unable to load assignment
          </h2>
          <p className="mt-1 text-sm">
            Please check the assignment ID or try again.
          </p>
          <Link
            href="/super-admin/asset-assignments"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to assignments
          </Link>
        </div>
      </div>
    );
  }

  const asset = assignment.asset;
  const employee = assignment.employee;

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <Link
            href={`/super-admin/asset-assignments/${id}`}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#0d719e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to assignment details
          </Link>

          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d719e] to-[#164e63] p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Return Assigned Asset
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
                  Record the returned asset condition and complete the
                  assignment return process.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs text-white/70">Assignment ID</p>
                <p className="mt-1 max-w-52 break-all font-mono text-sm font-semibold">
                  {assignment.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Already returned notice */}
        {isReturned && (
          <div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h2 className="font-semibold">Asset already returned</h2>
              <p className="mt-1 text-sm">
                Returned on {formatDate(assignment.returnedAt)}.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          {/* Assignment details */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-orange-50 p-3 text-[#f15825]">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Asset Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Details of the assigned item
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoRow label="Asset Name" value={asset?.name} />
                <InfoRow label="Asset Tag" value={asset?.assetTag} />
                <InfoRow label="Brand" value={asset?.brand} />
                <InfoRow label="Model" value={asset?.model} />
                <InfoRow label="Serial Number" value={asset?.serialNumber} />
                <InfoRow label="Current Condition" value={asset?.condition} />
                <InfoRow label="Location" value={asset?.location} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-[#0d719e]">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Employee Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Employee returning the asset
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoRow label="Employee Name" value={employee?.name} />
                <InfoRow label="Email" value={employee?.email} />
                <InfoRow label="Department" value={employee?.department} />
                <InfoRow label="Designation" value={employee?.designation} />
                <InfoRow label="Assigned On" value={formatDate(assignment.assignedAt)} />
              </div>
            </div>
          </section>

          {/* Return form */}
          <aside>
            <form
              onSubmit={handleReturn}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#f15825]">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Return Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Inspect the asset and select its condition after return.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="returnCondition"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Condition on Return
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <select
                    id="returnCondition"
                    value={returnCondition}
                    onChange={(event) =>
                      setReturnCondition(event.target.value as ReturnCondition)
                    }
                    disabled={isReturned || returnMutation.isPending}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#0d719e] focus:ring-2 focus:ring-[#0d719e]/15 disabled:bg-slate-100"
                  >
                    {conditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Select the actual physical condition after inspection.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="remarks"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Return Remarks
                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="remarks"
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                    disabled={isReturned || returnMutation.isPending}
                    rows={5}
                    maxLength={1000}
                    placeholder="Mention damage, missing accessories, or other observations..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0d719e] focus:ring-2 focus:ring-[#0d719e]/15 disabled:bg-slate-100"
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {remarks.length}/1000
                  </p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    Before confirming
                  </p>
                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Confirm that the asset has physically been received.
                    Returning it will mark the asset as Available.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isReturned || returnMutation.isPending}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f15825] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d94b1d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {returnMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Return...
                    </>
                  ) : isReturned ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Already Returned
                    </>
                  ) : (
                    <>
                      <PackageCheck className="h-4 w-4" />
                      Confirm Asset Return
                    </>
                  )}
                </button>

                <Link
                  href={`/super-admin/asset-assignments/${id}`}
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="break-words text-sm font-medium text-slate-800 sm:max-w-[60%] sm:text-right">
        {value || "Not provided"}
      </span>
    </div>
  );
}