"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Package,
  Clock3,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { AssetRequestResponse, AssetRequestStatus } from "@/types";
import { useAssetRequestAction, useGetAllAssetRequests, useGetMyAssetRequests } from "@/hooks";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

const statusStyles: Record<AssetRequestStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
};

function StatusBadge({
  status,
}: {
  status: AssetRequestStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof Package;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>
        <div className="rounded-xl bg-orange-50 p-2.5 text-[#f15825]">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function AssetRequestsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AssetRequestResponse | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetRequestResponse | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const params = {
    searchTerm: debouncedSearch || undefined,
    status: (status || undefined) as AssetRequestStatus | undefined,
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  };

  // const { data, isPending, isError, error, refetch, isFetching } =
  //   useGetMyAssetRequests(params);
  const { data: allRequests, isPending, isError, error, refetch, isFetching } =
    useGetAllAssetRequests();

  const actions = useAssetRequestAction();

  const requests = allRequests?.data ?? [];
  const meta = allRequests?.meta;

  const total = meta?.total ?? requests.length;
  const totalPages = meta?.totalPages ?? 1;

  // These cards summarize the currently fetched page.
  const pending = requests.filter((r: AssetRequestResponse) => r.status === "PENDING").length;
  const approved = requests.filter((r: AssetRequestResponse) => r.status === "APPROVED").length;
  const rejected = requests.filter((r: AssetRequestResponse) => r.status === "REJECTED").length;

  console.log(requests)
  async function runAction(
    label: string,
    operation: () => Promise<unknown>,
  ) {
    try {
      await operation();
      toast.add({
        type: "success",
        title: label
      });
    } catch (err) {
      toast.add({
        type: "error",
        title: "Action Failed",
        description: err instanceof Error ? err.message : "Action failed",
      });
    }
  }

  async function handleReject() {
    if (!rejectingId) return;

    try {
      await actions.reject.mutateAsync({
        id: rejectingId,
        payload: { rejectionReason: rejectReason },
      });
      toast.add({
        type: "success",
        title: "Request rejected successfully"
      });
      setRejectingId(null);
      setRejectReason("");
    } catch (err) {
      toast.add({
        type: "error",
        title: "Unable to reject request Failed",
        description: err instanceof Error ? err.message : "Unable to reject request",
      });
    }
  }

  return (
    <main className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Package size={16} />
              <span>Asset Management</span>
              <span>/</span>
              <span className="text-slate-700">Requests</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Asset Requests
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage, review and track employee asset requests.
            </p>
          </div>

          <Link
            href="/super-admin/asset-requests/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f15825] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#dc481b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <Plus size={18} />
            Create Request
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total Requests" value={total} icon={ClipboardList} />
          <SummaryCard title="Pending (this page)" value={pending} icon={Clock3} />
          <SummaryCard title="Approved (this page)" value={approved} icon={CheckCircle2} />
          <SummaryCard title="Rejected (this page)" value={rejected} icon={XCircle} />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                All requests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search and filter requests by their current status.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search requests..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#f15825] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#f15825] focus:ring-2 focus:ring-orange-100"
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                aria-label="Refresh requests"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {isPending ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((key) => (
                <div
                  key={key}
                  className="h-14 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-rose-600">
                Failed to load requests
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {error.message}
              </p>
              <Button
                onClick={() => void refetch()}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
              >
                Try again
              </Button>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-[#f15825]">
                <Package size={25} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No requests found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or create a new request.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-250 text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Employee</th>
                      <th className="px-5 py-4 font-semibold">Asset / Category</th>
                      <th className="px-5 py-4 font-semibold">Qty</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Requested on</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {requests.map((request: AssetRequestResponse) => (
                      <tr key={request.id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {request.employee?.name ?? "Unknown employee"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {request.employee?.email ?? request.employeeId}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {request.requestedAsset?.name ?? "General asset request"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {request.category?.name ?? "Unknown category"}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700">
                          {request.quantity}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={request.status} />
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {new Date(request.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant={"outline"}
                              title="View details"
                              aria-label="View details"
                              onClick={() => setSelected(request)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye size={17} />
                            </Button>

                            {request.status === "PENDING" && (
                              <Button
                                variant={"outline"}
                                nativeButton={false}
                                render={<Link
                                  href={`/super-admin/asset-requests/${request.id}`}
                                  title="Edit request"
                                  aria-label="Edit request"
                                  className="rounded-lg p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                                >
                                  <Pencil size={17} />
                                </Link>}
                                className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                              >
                              </Button>


                            )}

                            {request.status === "PENDING" && (
                              <>
                                <Button
                                  variant={"outline"}
                                  title="Approve request"
                                  aria-label="Approve request"
                                  disabled={actions.approve.isPending}
                                  onClick={() => {
                                    if (window.confirm("Approve this asset request?")) {
                                      void runAction(
                                        "Request approved",
                                        () => actions.approve.mutateAsync(request.id),
                                      );
                                    }
                                  }}
                                  className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                                >
                                  <CheckCircle2 size={17} />
                                </Button>

                                <Button
                                  variant={"outline"}
                                  title="Reject request"
                                  aria-label="Reject request"
                                  onClick={() => setRejectingId(request.id)}
                                  className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                                >
                                  <XCircle size={17} />
                                </Button>
                              </>
                            )}

                            <Button
                              variant={"outline"}
                              title="Delete request"
                              aria-label="Delete request"
                              onClick={() => setDeleteTarget(request)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 size={17} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Page {page} of {Math.max(totalPages, 1)} · {total} total requests
                </p>

                <div className="flex gap-2">
                  <Button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Previous
                  </Button>
                  <Button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          >
            {/* Background overlay */}
            <button
              type="button"
              aria-label="Close request details"
              className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="request-detail-title"
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
              {/* Background overlay */}
              <button
                type="button"
                aria-label="Close request details"
                className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="request-detail-title" className="text-xl font-bold text-slate-900">
                    Request details
                  </h2>
                  <p className="mt-1 break-all text-xs text-slate-400">
                    ID: {selected.id}
                  </p>
                </div>
                <Button
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={19} />
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Status</span>
                  <StatusBadge status={selected.status} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Employee</p>
                  <p className="mt-1 font-medium">{selected.employee?.name ?? "Unknown"}</p>
                  <p className="text-sm text-slate-500">{selected.employee?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="mt-1 font-medium">{selected.category?.name ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Requested asset</p>
                  <p className="mt-1 font-medium">
                    {selected.requestedAsset?.name ?? "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Quantity</p>
                  <p className="mt-1 font-medium">{selected.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Reason</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {selected.reason}
                  </p>
                </div>
                {selected.rejectionReason && (
                  <div className="rounded-xl bg-rose-50 p-3">
                    <p className="text-xs font-semibold text-rose-700">Rejection reason</p>
                    <p className="mt-1 text-sm text-rose-800">
                      {selected.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setSelected(null)}
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {rejectingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-slate-900">Reject asset request</h2>
              <p className="mt-2 text-sm text-slate-500">
                Provide a reason so the employee understands the decision.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Enter rejection reason (at least 5 characters)"
                className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#f15825] focus:ring-2 focus:ring-orange-100"
              />
              <div className="mt-4 flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setRejectingId(null);
                    setRejectReason("");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium"
                >
                  Cancel
                </Button>
                <Button
                  disabled={rejectReason.trim().length < 5 || actions.reject.isPending}
                  onClick={() => void handleReject()}
                  className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {actions.reject.isPending ? "Rejecting..." : "Confirm rejection"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <div role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex size-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Trash2 size={22} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Delete request?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will permanently delete the selected request. This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium"
                >
                  Keep request
                </Button>
                <Button
                  disabled={actions.delete.isPending}
                  onClick={() => {
                    void runAction(
                      "Request deleted successfully",
                      async () => {
                        await actions.delete.mutateAsync(deleteTarget.id);
                        setDeleteTarget(null);
                        setSelected(null);
                      },
                    );
                  }}
                  className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {actions.delete.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
