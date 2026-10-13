
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  Eye,
  Plus,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllAssetAssignments } from "@/hooks";
import type { AssetAssignment } from "@/types";


export default function AssetAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [returned, setReturned] = useState("active");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, refetch } =
    useGetAllAssetAssignments({
      searchTerm: search || undefined,
      returned:
        returned === "all"
          ? undefined
          : returned === "returned",
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const assignments = data?.data ?? [];
  
  const meta = data?.meta;
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Asset Assignments
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage assigned assets and employee returns.
          </p>
        </div>

        <Button nativeButton={false} render={
            <Link href="/admin/asset-assignments/new">
            <Plus className="mr-2 size-4" />
            New Assignment
          </Link>
        }>
          
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {meta?.total ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{page}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {meta?.totalPages ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search asset, tag, or employee..."
                className="pl-9"
              />
            </div>

            <Select
              value={returned}
              onValueChange={(value) => {
                if(!value) return
                setReturned(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Assignment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignments</SelectItem>
                <SelectItem value="active">Currently assigned</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-7 animate-spin" />
            </div>
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="text-sm text-destructive">
                Failed to load asset assignments.
              </p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : assignments.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-medium">No assignments found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Asset</th>
                    <th className="p-3 font-medium">Employee</th>
                    <th className="p-3 font-medium">Assigned By</th>
                    <th className="p-3 font-medium">Assigned At</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 text-right font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((assignment:AssetAssignment) => (
                    <tr
                      key={assignment.id}
                      className="border-t transition-colors hover:bg-muted/30"
                    >
                      <td className="p-3">
                        <p className="font-medium">
                          {assignment.asset.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.asset.assetTag}
                        </p>
                      </td>

                      <td className="p-3">
                        <p className="font-medium">
                          {assignment.employee.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {assignment.employee.email}
                        </p>
                      </td>

                      <td className="p-3">
                        {assignment.assignedBy.name}
                      </td>

                      <td className="p-3">
                        {assignment.assignedAt
                          ? new Date(
                              assignment.assignedAt,
                            ).toLocaleDateString("en-GB")
                          : "—"}
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            assignment.returnedAt
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {assignment.returnedAt
                            ? "Returned"
                            : "Assigned"}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title="View details"
                            nativeButton={false}
                            render={
                              <Link
                              href={`/admin/asset-assignments/${assignment.id}`}
                              className="flex"
                            >
                              <Eye className="size-4" />
                            </Link>
                            }
                          ></Button>
                          {!assignment.returnedAt && (
                            <Button
                              size="icon"
                              variant="outline"
                              title="Return asset"
                              nativeButton={false}
                              render={
                                <Link
                                href={`/admin/asset-assignments/${assignment.id}/return`}
                                className="flex"
                              >
                                <RotateCcw className="size-4" />
                              </Link>
                              }
                            ></Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              Page {meta?.page ?? page} of {meta?.totalPages ?? 0}
              {" · "}
              {meta?.total ?? 0} assignments
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={
                  isLoading ||
                  page >= (meta?.totalPages ?? 0)
                }
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
