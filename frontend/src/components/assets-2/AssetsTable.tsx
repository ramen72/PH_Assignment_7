"use client";

import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Package,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Asset {
  id: string;
  assetTag: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  condition: string;
  status: string;
  location: string;
  imageUrl?: string;
  purchasePrice: string;
  category: {
    id: string;
    name: string;
  };
  vendor: {
    id: string;
    name: string;
    companyName: string;
  };
}

interface AssetTableProps {
  assets: Asset[];
  onView?: (asset: Asset) => void;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
}

const AssetTable = ({
  assets,
  onView,
  onEdit,
  onDelete,
}: AssetTableProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "default";

      case "ASSIGNED":
        return "secondary";

      case "MAINTENANCE":
        return "outline";

      case "RETIRED":
        return "destructive";

      default:
        return "outline";
    }
  };

  const getConditionClass = (condition: string) => {
    switch (condition) {
      case "NEW":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "GOOD":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "FAIR":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "POOR":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!assets?.length) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border bg-background">
        <Package className="mb-3 size-10 text-muted-foreground" />

        <h3 className="font-semibold text-lg">
          No assets found
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          There are no assets to display.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[260px]">
                Asset
              </TableHead>

              <TableHead>Category</TableHead>

              <TableHead>Serial Number</TableHead>

              <TableHead>Condition</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Location</TableHead>

              <TableHead>Vendor</TableHead>

              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assets.map((asset) => (
              <TableRow
                key={asset.id}
                className="group transition-colors"
              >
                {/* Asset */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Image */}
                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                      {asset.imageUrl ? (
                        <img
                          src={asset.imageUrl}
                          alt={asset.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Package className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    {/* Name */}
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {asset.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {asset.assetTag}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {asset.brand} · {asset.model}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Badge variant="outline">
                    {asset.category?.name ?? "N/A"}
                  </Badge>
                </TableCell>

                {/* Serial */}
                <TableCell>
                  <span className="font-mono text-xs">
                    {asset.serialNumber}
                  </span>
                </TableCell>

                {/* Condition */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getConditionClass(
                      asset.condition
                    )}
                  >
                    {asset.condition}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={getStatusVariant(asset.status)}
                  >
                    {asset.status}
                  </Badge>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="size-4 text-muted-foreground" />

                    <span>{asset.location}</span>
                  </div>
                </TableCell>

                {/* Vendor */}
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">
                      {asset.vendor?.name ?? "N/A"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {asset.vendor?.companyName}
                    </p>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {/* View */}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onView?.(asset)}
                      title="View asset"
                    >
                      <Eye className="size-4" />
                    </Button>

                    {/* Edit */}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onEdit?.(asset)}
                      title="Edit asset"
                    >
                      <Pencil className="size-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete?.(asset)}
                      title="Delete asset"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetTable;