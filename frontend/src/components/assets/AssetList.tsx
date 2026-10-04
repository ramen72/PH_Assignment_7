"use client";

import { useMemo, useState } from "react";

import type { Asset } from "@/types";
import { useGetAllAssets } from "@/hooks";

import AssetFilters from "./AssetFilters";
// import AssetTable from "./AssetsTable";
import useDebounce from "@/hooks/debounce.hook";
import AssetsTable from "./AssetTable";

const AssetList = () => {
  
  // API DATA
  const { data, isLoading, isError } = useGetAllAssets();

  /**
   * Adjust this according to your API response.
   *
   * If useGetAllAssets() directly returns Asset[],
   * this will work as-is.
   *
   * If it returns { data: Asset[] }, then change to:
   * const assets = data?.data ?? [];
   */
  const assets: Asset[] = data?.data ?? [];

  
  // FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [vendorId, setVendorId] = useState("all");
  const [status, setStatus] = useState("all");
  const [condition, setCondition] = useState("all");
  const [location, setLocation] = useState("all");
  
  // SORT STATES
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // PAGINATION  
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  
  // DEBOUNCED SEARCH
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // DYNAMIC FILTER OPTIONS
  /**
   * These options are generated from the API data.
   *
   * So if tomorrow you add:
   *
   * - new category
   * - new vendor
   * - new status
   * - new condition
   * - new location
   *
   * you don't need to change this component.
   */

  const filterOptions = useMemo(() => {
    const categories = new Map<string, string>();
    const vendors = new Map<string, string>();
    const statuses = new Set<string>();
    const conditions = new Set<string>();
    const locations = new Set<string>();

    assets.forEach((asset) => {
      // Category
      if (asset.category?.id && asset.category?.name) {
        categories.set(asset.category.id, asset.category.name);
      }

      // Vendor
      if (asset.vendor?.id && asset.vendor?.name) {
        vendors.set(asset.vendor.id, asset.vendor.name);
      }

      // Status
      if (asset.status) {
        statuses.add(asset.status);
      }

      // Condition
      if (asset.condition) {
        conditions.add(asset.condition);
      }

      // Location
      if (asset.location) {
        locations.add(asset.location);
      }
    });

    return {
      categories: Array.from(categories.entries()).map(([id, name]) => ({
        id,
        name,
      })),

      vendors: Array.from(vendors.entries()).map(([id, name]) => ({
        id,
        name,
      })),

      statuses: Array.from(statuses).sort(),

      conditions: Array.from(conditions).sort(),

      locations: Array.from(locations).sort(),
    };
  }, [assets]);

  
  // FILTER + SEARCH
  

  const filteredAssets = useMemo(() => {
    const search = debouncedSearchTerm.trim().toLowerCase();

    return assets.filter((asset) => {
      
      // SEARCH
      const matchesSearch =
        !search ||
        asset.name?.toLowerCase().includes(search) ||
        asset.assetTag?.toLowerCase().includes(search) ||
        asset.brand?.toLowerCase().includes(search) ||
        asset.model?.toLowerCase().includes(search) ||
        asset.serialNumber?.toLowerCase().includes(search) ||
        asset.category?.name?.toLowerCase().includes(search) ||
        asset.vendor?.name?.toLowerCase().includes(search) ||
        asset.location?.toLowerCase().includes(search);

      
      // CATEGORY
      const matchesCategory =
        categoryId === "all" || asset.categoryId === categoryId;

      
      // VENDOR
      const matchesVendor = vendorId === "all" || asset.vendorId === vendorId;
      
      // STATUS
      const matchesStatus = status === "all" || asset.status === status;
      
      // CONDITION
      const matchesCondition =
        condition === "all" || asset.condition === condition;
      
      // LOCATION
      const matchesLocation = location === "all" || asset.location === location;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesVendor &&
        matchesStatus &&
        matchesCondition &&
        matchesLocation
      );
    });
  }, [
    assets,
    debouncedSearchTerm,
    categoryId,
    vendorId,
    status,
    condition,
    location,
  ]);

  
  // SORT
  const sortedAssets = useMemo(() => {
    const result = [...filteredAssets];

    result.sort((a, b) => {
      let valueA: string | number = "";
      let valueB: string | number = "";

      switch (sortBy) {
        case "assetTag":
          valueA = a.assetTag ?? "";
          valueB = b.assetTag ?? "";
          break;

        case "name":
          valueA = a.name ?? "";
          valueB = b.name ?? "";
          break;

        case "brand":
          valueA = a.brand ?? "";
          valueB = b.brand ?? "";
          break;

        case "model":
          valueA = a.model ?? "";
          valueB = b.model ?? "";
          break;

        case "purchasePrice":
          valueA = Number(a.purchasePrice ?? 0);
          valueB = Number(b.purchasePrice ?? 0);
          break;

        case "purchaseDate":
          valueA = new Date(a.purchaseDate).getTime();
          valueB = new Date(b.purchaseDate).getTime();
          break;

        case "createdAt":
        default:
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      return sortOrder === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    return result;
  }, [filteredAssets, sortBy, sortOrder]);

  
  // RESET PAGE WHEN FILTER CHANGES
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setCurrentPage(1);
  };

  const handleVendorChange = (value: string) => {
    setVendorId(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleConditionChange = (value: string) => {
    setCondition(value);
    setCurrentPage(1);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setCurrentPage(1);
  };
  const handleSortByChange = (value: string) => {
    setSortBy(value as SortField);
    setCurrentPage(1);
  };
  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  
  // RESET FILTERS
  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryId("all");
    setVendorId("all");
    setStatus("all");
    setCondition("all");
    setLocation("all");

    setSortBy("createdAt");
    setSortOrder("desc");

    setCurrentPage(1);
  };

  
  // PAGINATION
  const totalItems = sortedAssets.length;
  console.log(totalItems)

  const totalPages = Math.ceil(totalItems / itemsPerPage);
console.log(totalPages)
  /**
   * Make sure current page never becomes invalid
   * after filtering.
   */
  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAssets = sortedAssets.slice(startIndex, endIndex);
  
  // PAGINATION HANDLERS
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  
  // SORT HANDLER
  //   const handleSortChange = (value: string) => {
  //     /**
  //      * If clicking the same sort field,
  //      * toggle asc/desc.
  //      */
  //     if (sortBy === value) {
  //       setSortOrder((previous) =>
  //         previous === "asc" ? "desc" : "asc",
  //       );
  //     } else {
  //       setSortBy(value);
  //       setSortOrder("asc");
  //     }

  //     setCurrentPage(1);
  //   };
  type SortField =
    | "assetTag"
    | "name"
    | "brand"
    | "model"
    | "purchasePrice"
    | "purchaseDate"
    | "createdAt";

  const handleSortChange = (value: SortField) => {
    if (sortBy === value) {
      setSortOrder((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }

    setCurrentPage(1);
  };

  
  // LOADING
  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading assets...</div>
      </div>
    );
  }
  
  // ERROR
  if (isError) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-4 text-sm text-destructive">
          Failed to load assets.
        </div>
      </div>
    );
  }

    // UI
  return (
    <div className="space-y-5">
      
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
        <p className="text-sm text-muted-foreground">
          Manage, search and filter all company assets.
        </p>
      </div>
      
      {/* FILTERS */}
      <AssetFilters
        assets={assets}
        searchTerm={searchTerm}
        categoryId={categoryId}
        vendorId={vendorId}
        status={status}
        condition={condition}
        location={location}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onVendorChange={handleVendorChange}
        onStatusChange={handleStatusChange}
        onConditionChange={handleConditionChange}
        onLocationChange={handleLocationChange}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onReset={handleResetFilters}
      />

      
      {/* TABLE */}
      <AssetsTable
        assets={paginatedAssets}
        totalItems={totalItems}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={handlePageChange}
        onSort={handleSortChange}
      />
    </div>
  );
};

export default AssetList;
