
"use client";

import { useGetMe } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfilePage() {
  const { data, isPending, isError, error, refetch, isFetching } = useGetMe();

  const user = data?.data;

  if (isPending) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-3 p-6">
        <AlertCircle className="size-6 text-destructive" />

        <h1 className="text-xl font-semibold">
          Unable to load profile
        </h1>

        <p className="text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Please sign in again if your session has expired."}
        </p>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Retry
        </Button>
      </div>
    );
  }

  const fields = [
    { label: "Full Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Department", value: user.department },
    { label: "Designation", value: user.designation },
    { label: "Role", value: user.role },
    { label: "Status", value: user.status },
  ];

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          View your account information.
        </p>
      </div>

      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          {user.profileImage ? (
            <Image
            width={30}
            height={30}
              src={user.profileImage}
              alt={user.name}
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <UserRound className="size-9 text-muted-foreground" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user.designation || user.role}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">
            Personal Information
          </h2>
        </div>

        <dl className="grid gap-5 p-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1">
              <dt className="text-sm text-muted-foreground">
                {field.label}
              </dt>
              <dd className="wrap-break-word text-sm font-medium">
                {field.value || "Not provided"}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
