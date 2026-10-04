// "use client";

// import { Search, X, SlidersHorizontal } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import type { Asset } from "@/types";

// interface AssetFiltersProps {
//   assets: Asset[];

//   searchTerm: string;
//   categoryId: string;
//   vendorId: string;
//   status: string;
//   condition: string;
//   location: string;
//   sortBy: string;
//   sortOrder: "asc" | "desc";

//   onSearchChange: (value: string) => void;
//   onCategoryChange: (value: string) => void;
//   onVendorChange: (value: string) => void;
//   onStatusChange: (value: string) => void;
//   onConditionChange: (value: string) => void;
//   onLocationChange: (value: string) => void;
//   onSortByChange: (value: string) => void;
//   onSortOrderChange: (value: "asc" | "desc") => void;

//   onReset: () => void;
// }

// const AssetFilters = ({
//   assets,

//   searchTerm,
//   categoryId,
//   vendorId,
//   status,
//   condition,
//   location,
//   sortBy,
//   sortOrder,

//   onSearchChange,
//   onCategoryChange,
//   onVendorChange,
//   onStatusChange,
//   onConditionChange,
//   onLocationChange,
//   onSortByChange,
//   onSortOrderChange,

//   onReset,
// }: AssetFiltersProps) => {
//   /**
//    * -----------------------------------------
//    * Dynamic Categories
//    * -----------------------------------------
//    */
//   const categories = Array.from(
//     new Map(
//       assets
//         .filter((asset) => asset.category)
//         .map((asset) => [
//           asset.category!.id,
//           {
//             id: asset.category!.id,
//             name: asset.category!.name,
//           },
//         ]),
//     ).values(),
//   );

//   /**
//    * -----------------------------------------
//    * Dynamic Vendors
//    * -----------------------------------------
//    */
//   const vendors = Array.from(
//     new Map(
//       assets
//         .filter((asset) => asset.vendor)
//         .map((asset) => [
//           asset.vendor!.id,
//           {
//             id: asset.vendor!.id,
//             name: asset.vendor!.name,
//           },
//         ]),
//     ).values(),
//   );

//   /**
//    * -----------------------------------------
//    * Dynamic Status
//    * -----------------------------------------
//    */
//   const statuses = Array.from(
//     new Set(
//       assets
//         .map((asset) => asset.status)
//         .filter(Boolean),
//     ),
//   );

//   /**
//    * -----------------------------------------
//    * Dynamic Conditions
//    * -----------------------------------------
//    */
//   const conditions = Array.from(
//     new Set(
//       assets
//         .map((asset) => asset.condition)
//         .filter(Boolean),
//     ),
//   );

//   /**
//    * -----------------------------------------
//    * Dynamic Locations
//    * -----------------------------------------
//    */
//   const locations = Array.from(
//     new Set(
//       assets
//         .map((asset) => asset.location)
//         .filter(Boolean),
//     ),
//   );

//   /**
//    * -----------------------------------------
//    * Check whether any filter is active
//    * -----------------------------------------
//    */
//   const hasActiveFilters =
//     Boolean(searchTerm) ||
//     Boolean(categoryId) ||
//     Boolean(vendorId) ||
//     Boolean(status) ||
//     Boolean(condition) ||
//     Boolean(location) ||
//     Boolean(sortBy);

//   return (
//     <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
//       {/* Header */}
//       <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-2">
//           <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
//             <SlidersHorizontal className="size-4 text-primary" />
//           </div>

//           <div>
//             <h2 className="text-sm font-semibold">
//               Asset Filters
//             </h2>

//             <p className="text-xs text-muted-foreground">
//               Search and filter your assets
//             </p>
//           </div>
//         </div>

//         {hasActiveFilters && (
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             onClick={onReset}
//             className="w-fit text-muted-foreground hover:text-destructive"
//           >
//             <X className="mr-1.5 size-4" />
//             Reset filters
//           </Button>
//         )}
//       </div>

//       {/* Filters */}
//       <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {/* Search */}
//         <div className="relative md:col-span-2 lg:col-span-2 xl:col-span-2">
//           <Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

//           <Input
//             value={searchTerm}
//             onChange={(event) =>
//               onSearchChange(event.target.value)
//             }
//             placeholder="Search by name, asset tag, brand, model..."
//             className="pl-9"
//           />
//         </div>

//         {/* Category */}
//         <Select
//           value={categoryId || "all"}
//           onValueChange={(value) =>
//             onCategoryChange(value === "all" ? "" : value)
//           }
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Category" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="all">
//               All Categories
//             </SelectItem>

//             {categories.map((category) => (
//               <SelectItem
//                 key={category.id}
//                 value={category.id}
//               >
//                 {category.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Vendor */}
//         <Select
//           value={vendorId || "all"}
//           onValueChange={(value) =>
//             onVendorChange(value === "all" ? "" : value)
//           }
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Vendor" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="all">
//               All Vendors
//             </SelectItem>

//             {vendors.map((vendor) => (
//               <SelectItem
//                 key={vendor.id}
//                 value={vendor.id}
//               >
//                 {vendor.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Status */}
//         <Select
//           value={status || "all"}
//           onValueChange={(value) =>
//             onStatusChange(value === "all" ? "" : value)
//           }
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Status" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="all">
//               All Status
//             </SelectItem>

//             {statuses.map((item) => (
//               <SelectItem
//                 key={item}
//                 value={item}
//               >
//                 {formatLabel(item)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Condition */}
//         <Select
//           value={condition || "all"}
//           onValueChange={(value) =>
//             onConditionChange(value === "all" ? "" : value)
//           }
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Condition" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="all">
//               All Conditions
//             </SelectItem>

//             {conditions.map((item) => (
//               <SelectItem
//                 key={item}
//                 value={item}
//               >
//                 {formatLabel(item)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Location */}
//         <Select
//           value={location || "all"}
//           onValueChange={(value) =>
//             onLocationChange(value === "all" ? "" : value)
//           }
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Location" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="all">
//               All Locations
//             </SelectItem>

//             {locations.map((item) => (
//               <SelectItem
//                 key={item}
//                 value={item}
//               >
//                 {item}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {/* Sort By */}
//         <Select
//           value={sortBy || "createdAt"}
//           onValueChange={onSortByChange}
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Sort by" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="createdAt">
//               Created Date
//             </SelectItem>

//             <SelectItem value="updatedAt">
//               Updated Date
//             </SelectItem>

//             <SelectItem value="assetTag">
//               Asset Tag
//             </SelectItem>

//             <SelectItem value="name">
//               Name
//             </SelectItem>

//             <SelectItem value="purchasePrice">
//               Purchase Price
//             </SelectItem>

//             <SelectItem value="purchaseDate">
//               Purchase Date
//             </SelectItem>

//             <SelectItem value="warrantyExpiry">
//               Warranty Expiry
//             </SelectItem>
//           </SelectContent>
//         </Select>

//         {/* Sort Order */}
//         <Select
//           value={sortOrder}
//           onValueChange={(value) =>
//             onSortOrderChange(value as "asc" | "desc")
//           }
//         >
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Order" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="asc">
//               ↑ Ascending
//             </SelectItem>

//             <SelectItem value="desc">
//               ↓ Descending
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Active filters summary */}
//       {hasActiveFilters && (
//         <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
//           <span className="text-xs font-medium text-muted-foreground">
//             Active filters:
//           </span>

//           {searchTerm && (
//             <FilterBadge
//               label={`Search: ${searchTerm}`}
//             />
//           )}

//           {categoryId && (
//             <FilterBadge
//               label={
//                 `Category: ${
//                   categories.find(
//                     (category) =>
//                       category.id === categoryId,
//                   )?.name ?? categoryId
//                 }`
//               }
//             />
//           )}

//           {vendorId && (
//             <FilterBadge
//               label={
//                 `Vendor: ${
//                   vendors.find(
//                     (vendor) =>
//                       vendor.id === vendorId,
//                   )?.name ?? vendorId
//                 }`
//               }
//             />
//           )}

//           {status && (
//             <FilterBadge
//               label={`Status: ${formatLabel(status)}`}
//             />
//           )}

//           {condition && (
//             <FilterBadge
//               label={`Condition: ${formatLabel(condition)}`}
//             />
//           )}

//           {location && (
//             <FilterBadge
//               label={`Location: ${location}`}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// /**
//  * -----------------------------------------
//  * Helper Components
//  * -----------------------------------------
//  */

// const FilterBadge = ({
//   label,
// }: {
//   label: string;
// }) => {
//   return (
//     <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
//       {label}
//     </span>
//   );
// };

// /**
//  * -----------------------------------------
//  * Format enum values
//  *
//  * NEW        -> New
//  * AVAILABLE  -> Available
//  * IN_REPAIR  -> In Repair
//  * -----------------------------------------
//  */
// const formatLabel = (value: string) => {
//   return value
//     .toLowerCase()
//     .split("_")
//     .map(
//       (word) =>
//         word.charAt(0).toUpperCase() + word.slice(1),
//     )
//     .join(" ");
// };

// export default AssetFilters;

// ==========================================================================================

"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";

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

interface AssetFiltersProps {
  assets: Asset[];

  searchTerm: string;
  categoryId: string;
  vendorId: string;
  status: string;
  condition: string;
  location: string;
  sortBy: string;
  sortOrder: "asc" | "desc";

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onVendorChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;

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
  sortBy,
  sortOrder,

  onSearchChange,
  onCategoryChange,
  onVendorChange,
  onStatusChange,
  onConditionChange,
  onLocationChange,
  onSortByChange,
  onSortOrderChange,

  onReset,
}: AssetFiltersProps) => {
  // --------------------------------------------------
  // DYNAMIC CATEGORIES
  // --------------------------------------------------

  const categories = Array.from(
    new Map(
      assets
        .filter((asset) => asset.category)
        .map((asset) => [
          asset.category!.id,
          {
            id: asset.category!.id,
            name: asset.category!.name,
          },
        ]),
    ).values(),
  );

  // --------------------------------------------------
  // DYNAMIC VENDORS
  // --------------------------------------------------

  const vendors = Array.from(
    new Map(
      assets
        .filter((asset) => asset.vendor)
        .map((asset) => [
          asset.vendor!.id,
          {
            id: asset.vendor!.id,
            name: asset.vendor!.name,
          },
        ]),
    ).values(),
  );

  // --------------------------------------------------
  // DYNAMIC STATUS
  // --------------------------------------------------

  const statuses = Array.from(
    new Set(
      assets
        .map((asset) => asset.status)
        .filter(Boolean),
    ),
  );

  // --------------------------------------------------
  // DYNAMIC CONDITIONS
  // --------------------------------------------------

  const conditions = Array.from(
    new Set(
      assets
        .map((asset) => asset.condition)
        .filter(Boolean),
    ),
  );

  // --------------------------------------------------
  // DYNAMIC LOCATIONS
  // --------------------------------------------------

  const locations = Array.from(
    new Set(
      assets
        .map((asset) => asset.location)
        .filter(Boolean),
    ),
  );

  // --------------------------------------------------
  // CHECK ACTIVE FILTERS
  // --------------------------------------------------

  const hasActiveFilters =
    Boolean(searchTerm) ||
    categoryId !== "all" ||
    vendorId !== "all" ||
    status !== "all" ||
    condition !== "all" ||
    location !== "all";

  return (
    <div className="mb-6 rounded-xl border bg-card p-4 shadow-sm">
      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <SlidersHorizontal className="size-4 text-primary" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">
              Asset Filters
            </h2>

            <p className="text-xs text-muted-foreground">
              Search and filter your assets
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="w-fit text-muted-foreground hover:text-destructive"
          >
            <X className="mr-1.5 size-4" />
            Reset filters
          </Button>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* FILTERS */}
      {/* ------------------------------------------------ */}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* ------------------------------------------------ */}
        {/* SEARCH */}
        {/* ------------------------------------------------ */}

        <div className="relative md:col-span-2 lg:col-span-2 xl:col-span-2">
          <Search className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search by name, asset tag, brand, model..."
            className="pl-9"
          />
        </div>

        {/* ------------------------------------------------ */}
        {/* CATEGORY */}
        {/* ------------------------------------------------ */}

        <Select
          value={categoryId || "all"}
          onValueChange={(value) =>
            onCategoryChange(
              value === "all" ? "all" : value,
            )
          }
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

        {/* ------------------------------------------------ */}
        {/* VENDOR */}
        {/* ------------------------------------------------ */}

        <Select
          value={vendorId || "all"}
          onValueChange={(value) =>
            onVendorChange(
              value === "all" ? "all" : value,
            )
          }
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

        {/* ------------------------------------------------ */}
        {/* STATUS */}
        {/* ------------------------------------------------ */}

        <Select
          value={status || "all"}
          onValueChange={(value) =>
            onStatusChange(
              value === "all" ? "all" : value,
            )
          }
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

        {/* ------------------------------------------------ */}
        {/* CONDITION */}
        {/* ------------------------------------------------ */}

        <Select
          value={condition || "all"}
          onValueChange={(value) =>
            onConditionChange(
              value === "all" ? "all" : value,
            )
          }
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

        {/* ------------------------------------------------ */}
        {/* LOCATION */}
        {/* ------------------------------------------------ */}

        <Select
          value={location || "all"}
          onValueChange={(value) =>
            onLocationChange(
              value === "all" ? "all" : value,
            )
          }
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

        {/* ------------------------------------------------ */}
        {/* SORT BY */}
        {/* ------------------------------------------------ */}

        <Select
          value={sortBy || "createdAt"}
          onValueChange={onSortByChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="createdAt">
              Created Date
            </SelectItem>

            <SelectItem value="updatedAt">
              Updated Date
            </SelectItem>

            <SelectItem value="assetTag">
              Asset Tag
            </SelectItem>

            <SelectItem value="name">
              Name
            </SelectItem>

            <SelectItem value="purchasePrice">
              Purchase Price
            </SelectItem>

            <SelectItem value="purchaseDate">
              Purchase Date
            </SelectItem>

            <SelectItem value="warrantyExpiry">
              Warranty Expiry
            </SelectItem>
          </SelectContent>
        </Select>

        {/* ------------------------------------------------ */}
        {/* SORT ORDER */}
        {/* ------------------------------------------------ */}

        <Select
          value={sortOrder}
          onValueChange={(value) =>
            onSortOrderChange(
              value as "asc" | "desc",
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Order" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="asc">
              ↑ Ascending
            </SelectItem>

            <SelectItem value="desc">
              ↓ Descending
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ------------------------------------------------ */}
      {/* ACTIVE FILTERS SUMMARY */}
      {/* ------------------------------------------------ */}

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="text-xs font-medium text-muted-foreground">
            Active filters:
          </span>

          {/* Search */}
          {searchTerm && (
            <FilterBadge
              label={`Search: ${searchTerm}`}
            />
          )}

          {/* Category */}
          {categoryId !== "all" && (
            <FilterBadge
              label={`Category: ${
                categories.find(
                  (category) =>
                    category.id === categoryId,
                )?.name ?? categoryId
              }`}
            />
          )}

          {/* Vendor */}
          {vendorId !== "all" && (
            <FilterBadge
              label={`Vendor: ${
                vendors.find(
                  (vendor) =>
                    vendor.id === vendorId,
                )?.name ?? vendorId
              }`}
            />
          )}

          {/* Status */}
          {status !== "all" && (
            <FilterBadge
              label={`Status: ${formatLabel(status)}`}
            />
          )}

          {/* Condition */}
          {condition !== "all" && (
            <FilterBadge
              label={`Condition: ${formatLabel(condition)}`}
            />
          )}

          {/* Location */}
          {location !== "all" && (
            <FilterBadge
              label={`Location: ${location}`}
            />
          )}

          {/* Sort */}
          {sortBy !== "createdAt" && (
            <FilterBadge
              label={`Sort: ${formatLabel(sortBy)} (${sortOrder})`}
            />
          )}
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------
// FILTER BADGE
// --------------------------------------------------

const FilterBadge = ({
  label,
}: {
  label: string;
}) => {
  return (
    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {label}
    </span>
  );
};

// --------------------------------------------------
// FORMAT ENUM LABEL
// --------------------------------------------------

/**
 * NEW        -> New
 * AVAILABLE  -> Available
 * IN_REPAIR  -> In Repair
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