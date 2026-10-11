"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Laptop,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
  FileText,
  Hash,
  AlertCircle,
  LoaderCircle,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAssetAssignmentById } from "@/hooks";
import type { AssetAssignment } from "@/types";

// import { useGetAssetAssignmentById } from "@/hooks/assetAssignment.hooks";
// import type { AssetAssignment } from "@/types/assetAssignment.types";

function formatDate(value?: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatusBadge({
  returned,
}: {
  returned: boolean;
}) {
  return returned ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
      <CheckCircle2 className="size-3.5" />
      Returned
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      <Clock3 className="size-3.5" />
      Currently Assigned
    </span>
  );
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition-colors hover:border-slate-200 sm:p-4">
      {Icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="size-4" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-900">
          {value === null || value === undefined || value === ""
            ? "Not provided"
            : value}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function SingleAssetAssignmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const assignmentId = params.id;

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAssetAssignmentById(assignmentId);

  // Supports an API response shaped as { data: assignment }.
  const assignment = (
    response as
      | { data?: AssetAssignment }
      | AssetAssignment
      | undefined
  ) && (
    (response as { data?: AssetAssignment })?.data ??
    (response as AssetAssignment)
  );

  if (isLoading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 p-5">
        <div className="text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <LoaderCircle className="size-7 animate-spin" />
          </div>
          <h2 className="mt-4 font-semibold text-slate-900">
            Loading assignment details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Please wait while we retrieve the information.
          </p>
        </div>
      </main>
    );
  }

  if (isError || !assignment) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-7 text-center sm:p-9">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="size-7" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Unable to load assignment
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The assignment could not be retrieved. It may have been deleted
              or the server may be temporarily unavailable.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded-xl"
              >
                <ArrowLeft className="mr-2 size-4" />
                Go back
              </Button>

              <Button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
              >
                <RefreshCw
                  className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const returned = Boolean(assignment.returnedAt);

  return (
    <main className="min-h-screen bg-slate-50/80 px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="-ml-2 rounded-xl text-slate-600 hover:text-orange-600"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to assignments
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl border-slate-200 bg-white"
          >
            <RefreshCw
              className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-16 -z-10 size-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 size-64 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-100">
                <PackageCheck className="size-4" />
                ASSET ASSIGNMENT DETAILS
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Assignment Overview
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Review the assigned equipment, employee information and
                assignment history.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <StatusBadge returned={returned} />

                <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                  <Hash className="size-3.5 shrink-0" />
                  <span className="break-all">
                    {assignment.id}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex size-16 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 text-orange-400 backdrop-blur sm:size-20">
              <ClipboardIcon />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs text-slate-300">Asset</p>
              <p className="mt-1 wrap-break-word font-semibold">
                {assignment.asset?.name || "Asset information"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs text-slate-300">Assigned employee</p>
              <p className="mt-1 wrap-break-word font-semibold">
                {assignment.employee?.name || "Employee information"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4">
              <p className="text-xs text-slate-300">Assignment date</p>
              <p className="mt-1 wrap-break-word font-semibold">
                {formatDate(assignment.assignedAt)}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Main details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Asset information */}
            <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-linear-to-r from-orange-50/80 to-white px-5 py-5 sm:px-6">
                <SectionHeading
                  icon={Laptop}
                  title="Asset information"
                  description="Details of the equipment associated with this assignment."
                />
              </CardHeader>

              <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6">
                <DetailItem
                  label="Asset name"
                  value={assignment.asset?.name}
                  icon={Laptop}
                />
                <DetailItem
                  label="Asset tag"
                  value={assignment.asset?.assetTag}
                  icon={Hash}
                />
                <DetailItem
                  label="Brand"
                  value={assignment.asset?.brand}
                  icon={PackageCheck}
                />
                <DetailItem
                  label="Model"
                  value={assignment.asset?.model}
                  icon={FileText}
                />
                <DetailItem
                  label="Serial number"
                  value={assignment.asset?.serialNumber}
                  icon={Hash}
                />
                <DetailItem
                  label="Asset condition"
                  value={assignment.asset?.condition}
                  icon={ShieldCheck}
                />
                <DetailItem
                  label="Asset status"
                  value={assignment.asset?.status}
                  icon={BadgeCheck}
                />
                <DetailItem
                  label="Location"
                  value={assignment.asset?.location}
                  icon={MapPin}
                />
              </CardContent>
            </Card>

            {/* Employee information */}
            <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-linear-to-r from-cyan-50/80 to-white px-5 py-5 sm:px-6">
                <SectionHeading
                  icon={Users}
                  title="Employee information"
                  description="The employee who received this asset."
                />
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                <div className="mb-5 flex items-center gap-4 rounded-xl border border-cyan-100 bg-linear-to-r from-cyan-50/70 to-white p-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-lg font-bold text-cyan-800">
                    {assignment.employee?.name
                      ?.split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase() || (
                      <UserRound className="size-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="wrap-break-word font-bold text-slate-900">
                      {assignment.employee?.name || "Unknown employee"}
                    </h3>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {assignment.employee?.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailItem
                    label="Email address"
                    value={assignment.employee?.email}
                    icon={Mail}
                  />
                  <DetailItem
                    label="Phone number"
                    value={assignment.employee?.phone}
                    icon={Phone}
                  />
                  <DetailItem
                    label="Department"
                    value={assignment.employee?.department}
                    icon={Building2}
                  />
                  <DetailItem
                    label="Designation"
                    value={assignment.employee?.designation}
                    icon={UserRound}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Remarks */}
            <Card className="rounded-2xl border-slate-200/80 shadow-sm">
              <CardHeader className="px-5 pb-2 pt-5 sm:px-6">
                <SectionHeading
                  icon={FileText}
                  title="Assignment remarks"
                  description="Notes recorded for this assignment."
                />
              </CardHeader>

              <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-700">
                    {assignment.remarks || "No remarks were provided."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            {/* Timeline */}
            <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-5 py-5">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <CalendarDays className="size-5 text-orange-500" />
                  Assignment timeline
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5">
                <div className="relative space-y-6 before:absolute before:bottom-3 before:left-2.75 before:top-3 before:w-px before:bg-slate-200">
                  <div className="relative flex gap-3">
                    <div className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 ring-4 ring-white">
                      <CheckCircle2 className="size-4" />
                    </div>

                    <div className="min-w-0 pb-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Asset assigned
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {formatDate(assignment.assignedAt)}
                      </p>
                    </div>
                  </div>

                  {returned ? (
                    <div className="relative flex gap-3">
                      <div className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-4 ring-white">
                        <PackageCheck className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          Asset returned
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {formatDate(assignment.returnedAt)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex gap-3">
                      <div className="z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-white">
                        <Clock3 className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          Awaiting return
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          This asset is still assigned.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Assigned by */}
            <Card className="rounded-2xl border-slate-200/80 shadow-sm">
              <CardHeader className="px-5 pb-2 pt-5">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <ShieldCheck className="size-5 text-cyan-600" />
                  Assignment authority
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                    <UserRound className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="wrap-break-word text-sm font-semibold text-slate-900">
                      {assignment.assignedBy?.name || "Not available"}
                    </p>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {assignment.assignedBy?.email || "No email provided"}
                    </p>
                    {assignment.assignedBy?.role && (
                      <span className="mt-2 inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                        {assignment.assignedBy.role.replaceAll("_", " ")}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return information */}
            {returned && (
              <Card className="rounded-2xl border-blue-200 bg-linear-to-br from-blue-50 to-white shadow-sm">
                <CardHeader className="px-5 pb-2 pt-5">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-blue-900">
                    <PackageCheck className="size-5 text-blue-600" />
                    Return information
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 p-5 pt-3">
                  <DetailItem
                    label="Returned at"
                    value={formatDate(assignment.returnedAt)}
                    icon={CalendarDays}
                  />
                  <DetailItem
                    label="Return condition"
                    value={assignment.returnCondition}
                    icon={ShieldCheck}
                  />
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card className="rounded-2xl border-slate-200/80 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div>
                  <p className="text-xs text-slate-500">Created at</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDate(assignment.createdAt)}
                  </p>
                </div>

                <div className="border-t border-slate-100" />

                <div>
                  <p className="text-xs text-slate-500">Last updated</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDate(assignment.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Link
              href="/super-admin/asset-assignments"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
            >
              <ArrowLeft className="size-4" />
              All assignments
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ClipboardIcon() {
  return <PackageCheck className="size-8 sm:size-10" />;
}