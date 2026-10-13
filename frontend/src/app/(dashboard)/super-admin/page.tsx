"use client";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Laptop,
  LayoutDashboard,
  Package,
  Plus,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";

const stats = [
  {
    title: "Total Assets",
    value: "—",
    description: "Asset inventory overview",
    icon: Package,
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-50 text-blue-600",
    href: "/super-admin/assets",
  },
  {
    title: "Total Employees",
    value: "—",
    description: "Registered team members",
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-50 text-violet-600",
    href: "/super-admin/users",
  },
  {
    title: "Pending Requests",
    value: "—",
    description: "Requests awaiting review",
    icon: Clock3,
    gradient: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-50 text-amber-600",
    href: "/super-admin/asset-requests",
  },
  {
    title: "Under Maintenance",
    value: "—",
    description: "Assets needing attention",
    icon: Wrench,
    gradient: "from-rose-500 to-pink-600",
    iconBg: "bg-rose-50 text-rose-600",
    href: "/super-admin/assets",
  },
];

const quickActions = [
  {
    title: "Add New Asset",
    description: "Register equipment and inventory.",
    icon: Plus,
    iconBg: "bg-blue-50 text-blue-600",
    href: "/super-admin/assets/create",
  },
  {
    title: "Manage Employees",
    description: "View and manage team members.",
    icon: Users,
    iconBg: "bg-violet-50 text-violet-600",
    href: "/super-admin/users",
  },
  {
    title: "Asset Requests",
    description: "Review employee asset requests.",
    icon: Package,
    iconBg: "bg-amber-50 text-amber-600",
    href: "/super-admin/asset-requests",
  },
  {
    title: "Asset Assignments",
    description: "Track assigned company equipment.",
    icon: Laptop,
    iconBg: "bg-emerald-50 text-emerald-600",
    href: "/super-admin/asset-assignments",
  },
];

function getInitials(name?: string) {
  if (!name?.trim()) return "SA";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 w-full rounded-3xl" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Skeleton
            key={stat.title}
            className="h-36 w-full rounded-2xl"
          />
        ))}
      </div>

      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}

export default function SuperAdminPage() {
  const {
    data: profileData,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetMe();

  const profile = profileData?.data;

  if (isPending) {
    return (
      <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <DashboardSkeleton />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Activity className="size-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Unable to load your dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error instanceof Error
              ? error.message
              : "Something went wrong while fetching your profile."}
          </p>

          <Button
            className="mt-6 rounded-xl"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Retrying..." : "Try again"}
          </Button>
        </div>
      </main>
    );
  }

  const name = profile?.name || "Super Admin";
  const email = profile?.email || "Email not available";
  const image = profile?.profileImage;
  const role = profile?.role?.replaceAll("_", " ") || "SUPER ADMIN";
  const department = profile?.department || "Administration";
  const designation = profile?.designation || "System Administrator";

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <LayoutDashboard className="size-4" />
              <span>Administration / Overview</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage your assets, people, and operations in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm sm:self-auto">
            <CalendarDays className="size-4 text-blue-600" />
            <span>
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Welcome banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-[#0d719e] via-[#155eaa] to-[#4338ca] p-6 text-white shadow-lg shadow-blue-900/10 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 size-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 size-64 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50 backdrop-blur-sm">
                <ShieldCheck className="size-4" />
                NovoSoft Asset Management
              </div>

              <p className="text-sm font-medium text-blue-100">
                Welcome back,
              </p>

              <h2 className="mt-1 wrap-break-word text-3xl font-bold tracking-tight sm:text-4xl">
                {name}!
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50/90 sm:text-base">
                Your administration workspace is ready. Monitor your
                organization, manage company assets, and keep everything
                running smoothly.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                variant={"outline"}
                  className="rounded-xl text-blue-700 shadow-sm hover:bg-blue-50"
                  nativeButton={false}
                  render={
                    <Link href="/super-admin/assets/create">
                      <Plus className="mr-2 size-4" />
                      Add New Asset
                    </Link>
                  }
                ></Button>
                <Button
                variant={"outline"}
                  className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  nativeButton={false}
                  render={
                    <Link href="/super-admin/asset-requests">
                    View Requests
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                  }
                ></Button>
              </div>
            </div>

            {/* Profile card */}
            <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:min-w-72 sm:p-5">
              <Avatar className="size-16 shrink-0 border-2 border-white/40 shadow-lg sm:size-20">
                <AvatarImage
                  src={image || undefined}
                  alt={`${name}'s profile`}
                />
                <AvatarFallback className="bg-white text-xl font-bold text-blue-700">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{name}</p>
                <p className="mt-0.5 truncate text-sm text-blue-100">
                  {designation}
                </p>
                <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-medium text-emerald-50">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span className="truncate">Account profile</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Organization Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A snapshot of your asset management operations.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Analytics API not connected
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.title}
                  href={stat.href}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${stat.gradient}`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex size-12 items-center justify-center rounded-2xl ${stat.iconBg}`}
                    >
                      <Icon className="size-6" />
                    </div>

                    <div className="rounded-lg p-2 text-slate-400 transition-colors group-hover:bg-slate-50 group-hover:text-slate-700">
                      <ArrowUpRight className="size-5" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          {/* Quick actions */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Get things done faster.
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Activity className="size-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${action.iconBg}`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-800">
                        {action.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {action.description}
                      </p>
                    </div>

                    <ChevronRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Account information */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Account Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your administrator profile.
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <CircleUserRound className="size-5" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CircleUserRound className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    Full Name
                  </p>
                  <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">
                    {name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Building2 className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    Department
                  </p>
                  <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">
                    {department}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    System Role
                  </p>
                  <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">
                    {role}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <CircleUserRound className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">
                    Email Address
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {email}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <Link
                href="/super-admin/profile"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                View Profile
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>

        {/* Footer notice */}
        <footer className="flex flex-col justify-between gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            <span className="font-semibold text-slate-700">NovoSoft</span>{" "}
            Asset Management System
          </p>
          <p className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            Dashboard interface ready
          </p>
        </footer>
      </div>
    </main>
  );
}