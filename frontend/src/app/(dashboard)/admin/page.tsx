/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Laptop,
  Plus,
  RefreshCw,
  ShieldCheck,
  Users,
  Wrench,
  Building2,
  FileText,
} from "lucide-react";
import {
  useGetMe,
  useGetAllUsers,
  useGetAllAssets,
  useGetAllAssetRequests,
  useGetAllAssetPurchases,
  useGetAllPayment,
  useGetAllAssetCategories,
  useGetAllVendors,
  useGetAllAssetAssignments,
} from "@/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type AnyRecord = Record<string, any>;
const palette = [
  "#0d719e",
  "#f15825",
  "#7c3aed",
  "#10b981",
  "#eab308",
  "#ec4899",
  "#06b6d4",
];
function listOf(value: any): AnyRecord[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.data)) return value.data.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}
function initials(name?: string) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "SA"
  );
}
function money(value: unknown) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}
// function titleCase(value: string) {
//   return value
//     .toLowerCase()
//     .replaceAll("_", " ")
//     .replace(/\b\w/g, (c) => c.toUpperCase());
// }

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AdminPage() {
  const [chartKind, setChartKind] = useState<"bar" | "line" | "donut">("bar");
  const [period, setPeriod] = useState("all");
  const profileQuery = useGetMe();
  const usersQuery = useGetAllUsers();
  const assetsQuery = useGetAllAssets({ page: 1, limit: 1000 });
  const requestsQuery = useGetAllAssetRequests({ page: 1, limit: 1000 });
  const purchasesQuery = useGetAllAssetPurchases({ page: 1, limit: 1000 });
  const paymentsQuery = useGetAllPayment();
  const categoriesQuery = useGetAllAssetCategories();
  const vendorsQuery = useGetAllVendors();
  const assignmentsQuery = useGetAllAssetAssignments({ page: 1, limit: 1000 });
  const profile = (profileQuery.data as AnyRecord | undefined)?.data;
  const users = listOf(usersQuery.data);
  const assets = listOf(assetsQuery.data);
  const requests = listOf(requestsQuery.data);
  const purchases = listOf(purchasesQuery.data);
  const payments = listOf(paymentsQuery.data);
  const categories = listOf(categoriesQuery.data);
  const vendors = listOf(vendorsQuery.data);
  const assignments = listOf(assignmentsQuery.data);
  const loading = [
    usersQuery,
    assetsQuery,
    requestsQuery,
    purchasesQuery,
    paymentsQuery,
    categoriesQuery,
    vendorsQuery,
    assignmentsQuery,
  ].some((q) => q.isPending);
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const maintenance = assets.filter(
    (a) => a.status === "UNDER_MAINTENANCE",
  ).length;
  const assignedAssets = assets.filter((a) => a.status === "ASSIGNED").length;
  const availableAssets = assets.filter((a) => a.status === "AVAILABLE").length;
  const paidTotal = payments
    .filter((p) => p.paymentStatus === "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingPayments = payments.filter(
    (p) => p.paymentStatus === "PENDING",
  ).length;
  const purchaseSpend = purchases.reduce(
    (sum, p) =>
      sum +
      Number(
        p.totalAmount ?? Number(p.unitPrice || 0) * Number(p.quantity || 1),
      ),
    0,
  );
  const activeUsers = users.filter(
    (u) => u.status === "ACTIVE" && !u.isDeleted,
  ).length;

  const monthly = useMemo(() => {
    const now = new Date();
    const count = period === "3m" ? 3 : period === "6m" ? 6 : 12;
    return Array.from({ length: count }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (count - 1 - index),
        1,
      );
      const month = date.getMonth();
      const year = date.getFullYear();
      const isInMonth = (item: AnyRecord, key: string) => {
        const d = new Date(item[key] || item.createdAt || "");
        return (
          !Number.isNaN(d.getTime()) &&
          d.getMonth() === month &&
          d.getFullYear() === year
        );
      };
      return {
        label: date.toLocaleDateString("en", { month: "short" }),
        assets: assets.filter((a) => isInMonth(a, "createdAt")).length,
        requests: requests.filter((r) => isInMonth(r, "createdAt")).length,
        purchases: purchases.filter((p) => isInMonth(p, "purchaseDate")).length,
      };
    });
  }, [assets, requests, purchases, period]);
  const statusData = [
    { label: "Available", value: availableAssets, color: "#10b981" },
    { label: "Assigned", value: assignedAssets, color: "#0d719e" },
    { label: "Maintenance", value: maintenance, color: "#f15825" },
    {
      label: "Other",
      value: Math.max(
        0,
        assets.length - availableAssets - assignedAssets - maintenance,
      ),
      color: "#8b5cf6",
    },
  ];
  const maxTrend = Math.max(
    1,
    ...monthly.map((m) => Math.max(m.assets, m.requests, m.purchases)),
  );
  const refreshAll = () => {
    void Promise.all([
      usersQuery.refetch(),
      assetsQuery.refetch(),
      requestsQuery.refetch(),
      purchasesQuery.refetch(),
      paymentsQuery.refetch(),
      categoriesQuery.refetch(),
      vendorsQuery.refetch(),
      assignmentsQuery.refetch(),
      profileQuery.refetch(),
    ]);
  };
  const name = profile?.name || "Admin";
  const profileImage = profile?.profileImage || profile?.imageUrl;
  const navActions = [
    {
      label: "Add asset",
      desc: "Register equipment",
      href: "/admin/assets/create",
      icon: Plus,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Review requests",
      desc: `${pendingRequests} awaiting review`,
      href: "/admin/asset-requests",
      icon: FileText,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Manage users",
      desc: "Roles and accounts",
      href: "/admin/users",
      icon: Users,
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Record purchase",
      desc: "Purchases and invoices",
      href: "/admin/asset-purchases/create",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-700",
    },
  ];
  const stats = [
    {
      label: "Total assets",
      value: assets.length,
      note: `${availableAssets} available`,
      icon: Boxes,
      color: "from-sky-500 to-blue-700",
      href: "/admin/assets",
    },
    {
      label: "Active users",
      value: activeUsers,
      note: `${users.length} registered accounts`,
      icon: Users,
      color: "from-violet-500 to-purple-700",
      href: "/admin/users",
    },
    {
      label: "Pending requests",
      value: pendingRequests,
      note: "Require your attention",
      icon: Clock3,
      color: "from-amber-400 to-orange-600",
      href: "/admin/asset-requests",
    },
    {
      label: "Paid purchases",
      value: money(paidTotal),
      note: `${pendingPayments} payments pending`,
      icon: CircleDollarSign,
      color: "from-emerald-400 to-teal-700",
      href: "/admin/payments",
    },
  ];

  if (profileQuery.isPending)
    return (
      <main className="space-y-5 p-3 sm:p-5 lg:p-7">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </main>
    );
  if (profileQuery.isError)
    return (
      <div className="m-4 rounded-2xl border border-red-200 bg-white p-8 text-center">
        <Activity className="mx-auto mb-3 size-8 text-red-500" />
        <h2 className="font-semibold">Could not load your admin profile</h2>
        <p className="mt-2 text-sm text-slate-500">
          Please check your session and try again.
        </p>
        <Button className="mt-4" onClick={() => profileQuery.refetch()}>
          Try again
        </Button>
      </div>
    );

  return (
    <main className="min-h-screen space-y-5 bg-slate-50/60 p-3 sm:space-y-6 sm:p-5 lg:p-7">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#0d719e]">
            <ShieldCheck className="size-4" /> NovoSoft Control Center
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Your organization, inventory, requests and payments at a glance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-xs text-slate-600">
            <CalendarDays className="size-4 text-[#0d719e]" />
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl bg-white"
            onClick={refreshAll}
            title="Refresh dashboard"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link
            href="/admin/notifications"
            className="relative inline-flex size-10 items-center justify-center rounded-xl border bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            {pendingRequests > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                {Math.min(9, pendingRequests)}
              </span>
            )}
          </Link>
          <Link
            href="/admin/profile"
            className="flex max-w-55 items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm transition hover:border-[#0d719e]/40 hover:shadow"
          >
            <Avatar className="size-9">
              <AvatarImage src={profileImage || undefined} alt={name} />
              <AvatarFallback className="bg-sky-100 text-xs font-bold text-sky-800">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 text-left">
              <span className="block max-w-32 truncate text-sm font-semibold text-slate-800">
                {name}
              </span>
              <span className="block text-[11px] text-slate-500">
                Admin
              </span>
            </span>
            <ChevronDown className="size-4 text-slate-400" />
          </Link>
        </div>
      </header>

      <section className="relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-[#0d719e] via-[#155eaa] to-[#4f46e5] p-5 text-white shadow-lg shadow-blue-950/10 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-8 -top-20 -z-10 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-22.5 right-1/3 -z-10 size-52 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs">
              <CheckCircle2 className="size-3.5 text-emerald-200" /> Secure
              administrator access
            </span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              Welcome back, {name.split(" ")[0]}!
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50/90">
              Here is the latest operational snapshot. Review exceptions, keep
              assets accountable, and take action from one central workspace.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-72">
            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-blue-100">Asset categories</p>
              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : categories.length}
              </p>
              <p className="mt-1 text-[11px] text-blue-100">Inventory groups</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-blue-100">Registered vendors</p>
              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : vendors.length}
              </p>
              <p className="mt-1 text-[11px] text-blue-100">
                Supplier directory
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${stat.color}`}
              />
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl bg-linear-to-br ${stat.color} text-white shadow-sm`}
                >
                  <Icon className="size-5" />
                </div>
                <ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-[#0d719e]" />
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500 sm:text-sm">
                {stat.label}
              </p>
              <p className="mt-1 wrap-break-word text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {loading ? "—" : stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
            </Link>
          );
        })}
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.85fr)]">
        <Panel
          title="Operations analytics"
          subtitle="Monthly activity from your current inventory and request records."
          action={
            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Chart type"
                value={chartKind}
                onChange={(e) =>
                  setChartKind(e.target.value as typeof chartKind)
                }
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-sky-500"
              >
                <option value="bar">Bar chart</option>
                <option value="line">Trend chart</option>
                <option value="donut">Asset mix</option>
              </select>
              <select
                aria-label="Analytics period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-sky-500"
              >
                <option value="3m">3 months</option>
                <option value="6m">6 months</option>
                <option value="all">12 months</option>
              </select>
            </div>
          }
        >
          {chartKind === "donut" ? (
            <div className="flex flex-col items-center gap-6 py-3 sm:flex-row sm:justify-around">
              <div
                className="relative size-48 shrink-0 rounded-full"
                style={{
                  background: `conic-gradient(${statusData
                    .map((d, i) => {
                      const total = Math.max(
                        1,
                        statusData.reduce((s, x) => s + x.value, 0),
                      );
                      const start =
                        (statusData
                          .slice(0, i)
                          .reduce((s, x) => s + x.value, 0) /
                          total) *
                        100;
                      const end = start + (d.value / total) * 100;
                      return `${d.color} ${start}% ${end}%`;
                    })
                    .join(", ")})`,
                }}
              >
                <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-bold text-slate-900">
                    {assets.length}
                  </span>
                  <span className="text-xs text-slate-500">Total assets</span>
                </div>
              </div>
              <div className="w-full max-w-xs space-y-4">
                {statusData.map((d) => (
                  <div
                    key={d.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.label}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {d.value}
                      <span className="ml-2 text-xs font-normal text-slate-400">
                        {assets.length
                          ? Math.round((d.value / assets.length) * 100)
                          : 0}
                        %
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <i className="size-2.5 rounded-full bg-[#0d719e]" />
                  New assets
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="size-2.5 rounded-full bg-[#f15825]" />
                  Requests
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="size-2.5 rounded-full bg-[#8b5cf6]" />
                  Purchases
                </span>
              </div>
              <div className="grid h-56 grid-cols-3 gap-2 sm:h-64 sm:grid-cols-6 lg:grid-cols-12">
                {monthly.map((m, i) => (
                  <div
                    key={`${m.label}-${i}`}
                    className="flex min-w-0 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex h-full w-full items-end justify-center gap-0.5 sm:gap-1">
                      {[
                        { v: m.assets, c: palette[0] },
                        { v: m.requests, c: palette[1] },
                        { v: m.purchases, c: palette[2] },
                      ].map((d, j) => (
                        <div
                          key={j}
                          title={`${d.v}`}
                          className={`w-[22%] max-w-4 rounded-t-sm transition-all duration-500 ${chartKind === "line" ? "rounded-full" : ""}`}
                          style={{
                            height: `${Math.max(3, (d.v / maxTrend) * 88)}%`,
                            backgroundColor: d.c,
                            opacity: chartKind === "line" ? 0.78 : 1,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 sm:text-[11px]">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-slate-400">
                Bars reflect records created in each month. Empty months show
                zero; analytics use the records returned by your API.
              </p>
            </div>
          )}
        </Panel>
        <Panel
          title="Asset status"
          subtitle="Current distribution across inventory states."
          action={
            <Link
              href="/admin/assets"
              className="text-xs font-semibold text-[#0d719e] hover:underline"
            >
              All assets
            </Link>
          }
        >
          <div className="space-y-5">
            {statusData.map((item) => {
              const pct = assets.length
                ? (item.value / assets.length) * 100
                : 0;
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-900">
                      {item.value}{" "}
                      <span className="font-normal text-slate-400">
                        ({Math.round(pct)}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-orange-100 p-2 text-orange-700">
                <Wrench className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Needs attention
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {pendingRequests} pending requests and {maintenance} assets
                  under maintenance.
                </p>
                <Link
                  href="/admin/asset-requests"
                  className="mt-2 inline-flex items-center text-xs font-semibold text-[#0d719e]"
                >
                  Review now <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Panel
          title="Quick actions"
          subtitle="Common admin tasks, one click away."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {navActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-sky-100 hover:bg-sky-50/60 sm:p-4"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${a.color}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {a.label}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {a.desc}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-slate-300 group-hover:text-[#0d719e]" />
                </Link>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Assignments",
                value: assignments.length,
                href: "/admin/asset-assignments",
                icon: Laptop,
              },
              {
                label: "Vendors",
                value: vendors.length,
                href: "/admin/vendors",
                icon: Building2,
              },
              {
                label: "Purchases",
                value: purchases.length,
                href: "/admin/asset-purchases",
                icon: CreditCard,
              },
              {
                label: "Audit logs",
                value: "View",
                href: "",
                icon: Activity,
              },
            ].map((x) => {
              const Icon = x.icon;
              return (
                <Link
                  key={x.label}
                  href={x.href}
                  className="rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
                >
                  <Icon className="mb-3 size-4 text-slate-500" />
                  <p className="text-lg font-bold text-slate-900">{x.value}</p>
                  <p className="text-xs text-slate-500">{x.label}</p>
                </Link>
              );
            })}
          </div>
        </Panel>
        <Panel
          title="Payment overview"
          subtitle="Purchase and payment totals returned by the system."
          action={
            <Link
              href="/admin/payments"
              className="text-xs font-semibold text-[#0d719e] hover:underline"
            >
              View payments
            </Link>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-medium text-emerald-800">
                Paid amount
              </p>
              <p className="mt-2 wrap-break-word text-xl font-bold text-emerald-950 sm:text-2xl">
                {money(paidTotal)}
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">
                Confirmed payments
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-4">
              <p className="text-xs font-medium text-orange-800">
                Purchase value
              </p>
              <p className="mt-2 wrap-break-word text-xl font-bold text-orange-950 sm:text-2xl">
                {money(purchaseSpend)}
              </p>
              <p className="mt-1 text-[11px] text-orange-700">
                All recorded purchases
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Paid transactions",
                value: payments.filter((p) => p.paymentStatus === "PAID")
                  .length,
                color: "bg-emerald-500",
              },
              {
                label: "Pending transactions",
                value: pendingPayments,
                color: "bg-amber-500",
              },
              {
                label: "Failed / cancelled",
                value: payments.filter((p) =>
                  ["FAILED", "CANCELLED"].includes(p.paymentStatus),
                ).length,
                color: "bg-rose-500",
              },
            ].map((x) => (
              <div
                key={x.label}
                className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`size-2 rounded-full ${x.color}`} />
                  {x.label}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {x.value}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <footer className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center">
        <p>
          <span className="font-semibold text-slate-700">NovoSoft</span> Asset
          Management · Admin workspace
        </p>
        <p className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          {loading
            ? "Refreshing live data…"
            : "Dashboard data loaded from connected APIs"}
        </p>
      </footer>
    </main>
  );
}
