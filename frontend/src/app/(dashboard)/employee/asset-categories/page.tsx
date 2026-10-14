"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Tags,
  Package,
  ClipboardList,
  Loader2,
} from "lucide-react";

import {
  useGetAllAssetCategories,
} from "@/hooks";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AssetCategoryResponse } from "@/types";


export default function AssetCategoriesPage() {

  const { data, isLoading, isError, error } =
    useGetAllAssetCategories();
  const [search, setSearch] = useState("");

  const response = data as AssetCategoryResponse | undefined;
  const categories = response?.data ?? [];

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        (category.description ?? "")
          .toLowerCase()
          .includes(term),
    );
  }, [categories, search]);

  const totalAssets = categories.reduce(
    (total, category) =>
      total + (category._count?.assets ?? 0),
    0,
  );

  const totalRequests = categories.reduce(
    (total, category) =>
      total + (category._count?.assetRequests ?? 0),
    0,
  );




  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tags className="size-6 text-[#f15825]" />
            <h1 className="text-2xl font-bold tracking-tight">
              Asset Categories
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and organize your company asset categories.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Categories
              </p>
              <p className="mt-2 text-2xl font-bold">
                {categories.length}
              </p>
            </div>
            <Tags className="size-8 text-[#0d719e]" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Associated Assets
              </p>
              <p className="mt-2 text-2xl font-bold">
                {totalAssets}
              </p>
            </div>
            <Package className="size-8 text-emerald-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Asset Requests
              </p>
              <p className="mt-2 text-2xl font-bold">
                {totalRequests}
              </p>
            </div>
            <ClipboardList className="size-8 text-amber-600" />
          </CardContent>
        </Card>
      </div>

      {/* Categories table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-7 animate-spin text-[#0d719e]" />
            </div>
          ) : isError ? (
            <div className="py-10 text-center">
              <p className="font-medium text-destructive">
                Failed to load categories
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Please try again later."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">
                      Assets
                    </TableHead>
                    <TableHead className="text-center">
                      Requests
                    </TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-muted-foreground"
                      >
                        {search
                          ? "No matching categories found."
                          : "No categories available. Add your first category."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0d719e]/10">
                              <Tags className="size-4 text-[#0d719e]" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {category.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {category.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm text-muted-foreground">
                            {category.description || "—"}
                          </p>
                        </TableCell>

                        <TableCell className="text-center">
                          {category._count?.assets ?? 0}
                        </TableCell>

                        <TableCell className="text-center">
                          {category._count?.assetRequests ?? 0}
                        </TableCell>

                        <TableCell className="text-right">
                          {new Date(
                            category.createdAt,
                          ).toLocaleDateString("en-GB")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && !isError && (
            <p className="mt-4 text-sm text-muted-foreground">
              Showing {filteredCategories.length} of{" "}
              {categories.length} categories
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
