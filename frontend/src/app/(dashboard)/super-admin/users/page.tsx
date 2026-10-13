// const UsersPage = () => {
//     return (
//         <div>
//             <h1>Users Page</h1>
//         </div>
//     );
// };

// export default UsersPage;


"use client";

// import { useGetAllUsers } from "@/services/auth/auth.hook";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllUsers } from "@/hooks";
import type { User } from "@/types";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function UsersPage() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllUsers();

  if (isPending) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-3 w-48" />
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={`user-row-${index}`}
            className="h-14 w-full rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3 p-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <h2 className="font-semibold">
            Failed to load users
          </h2>
        </div>

        <p className="text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Please try again."}
        </p>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Change this according to your API response structure.
  const users = data?.data ?? [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage users in NovoSoft Asset Management.
        </p>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <p className="text-sm text-muted-foreground">
            Total users: {users.length}
          </p>
        </div>

        {users.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No users found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user:User) => (
                  <tr
                    key={user.id}
                    className="border-t transition-colors hover:bg-muted/30"
                  >
                    <td className="p-4 font-medium">
                      {user.name}
                    </td>
                    <td className="p-4">
                      {user.email}
                    </td>
                    <td className="p-4">
                      {user.role}
                    </td>
                    <td className="p-4">
                      {user.department || "—"}
                    </td>
                    <td className="p-4">
                      {user.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
