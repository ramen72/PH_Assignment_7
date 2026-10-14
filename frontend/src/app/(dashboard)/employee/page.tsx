"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Laptop,
  Package,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useGetMe, useGetMyAssetRequests } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AssetRequestResponse } from "@/types";

const COLORS = {
  pending: "#F59E0B",
  approved: "#0D719E",
  rejected: "#EF4444",
  cancelled: "#94A3B8",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export default function EmployeeDashboardPage() {
  const {
    data: profileResponse,
    isPending: profilePending,
    isError: profileError,
    refetch: refetchProfile,
  } = useGetMe();

  const {
    data: requestResponse,
    isPending: requestsPending,
    isError: requestsError,
    refetch: refetchRequests,
    isFetching,
  } = useGetMyAssetRequests({ page: 1, limit: 100 });

  const profile = profileResponse?.data;

  // Adjust this line if your API wraps pagination differently.
  const rawData = requestResponse?.data;
  const requests:AssetRequestResponse[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
      ? rawData.data
      : [];

  const pending = requests.filter(
    (item) => item.status === "PENDING",
  ).length;

  const approved = requests.filter(
    (item) => item.status === "APPROVED",
  ).length;

  const rejected = requests.filter(
    (item) => item.status === "REJECTED",
  ).length;

  const cancelled = requests.filter(
    (item) => item.status === "CANCELLED",
  ).length;

  const statusData = [
    { name: "Pending", value: pending, fill: COLORS.pending },
    { name: "Approved", value: approved, fill: COLORS.approved },
    { name: "Rejected", value: rejected, fill: COLORS.rejected },
    { name: "Cancelled", value: cancelled, fill: COLORS.cancelled },
  ].filter((item) => item.value > 0);

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));

    const monthRequests = requests.filter((request) => {
      const created = new Date(request.createdAt);

      return (
        created.getMonth() === date.getMonth() &&
        created.getFullYear() === date.getFullYear()
      );
    });

    return {
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      requests: monthRequests.length,
    };
  });

  const stats = [
    {
      label: "Total requests",
      value: requests.length,
      icon: Package,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Pending requests",
      value: pending,
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Approved requests",
      value: approved,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Rejected requests",
      value: rejected,
      icon: XCircle,
      color: "bg-red-50 text-red-700",
    },
  ];

  if (profilePending || requestsPending) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Skeleton
              key={stat.label}
              className="h-32 rounded-2xl"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (profileError || requestsError) {
    return (
      <div className="space-y-3 p-6">
        <h2 className="text-xl font-semibold">
          Unable to load your dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Please check your connection and try again.
        </p>
        <Button
          onClick={() => {
            void refetchProfile();
            void refetchRequests();
          }}
        >
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 sm:p-5 lg:p-6">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0d719e] to-[#145b83] p-6 text-white sm:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/75">
              NovoSoft Asset Management
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome back, {profile?.name || "Employee"}!
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Track your asset requests, review their status, and
              manage your workplace equipment from one place.
            </p>
          </div>

          <Button
            className="w-fit bg-[#f15825] text-white hover:bg-[#dc4819]"
            nativeButton={false}
            render={
              <Link href="/employee/asset-requests/create">
              <Plus className="mr-2 size-4" />
              Request an asset
            </Link>
            }
          ></Button>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-20 size-64 rounded-full border-8 border-white/10" />
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="rounded-2xl border-0 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="size-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Charts */}
      <section className="grid gap-6 xl:grid-cols-5">
        <Card className="rounded-2xl xl:col-span-3">
          <CardHeader>
            <CardTitle>Request activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Asset requests created over the last six months
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="requestFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#0d719e"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#0d719e"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis dataKey="month" tickLine={false} />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stroke="#0d719e"
                    strokeWidth={3}
                    fill="url(#requestFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl xl:col-span-2">
          <CardHeader>
            <CardTitle>Request status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Distribution of your asset requests
            </p>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <Package className="mb-3 size-10 text-muted-foreground" />
                <p className="font-medium">No requests yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first asset request to see statistics.
                </p>
              </div>
            ) : (
              <>
                <div className="h-55">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {statusData.map((item) => (
                          <Cell
                            key={item.name}
                            fill={item.fill}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {statusData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        {item.name}
                      </span>
                      <span className="font-semibold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Recent requests */}
      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Recent asset requests</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of your latest submissions
            </p>
          </div>
          <Button variant="outline" size="sm" nativeButton={false} render={
            <Link href="/employee/asset-requests">
              View all <ArrowRight className="ml-2 size-4" />
            </Link>
          }></Button>
        </CardHeader>

        <CardContent>
          {requests.length === 0 ? (
            <div className="py-10 text-center">
              <Laptop className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="font-medium">No asset requests found</p>
              <Button variant="link" nativeButton={false} render={
                <Link href="/employee/asset-requests/create">
                  Submit your first request
                </Link>
              }></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...requests]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 5)
                .map((request) => {
                  const statusStyle: Record<string, string> = {
                    PENDING:
                      "bg-amber-100 text-amber-800",
                    APPROVED:
                      "bg-emerald-100 text-emerald-800",
                    REJECTED:
                      "bg-red-100 text-red-800",
                    CANCELLED:
                      "bg-slate-100 text-slate-700",
                  };

                  return (
                    <Link
                      key={request.id}
                      href={`/employee/asset-requests/${request.id}`}
                      className="flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {request.category?.name ||
                            "Asset request"}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {request.reason}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(request.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyle[request.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {request.status}
                      </span>
                    </Link>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {isFetching && (
        <p className="text-right text-xs text-muted-foreground">
          Updating dashboard...
        </p>
      )}
    </div>
  );
}