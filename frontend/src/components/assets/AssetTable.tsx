"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Asset } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field, FieldLabel } from "../ui/field";

type SortField =
  | "assetTag"
  | "name"
  | "brand"
  | "model"
  | "purchasePrice"
  | "purchaseDate"
  | "createdAt";

interface AssetTableProps {
  assets: Asset[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;

  sortBy: SortField;
  sortOrder: "asc" | "desc";

  onPageChange: (page: number) => void;
  onSort: (field: SortField) => void;
  handleItemsPerPageChange: (field: SortField) => void;
}

const AssetsTable = ({
  assets,
  totalItems,
  currentPage,
  totalPages,
  itemsPerPage,
  sortBy,
  sortOrder,
  onPageChange,
  onSort,
  handleItemsPerPageChange,
}: AssetTableProps) => {

  // SORT ICON
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) {
      return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />;
    }

    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    );
  };


  // BADGE HELPERS
  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "available") {
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-emerald-700"
        >
          {status}
        </Badge>
      );
    }

    if (normalized === "assigned") {
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700"
        >
          {status}
        </Badge>
      );
    }

    if (normalized === "maintenance" || normalized === "under_maintenance") {
      return (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-amber-700"
        >
          {status.replaceAll("_", " ")}
        </Badge>
      );
    }

    if (normalized === "retired" || normalized === "disposed") {
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700"
        >
          {status}
        </Badge>
      );
    }

    return <Badge variant="outline">{status.replaceAll("_", " ")}</Badge>;
  };

  const getConditionBadge = (condition: string) => {
    const normalized = condition.toLowerCase();

    if (normalized === "new") {
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-emerald-700"
        >
          {condition}
        </Badge>
      );
    }

    if (normalized === "good") {
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700"
        >
          {condition}
        </Badge>
      );
    }

    if (normalized === "fair") {
      return (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-amber-700"
        >
          {condition}
        </Badge>
      );
    }

    if (normalized === "poor") {
      return (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-red-700"
        >
          {condition}
        </Badge>
      );
    }
    return <Badge variant="outline">{condition}</Badge>;
  };


  // FORMAT HELPERS
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(price));
  };


  // PAGINATION INFO
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + assets.length, totalItems);


  // UI
  return (
    <div className="space-y-4">
      {/* SUMMARY */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Assets</h2>
          {totalItems > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startIndex + 1}
            </span>{" "}
            to <span className="font-medium text-foreground">{endIndex}</span>{" "}
            of <span className="font-medium text-foreground">{totalItems}</span>
          </p>
        </div>
      )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="min-w-55">
                  <button
                    type="button"
                    onClick={() => onSort("name")}
                    className="flex items-center font-semibold"
                  >
                    Asset
                    <SortIcon field="name" />
                  </button>
                </TableHead>

                <TableHead className="min-w-32.5">
                  <button
                    type="button"
                    onClick={() => onSort("assetTag")}
                    className="flex items-center font-semibold"
                  >
                    Asset Tag
                    <SortIcon field="assetTag" />
                  </button>
                </TableHead>

                <TableHead className="min-w-32.5">Category</TableHead>
                <TableHead className="min-w-47.5">
                  <button
                    type="button"
                    onClick={() => onSort("brand")}
                    className="flex items-center font-semibold"
                  >
                    Brand / Model
                    <SortIcon field="brand" />
                  </button>
                </TableHead>

                <TableHead className="min-w-37.5">Serial Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">
                  <button
                    type="button"
                    onClick={() => onSort("purchasePrice")}
                    className="ml-auto flex items-center font-semibold"
                  >
                    Price
                    <SortIcon field="purchasePrice" />
                  </button>
                </TableHead>

                <TableHead className="min-w-32.5">
                  <button
                    type="button"
                    onClick={() => onSort("purchaseDate")}
                    className="flex items-center font-semibold"
                  >
                    Purchase Date
                    <SortIcon field="purchaseDate" />
                  </button>
                </TableHead>

                <TableHead className="w-15" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <TableRow
                    key={asset.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    {/* ASSET */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                          {asset.imageUrl ? (
                            <Image
                              src={asset.imageUrl}
                              alt={asset.name || "Asset"}
                              loading="eager"
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-muted-foreground">
                              {asset.name?.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">{asset.name}</p>

                          <p className="truncate text-xs text-muted-foreground">
                            {asset.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* TAG */}
                    <TableCell>
                      <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-medium">
                        {asset.assetTag}
                      </span>
                    </TableCell>

                    {/* CATEGORY */}
                    <TableCell>{asset.category?.name || "—"}</TableCell>

                    {/* BRAND / MODEL */}
                    <TableCell>
                      <p className="font-medium">{asset.brand || "—"}</p>

                      <p className="text-xs text-muted-foreground">
                        {asset.model || "—"}
                      </p>
                    </TableCell>

                    {/* SERIAL */}
                    <TableCell>
                      <span className="font-mono text-xs">
                        {asset.serialNumber || "—"}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>

                    {/* CONDITION */}
                    <TableCell>{getConditionBadge(asset.condition)}</TableCell>

                    {/* LOCATION */}
                    <TableCell>{asset.location || "—"}</TableCell>

                    {/* PRICE */}
                    <TableCell className="text-right">
                      <span className="font-medium">
                        ৳ {formatPrice(asset.purchasePrice)}
                      </span>
                    </TableCell>

                    {/* DATE */}
                    <TableCell>{formatDate(asset.purchaseDate)}</TableCell>

                    {/* ACTION */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-medium">No assets found</p>
                      <p className="text-sm text-muted-foreground">
                        Try changing your search or filter criteria.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalItems > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {startIndex + 1}
            </span>{" "}
            to <span className="font-medium text-foreground">{endIndex}</span>{" "}
            of <span className="font-medium text-foreground">{totalItems}</span>
          </p>

          <div className="flex justify-end items-center gap-x-5">
            <div>
              <Field orientation="horizontal" className="w-fit">
                <FieldLabel htmlFor="select-rows-per-page">
                  Rows per page
                </FieldLabel>

                <Select
                  value={String(itemsPerPage)}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-20" id="select-rows-per-page">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent align="start">
                    <SelectGroup>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;

                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, pages) => {
                  const previousPage = pages[index - 1];

                  const showEllipsis = previousPage && page - previousPage > 1;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && (
                        <span className="px-1 text-muted-foreground">...</span>
                      )}

                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsTable;
