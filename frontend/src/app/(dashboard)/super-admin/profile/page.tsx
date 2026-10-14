"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

type ProfileFieldProps = {
  label: string;
  value?: string | number | null;
  icon: LucideIcon;
  color: string;
  bg: string;
};

function ProfileField({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: ProfileFieldProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p
            className="wrap-break-word text-sm font-semibold text-slate-800 sm:text-base"
            title={value ? String(value) : undefined}
          >
            {value || "Not provided"}
          </p>
        </div>

        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${bg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`size-5 ${color}`} />
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-0.5 w-0 ${bg} transition-all duration-300 group-hover:w-full`}
      />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-screen space-y-6 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>

      <Skeleton className="h-64 w-full rounded-3xl" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <Skeleton key={key} className="h-28 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-40 w-full rounded-2xl" />
    </main>
  );
}

export default function ProfilePage() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetMe();

  const user = data?.data;

  if (isPending) {
    return <ProfileSkeleton />;
  }

  if (isError || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 text-center shadow-xl shadow-red-100/40 sm:p-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle className="size-8 text-red-500" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error instanceof Error
              ? error.message
              : "Please check your connection or sign in again if your session has expired."}
          </p>

          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-6 w-full bg-[#0d719e] text-white hover:bg-[#095a7e]"
          >
            <RefreshCw
              className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Retrying..." : "Try again"}
          </Button>
        </div>
      </main>
    );
  }

  const fields = [
    {
      label: "Email Address",
      value: user.email,
      icon: Mail,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Phone Number",
      value: user.phone,
      icon: Phone,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Department",
      value: user.department,
      icon: Building2,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Designation",
      value: user.designation,
      icon: BriefcaseBusiness,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Account Role",
      value: user.role
        ? user.role
            .toLowerCase()
            .split("_")
            .map(
              (word: string) =>
                word.charAt(0).toUpperCase() + word.slice(1),
            )
            .join(" ")
        : null,
      icon: ShieldCheck,
      color: "text-cyan-700",
      bg: "bg-cyan-50",
    },
    {
      label: "Account Status",
      value: user.status
        ? user.status.charAt(0).toUpperCase() +
          user.status.slice(1).toLowerCase()
        : null,
      icon: CheckCircle2,
      color:
        user.status?.toUpperCase() === "ACTIVE"
          ? "text-emerald-600"
          : "text-amber-600",
      bg:
        user.status?.toUpperCase() === "ACTIVE"
          ? "bg-emerald-50"
          : "bg-amber-50",
    },
  ];

  const completedFields = [
    user.name,
    user.email,
    user.phone,
    user.department,
    user.designation,
    user.profileImage,
  ].filter((value) => value != null && String(value).trim() !== "").length;

  const completionPercentage = Math.round(
    (completedFields / 6) * 100,
  );

  const isActive = user.status?.toUpperCase() === "ACTIVE";

  const initials = user.name
    ?.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/40 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#0d719e]">
              <span className="size-2 rounded-full bg-[#f15825]" />
              NovoSoft / Account
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Manage your personal information and account overview.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-full rounded-xl border-slate-200 bg-white shadow-sm transition hover:border-[#0d719e]/40 hover:text-[#0d719e] sm:w-auto"
          >
            <RefreshCw
              className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh profile
          </Button>
        </div>

        {/* Profile hero */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#0b587c] via-[#0d719e] to-[#159ac1] p-5 text-white shadow-xl shadow-blue-900/10 sm:p-8 lg:p-10">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-28 -z-10 size-80 rounded-full border-8 border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 size-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 -z-10 h-1.5 w-full bg-linear-to-r from-[#f15825] via-orange-300 to-transparent" />

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-full bg-linear-to-br from-orange-300 to-cyan-200 opacity-90 blur-[2px]" />

                <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/90 bg-white text-2xl font-bold text-[#0d719e] shadow-xl sm:size-28 sm:text-3xl">
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={`${user.name}'s profile`}
                      width={112}
                      height={112}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    initials || <UserRound className="size-12" />
                  )}
                </div>

                <span
                  className={`absolute bottom-1 right-1 size-5 rounded-full border-[3px] border-[#0d719e] ${
                    isActive ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                  title={isActive ? "Active account" : "Account status"}
                />
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    <Sparkles className="size-3.5 text-orange-300" />
                    My account
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-emerald-400/15 text-emerald-100"
                        : "bg-amber-400/15 text-amber-100"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isActive ? "bg-emerald-300" : "bg-amber-300"
                      }`}
                    />
                    {isActive ? "Active" : user.status || "Unknown"}
                  </span>
                </div>

                <h2 className="wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  {user.name || "User"}
                </h2>

                <p className="mt-2 break-all text-sm text-blue-100 sm:text-base">
                  {user.email || "No email provided"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
                    <BriefcaseBusiness className="size-4 text-orange-300" />
                    {user.designation || "Designation not set"}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
                    <Building2 className="size-4 text-cyan-200" />
                    {user.department || "No department"}
                  </span>
                </div>
              </div>
            </div>

            {/* Account role card */}
            <div className="w-full rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6 lg:w-64 lg:shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-orange-400/20">
                  <Fingerprint className="size-6 text-orange-200" />
                </div>

                <div>
                  <p className="text-xs font-medium text-blue-100">
                    Assigned Role
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {user.role
                      ? user.role.replace(/_/g, " ")
                      : "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-white/15" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-blue-100">
                  Account status
                </span>
                <BadgeCheck
                  className={`size-5 ${
                    isActive ? "text-emerald-300" : "text-amber-300"
                  }`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section heading */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Personal Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your registered information at a glance.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
            <ShieldCheck className="size-4 text-[#0d719e]" />
            Account overview
          </span>
        </div>

        {/* Information cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <ProfileField key={field.label} {...field} />
          ))}
        </section>

        {/* Account overview */}
        <section className="grid gap-5 lg:grid-cols-5">
          {/* Profile completion */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50">
                    <Sparkles className="size-5 text-[#f15825]" />
                  </div>
                  <h3 className="font-bold text-slate-900">
                    Profile completeness
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Keep your profile details up to date for a better account experience.
                </p>
              </div>

              <span className="shrink-0 text-2xl font-bold text-[#0d719e] sm:text-3xl">
                {completionPercentage}%
              </span>
            </div>

            <div
              className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Profile completeness"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-[#f15825] via-orange-400 to-[#0d719e] transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500 sm:text-sm">
              <span>{completedFields} of 6 profile fields completed</span>
              <span className="font-semibold text-slate-700">
                {completionPercentage === 100
                  ? "All set!"
                  : "Keep it updated"}
              </span>
            </div>
          </div>

          {/* Account security */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-orange-50 via-white to-blue-50 p-5 ring-1 ring-slate-200/80 sm:p-6 lg:col-span-2">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-orange-200/20 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/70">
                  <ShieldCheck className="size-6 text-[#0d719e]" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Account overview
                  </h3>
                  <p className="text-xs text-slate-500">
                    Current account details
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <UsersRound className="size-4 text-violet-500" />
                    Department
                  </span>
                  <span className="max-w-[55%] truncate text-right text-sm font-semibold text-slate-800">
                    {user.department || "Not assigned"}
                  </span>
                </div>

                <div className="h-px bg-slate-200/80" />

                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <WalletCards className="size-4 text-orange-500" />
                    Role
                  </span>
                  <span className="max-w-[55%] truncate text-right text-sm font-semibold text-slate-800">
                    {user.role?.replace(/_/g, " ") || "Not assigned"}
                  </span>
                </div>

                <div className="h-px bg-slate-200/80" />

                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="size-4 text-blue-500" />
                    Status
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {user.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <ShieldCheck className="size-5 text-[#0d719e]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Your account, your workspace
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Your profile information is displayed from your registered account.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold tracking-wide text-[#0d719e]">
            NOVOSOFT ASSET MANAGEMENT
          </span>
        </div>
      </div>
    </main>
  );
}