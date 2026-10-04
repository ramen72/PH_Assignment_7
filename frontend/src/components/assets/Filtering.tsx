"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Asset } from "@/types";
import { useState } from "react";

interface AssetFiltersProps {
  assets: Asset[];

  searchTerm: string;
  categoryId: string;
  vendorId: string;
  status: string;
  condition: string;
  location: string;
  sort: string;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVendorChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortChange: (value: string) => void;

  onReset: () => void;
}

const AssetFilters = ({
  assets,

  searchTerm,
  categoryId,
  vendorId,
  status,
  condition,
  location,
  sort,

  onSearchChange,
  onCategoryChange,
  onVendorChange,
  onStatusChange,
  onConditionChange,
  onLocationChange,
  onSortChange,

  onReset,
}: AssetFiltersProps) => {
  /**
   * Dynamic Categories
   *
   * No hard-coded category.
   * If a new category comes from API,
   * it will automatically appear here.
   */
  const categories = Array.from(
    new Map(
      assets
        .filter((asset) => asset.category)
        .map((asset) => [
          asset.category.id,
          {
            id: asset.category.id,
            name: asset.category.name,
          },
        ]),
    ).values(),
  );

  /**
   * Dynamic Vendors
   */
  const vendors = Array.from(
    new Map(
      assets
        .filter((asset) => asset.vendor)
        .map((asset) => [
          asset.vendor.id,
          {
            id: asset.vendor.id,
            name: asset.vendor.name,
            companyName: asset.vendor.companyName,
          },
        ]),
    ).values(),
  );

  /**
   * Dynamic Statuses
   */
  const statuses = Array.from(
    new Set(
      assets
        .map((asset) => asset.status)
        .filter(Boolean),
    ),
  );

  /**
   * Dynamic Conditions
   */
  const conditions = Array.from(
    new Set(
      assets
        .map((asset) => asset.condition)
        .filter(Boolean),
    ),
  );

  /**
   * Dynamic Locations
   */
  const locations = Array.from(
    new Set(
      assets
        .map((asset) => asset.location)
        .filter(Boolean),
    ),
  );

  /**
   * Check whether any filter is active
   */
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    categoryId !== "all" ||
    vendorId !== "all" ||
    status !== "all" ||
    condition !== "all" ||
    location !== "all" ||
    sort !== "default";

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Asset Filters
        </h2>

        <p className="text-sm text-muted-foreground">
          Search and filter your assets
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by asset name, tag, brand, model or serial..."
          className="h-10 pl-9"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Category */}
        <Select
          value={categoryId}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Categories
            </SelectItem>

            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Vendor */}
        <Select
          value={vendorId}
          onValueChange={onVendorChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vendor" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Vendors
            </SelectItem>

            {vendors.map((vendor) => (
              <SelectItem
                key={vendor.id}
                value={vendor.id}
              >
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Status
            </SelectItem>

            {statuses.map((item) => (
              <SelectItem
                key={item}
                value={item}
              >
                {formatLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Condition */}
        <Select
          value={condition}
          onValueChange={onConditionChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Conditions
            </SelectItem>

            {conditions.map((item) => (
              <SelectItem
                key={item}
                value={item}
              >
                {formatLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select
          value={location}
          onValueChange={onLocationChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Location" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Locations
            </SelectItem>

            {locations.map((item) => (
              <SelectItem
                key={item}
                value={item}
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sort}
          onValueChange={onSortChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="default">
              Default
            </SelectItem>

            <SelectItem value="assetTag-asc">
              Asset Tag ↑
            </SelectItem>

            <SelectItem value="assetTag-desc">
              Asset Tag ↓
            </SelectItem>

            <SelectItem value="name-asc">
              Name A → Z
            </SelectItem>

            <SelectItem value="name-desc">
              Name Z → A
            </SelectItem>

            <SelectItem value="purchasePrice-asc">
              Price Low → High
            </SelectItem>

            <SelectItem value="purchasePrice-desc">
              Price High → Low
            </SelectItem>

            <SelectItem value="purchaseDate-newest">
              Purchase Date: Newest
            </SelectItem>

            <SelectItem value="purchaseDate-oldest">
              Purchase Date: Oldest
            </SelectItem>

            <SelectItem value="createdAt-newest">
              Created: Newest
            </SelectItem>

            <SelectItem value="createdAt-oldest">
              Created: Oldest
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <div className="flex justify-end border-t pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="size-4" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

/**
 * Converts:
 *
 * AVAILABLE -> Available
 * IN_REPAIR -> In Repair
 * VERY_GOOD -> Very Good
 */
const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
};

export default AssetFilters;