"use client";

import { useMemo, useState } from "react";

import type { Asset } from "@/types";
import { useGetAllAssets } from "@/hooks";

import AssetFilters from "./AssetFilters";
import useDebounce from "@/hooks/debounce.hook";
import AssetsTable from "./AssetTable";
import AssetDetailsDialog from "./AssetDetailsDialog";
import EditAssetDialog from "./EditAssetDialog";

const AssetList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [categoryId, setCategoryId] = useState("all");
  const [vendorId, setVendorId] = useState("all");
  const [status, setStatus] = useState("all");
  const [condition, setCondition] = useState("all");
  const [location, setLocation] = useState("all");

  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError } = useGetAllAssets({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: debouncedSearchTerm || undefined,
    categoryId: categoryId !== "all" ? categoryId : undefined,
    vendorId: vendorId !== "all" ? vendorId : undefined,
    status: status !== "all" ? status : undefined,
    condition: condition !== "all" ? condition : undefined,
    location: location !== "all" ? location : undefined,
    sortBy,
    sortOrder,
  });
 
  const assets: Asset[] = data?.data ?? [];

  const totalItems = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 0;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
  };

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
  // Items per page change
  const handleItemsPerPageChange = (value: string | null) => {
    if(!value) return
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };
  const handleViewAsset= (asset:Asset)=>{
    setSelectedItemId(asset.id)
  }
  const handleEditAsset = (asset: Asset) => {
  setSelectedAssetId(asset.id);
  setEditDialogOpen(true);
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
        assets={assets}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={handlePageChange}
        onSort={handleSortChange}
        handleItemsPerPageChange={handleItemsPerPageChange}
        handleViewAsset={handleViewAsset}
        handleEditAsset= {handleEditAsset}
        
      />

      {/* ASSET DETAILS DIALOG */}
      <AssetDetailsDialog
        assetId={selectedItemId}
        open={Boolean(selectedItemId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItemId("");
          }
        }}
      />

      <EditAssetDialog
        assetId={selectedAssetId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};

export default AssetList;
