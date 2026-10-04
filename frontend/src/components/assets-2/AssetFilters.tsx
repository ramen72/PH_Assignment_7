"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetFiltersProps {
  searchTerm: string;
  status: string;
  condition: string;
  categories: { id: string; name: string }[];
  categoryId: string;
  location: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;

  onReset: () => void;
}

const AssetFilters = ({
  searchTerm,
  status,
  condition,
  categoryId,
  location,
  onSearchChange,
  onStatusChange,
  onConditionChange,
  onCategoryChange,
  onLocationChange,
  onReset,
}: AssetFiltersProps) => {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assets..."
            className="pl-9"
          />
        </div>

        {/* Category */}
        <Select
          value={categoryId}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Categories
            </SelectItem>

            <SelectItem value="080613a0-fcb7-4bd8-ae57-7fc62e84e946">
              Laptop
            </SelectItem>

            {/* Other categories */}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Status
            </SelectItem>

            <SelectItem value="AVAILABLE">
              Available
            </SelectItem>

            <SelectItem value="ASSIGNED">
              Assigned
            </SelectItem>

            <SelectItem value="MAINTENANCE">
              Maintenance
            </SelectItem>

            <SelectItem value="RETIRED">
              Retired
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Condition */}
        <Select
          value={condition}
          onValueChange={onConditionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Condition" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Conditions
            </SelectItem>

            <SelectItem value="NEW">
              New
            </SelectItem>

            <SelectItem value="GOOD">
              Good
            </SelectItem>

            <SelectItem value="FAIR">
              Fair
            </SelectItem>

            <SelectItem value="POOR">
              Poor
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location + Reset */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Input
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Filter by location..."
          className="sm:max-w-sm"
        />

        <Button
          variant="outline"
          onClick={onReset}
        >
          <X className="mr-2 size-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default AssetFilters;