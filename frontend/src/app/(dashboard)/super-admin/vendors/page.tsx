
"use client";

import { useState } from "react";
import {
  Building2,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VendorPayload, VendorResponse } from "@/types";
import { useActivateVendor, useCreateVendor, useDeactivateVendor, useDeleteVendor, useGetAllVendors } from "@/hooks";
import { toast } from "@/components/ui/toast";

// import {
//   useActivateVendor,
//   useCreateVendor,
//   useDeactivateVendor,
//   useDeleteVendor,
//   useGetAllVendors,
// } from "@/hooks/vendor.hooks";

// import type {
//   Vendor,
//   VendorPayload,
// } from "@/types/vendor.interface";

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<VendorPayload>({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    contactPerson: "",
  });

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllVendors();

  const createMutation = useCreateVendor();
  const deleteMutation = useDeleteVendor();
  const activateMutation = useActivateVendor();
  const deactivateMutation = useDeactivateVendor();

  // Assumes apiClient returns the complete API response.
  const vendors: VendorResponse[] = response?.data ?? [];

  const filteredVendors = vendors.filter((vendor) => {
    const search = searchTerm.toLowerCase();

    return [
      vendor.name,
      vendor.companyName,
      vendor.email,
      vendor.contactPerson,
    ].some((value) =>
      value?.toLowerCase().includes(search),
    );
  });

  const handleCreateVendor = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!formData.name?.trim()) {
      toast.add({
        type:"error",
        title:"Vendor name is required"
      })
      return;
    }

    const payload = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    ) as VendorPayload;

    // Omit optional empty strings.
    for (const key of [
      "companyName",
      "email",
      "phone",
      "address",
      "website",
      "contactPerson",
    ] as const) {
      if (!payload[key]) {
        delete payload[key];
      }
    }

    try {
      await createMutation.mutateAsync(payload);

      toast.add({
        type:"success",
        title:"Vendor created successfully."
      })

      setFormData({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        contactPerson: "",
      });

      setShowForm(false);
    } catch (error) {
      toast.add({
        type:"error",
        title:
        error instanceof Error
          ? error.message
          : "Failed to create vendor",
      }
      );
    }
  };

  const handleDelete = async (vendor: VendorResponse) => {
    const confirmed = window.confirm(
      `Delete vendor "${vendor.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(vendor.id);
      toast.add({
        type:"success",
        title:"Vendor deleted successfully"
      })
    } catch (error) {
        toast.add({
        type:"error",
        title: error instanceof Error
          ? error.message
          : "Unable to delete vendor",
      })
    }
  };

  const handleToggleStatus = async (vendor: VendorResponse) => {
    try {
      if (vendor.isActive) {
        await deactivateMutation.mutateAsync(vendor.id);
        toast.add({
            type:"success",
            title:"Vendor deactivated"
        })
      } else {
        await activateMutation.mutateAsync(vendor.id);
        await deactivateMutation.mutateAsync(vendor.id);
        toast.add({
            type:"success",
            title:"Vendor activated"
        })
      }
    } catch (error) {
         toast.add({
            type:"error",
            title: "Failed to update vendor status",
            description: error instanceof Error
          ? error.message
          : "Failed to update vendor status",
        })
    }
  };

  const isUpdatingStatus =
    activateMutation.isPending ||
    deactivateMutation.isPending;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vendor Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage suppliers and their asset purchases.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 size-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Vendor</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleCreateVendor}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    ["name", "Vendor Name *"],
                    ["companyName", "Company Name"],
                    ["email", "Email"],
                    ["phone", "Phone"],
                    ["contactPerson", "Contact Person"],
                    ["website", "Website"],
                    ["address", "Address"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <label
                      htmlFor={`vendor-${key}`}
                      className="text-sm font-medium"
                    >
                      {label}
                    </label>

                    <Input
                      id={`vendor-${key}`}
                      type={key === "email" ? "email" : "text"}
                      required={key === "name"}
                      value={formData[key] ?? ""}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          [key]: event.target.value,
                        }))
                      }
                      placeholder={label.replace(" *", "")}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Create Vendor
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Building2 className="size-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Total Vendors
              </p>
              <p className="text-2xl font-bold">
                {vendors.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Active Vendors
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {vendors.filter((vendor) => vendor.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Inactive Vendors
            </p>
            <p className="text-2xl font-bold text-amber-600">
              {vendors.filter((vendor) => !vendor.isActive).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Purchases
            </p>
            <p className="text-2xl font-bold">
              {vendors.reduce(
                (total, vendor) =>
                  total + (vendor._count?.purchases ?? 0),
                0,
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Vendors</CardTitle>

            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search vendors..."
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="space-y-3 py-10 text-center">
              <p className="text-sm text-destructive">
                Failed to load vendors.
              </p>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No vendors found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-3 py-3">Vendor</th>
                    <th className="px-3 py-3">Contact</th>
                    <th className="px-3 py-3">Assets</th>
                    <th className="px-3 py-3">Purchases</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="border-b last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-3 py-4">
                        <p className="font-medium">
                          {vendor.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vendor.companyName || "—"}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        <p>{vendor.email || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {vendor.phone || "—"}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        {vendor._count?.assets ?? 0}
                      </td>

                      <td className="px-3 py-4">
                        {vendor._count?.purchases ?? 0}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            vendor.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {vendor.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            title={
                              vendor.isActive
                                ? "Deactivate vendor"
                                : "Activate vendor"
                            }
                            disabled={isUpdatingStatus}
                            onClick={() =>
                              handleToggleStatus(vendor)
                            }
                          >
                            {vendor.isActive ? (
                              <ToggleRight className="size-4 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="size-4" />
                            )}
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Delete vendor"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(vendor)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
