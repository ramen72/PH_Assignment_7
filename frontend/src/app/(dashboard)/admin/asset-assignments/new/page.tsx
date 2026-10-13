
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// import { useCreateAssetAssignment } from "@/hooks/assetAssignment.hooks";
// import { toast } from "@/components/ui/toast";
// import { useGetAllAssets, useGetAllUsers } from "@/hooks";
// import type { Asset, User } from "@/types";

// export default function CreateAssetAssignmentPage() {
//   const router = useRouter();
//   const createMutation = useCreateAssetAssignment();

//   const [assetId, setAssetId] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [remarks, setRemarks] = useState("");

//   const { data: usersResponse } = useGetAllUsers();

//   const employees:User[] = (usersResponse?.data ?? []).filter(
//     (user:User) =>
//       user.role === "EMPLOYEE" &&
//       user.status === "ACTIVE" &&
//       user.isActive === true &&
//       user.isDeleted === false,
//   );

//   const { data: assets, isLoading: assetListIsLoading, isError: assetListIsError } = useGetAllAssets();
//   const assetList: Asset[] = assets?.data || []


//   const handleSubmit = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     try {
//       await createMutation.mutateAsync({
//         assetId: assetId.trim(),
//         employeeId: employeeId.trim(),
//         remarks: remarks.trim() || undefined,
//       });

//       setAssetId("")
//       setEmployeeId("")
//       toast.add({
//         type:"success",
//         title:"Asset assigned successfully"
//     });
//       router.push("/super-admin/asset-assignments");
//     } catch (error) {
//       toast.add({
//         type:"error",
//         title:"Failed to create assignment",
//         description: error instanceof Error
//           ? error.message
//           : "Failed to create assignment",
//       });
//     }
//   };

//   return (
//     <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
//       <div>
//         <h1 className="text-2xl font-bold">
//           Create Asset Assignment
//         </h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Assign an available asset to an active employee.
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Assignment Information</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <Label htmlFor="assetId">Select Asset</Label>
//             <div className="border rounded-md px-1 py-2">
//                 <select
//                   value={employeeId}
//                   disabled={assetListIsLoading}
//                   onChange={(e) => setAssetId(e.target.value)}
//                   className="w-ful"
//                   >
//                   <option value="">Select</option>
//                   {assetList.map((asset:Asset) => (
//                     <option key={asset.id} value={asset.id}>
//                       {asset.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//                   </div>

//             <div className="space-y-2">
//               <Label htmlFor="assetId">Select Employee</Label>
//               <div className="border">
//                 <select
//                   value={employeeId}
//                   onChange={(e) => setEmployeeId(e.target.value)}
//                 >
//                   <option value="">Select</option>
//                   {employees.map((employee:User) => (
//                     <option key={employee.id} value={employee.id}>
//                       {employee.name} — {employee.email}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="remarks">Remarks (Optional)</Label>
//               <Textarea
//                 id="remarks"
//                 value={remarks}
//                 onChange={(event) =>
//                   setRemarks(event.target.value)
//                 }
//                 placeholder="Enter assignment notes..."
//                 maxLength={1000}
//               />
//             </div>

//             <div className="flex justify-end gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="submit"
//                 disabled={createMutation.isPending}
//               >
//                 {createMutation.isPending
//                   ? "Assigning..."
//                   : "Assign Asset"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Laptop,
  LoaderCircle,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

import {
  useCreateAssetAssignment,
  useGetAllAssets,
  useGetAllUsers,
} from "@/hooks";

import type { Asset, User } from "@/types";

export default function CreateAssetAssignmentPage() {
  const router = useRouter();
  const createMutation = useCreateAssetAssignment();

  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  // Fetch available assets through TanStack Query.
  const {
    data: assetsResponse,
    isLoading: assetListIsLoading,
    isError: assetListIsError,
    refetch: refetchAssets,
  } = useGetAllAssets({
    status: "AVAILABLE",
    page: 1,
    limit: 100,
  });

  // Fetch users through TanStack Query.
  const {
    data: usersResponse,
    isLoading: usersAreLoading,
    isError: usersAreError,
    refetch: refetchUsers,
  } = useGetAllUsers();

  const assets: Asset[] = assetsResponse?.data ?? [];
  const users: User[] = usersResponse?.data ?? [];

  // Filter available assets only.
  const availableAssets = useMemo(
    () => assets.filter((asset) => asset.status === "AVAILABLE"),
    [assets],
  );

  // Only active employees can receive an asset.
  const employees = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "EMPLOYEE" &&
          user.status === "ACTIVE" &&
          user.isActive === true &&
          user.isDeleted === false,
      ),
    [users],
  );

  // Searchable asset list.
  const filteredAssets = useMemo(() => {
    const search = assetSearch.trim().toLowerCase();

    if (!search) return availableAssets;

    return availableAssets.filter((asset) =>
      [
        asset.name,
        asset.assetTag,
        asset.brand,
        asset.model,
        asset.location,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search)),
    );
  }, [availableAssets, assetSearch]);

  // Searchable employee list.
  const filteredEmployees = useMemo(() => {
    const search = employeeSearch.trim().toLowerCase();

    if (!search) return employees;

    return employees.filter((employee) =>
      [employee.name, employee.email, employee.department]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search)),
    );
  }, [employees, employeeSearch]);

  const selectedAsset = availableAssets.find(
    (asset) => asset.id === assetId,
  );

  const selectedEmployee = employees.find(
    (employee) => employee.id === employeeId,
  );

  const isFormReady = Boolean(assetId && employeeId);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!assetId || !employeeId) {
      toast.add({
        type: "error",
        title: "Complete the required fields",
        description: "Please select an available asset and an employee.",
      });
      return;
    }

    try {
      await createMutation.mutateAsync({
        assetId,
        employeeId,
        remarks: remarks.trim() || undefined,
      });

      toast.add({
        type: "success",
        title: "Asset assigned successfully",
        description: `${selectedAsset?.name ?? "Asset"} has been assigned.`,
      });

      router.push("/super-admin/asset-assignments");
    } catch (error) {
      toast.add({
        type: "error",
        title: "Assignment failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create the assignment. Please try again.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/80 px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-orange-600"
        >
          <ArrowLeft className="size-4" />
          Back to assignments
        </button>

        {/* Hero header */}
        <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-20 -z-10 size-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 size-64 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 backdrop-blur">
                <ClipboardCheck className="size-4" />
                ASSET MANAGEMENT
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Create Asset Assignment
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Assign company equipment to the right employee and keep
                your asset records organized in one place.
              </p>
            </div>

            <div className="flex size-16 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 shadow-inner backdrop-blur sm:size-20 sm:self-center">
              <Laptop className="size-8 text-orange-400 sm:size-10" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
              <p className="text-xs font-medium text-slate-300">
                Available assets
              </p>
              <p className="mt-1 text-2xl font-bold">
                {assetListIsLoading ? "—" : availableAssets.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
              <p className="text-xs font-medium text-slate-300">
                Active employees
              </p>
              <p className="mt-1 text-2xl font-bold">
                {usersAreLoading ? "—" : employees.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
              <p className="text-xs font-medium text-slate-300">
                Assignment status
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <span className="size-2 rounded-full bg-emerald-400" />
                Ready to configure
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
            {/* Main form */}
            <div className="space-y-6 lg:col-span-3">
              {/* Asset selection */}
              <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-orange-50/80 to-white px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                      <Laptop className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="text-base font-bold text-slate-900 sm:text-lg">
                        Select an asset
                      </CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        Choose equipment that is available for assignment.
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5 sm:p-6">
                  {/* <div className="space-y-2">
                    <Label htmlFor="asset-search">
                      Search assets
                    </Label>

                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="asset-search"
                        value={assetSearch}
                        onChange={(event) =>
                          setAssetSearch(event.target.value)
                        }
                        placeholder="Search by name, tag, brand..."
                        className="h-11 rounded-xl border-slate-200 pl-9 pr-9 focus-visible:ring-orange-500"
                      />
                      {assetSearch && (
                        <button
                          type="button"
                          aria-label="Clear asset search"
                          onClick={() => setAssetSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="assetId">
                      Available asset <span className="text-red-500">*</span>
                    </Label>

                    <select
                      id="assetId"
                      name="assetId"
                      required
                      value={assetId}
                      disabled={assetListIsLoading || assetListIsError}
                      onChange={(event) => setAssetId(event.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="">
                        {assetListIsLoading
                          ? "Loading available assets..."
                          : assetListIsError
                            ? "Unable to load assets"
                            : filteredAssets.length === 0
                              ? "No matching assets found"
                              : "Choose an asset"}
                      </option>

                      {filteredAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.assetTag
                            ? `${asset.assetTag} — `
                            : ""}
                          {asset.name}
                          {asset.brand ? ` (${asset.brand})` : ""}
                        </option>
                      ))}
                    </select>

                    {assetListIsError ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-red-600">
                        <span>Could not load assets.</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => refetchAssets()}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        {filteredAssets.length} available asset
                        {filteredAssets.length === 1 ? "" : "s"} matching
                        your search
                      </p>
                    )}
                  </div>

                  {selectedAsset && (
                    <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50/50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm">
                          <Laptop className="size-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="break-words font-semibold text-slate-900">
                              {selectedAsset.name}
                            </p>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                              <CheckCircle2 className="size-3" />
                              Available
                            </span>
                          </div>

                          <p className="mt-1 break-all text-xs text-slate-500">
                            {selectedAsset.assetTag || selectedAsset.id}
                          </p>

                          {(selectedAsset.brand ||
                            selectedAsset.model ||
                            selectedAsset.location) && (
                            <p className="mt-2 break-words text-sm text-slate-600">
                              {[
                                selectedAsset.brand,
                                selectedAsset.model,
                                selectedAsset.location,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Employee selection */}
              <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-cyan-50/80 to-white px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                      <Users className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <CardTitle className="text-base font-bold text-slate-900 sm:text-lg">
                        Assign to employee
                      </CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        Select an active employee who will receive this asset.
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5 sm:p-6">
                  {/* <div className="space-y-2">
                    <Label htmlFor="employee-search">
                      Search employees
                    </Label>

                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="employee-search"
                        value={employeeSearch}
                        onChange={(event) =>
                          setEmployeeSearch(event.target.value)
                        }
                        placeholder="Search by name, email, department..."
                        className="h-11 rounded-xl border-slate-200 pl-9 pr-9 focus-visible:ring-cyan-500"
                      />
                      {employeeSearch && (
                        <button
                          type="button"
                          aria-label="Clear employee search"
                          onClick={() => setEmployeeSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="employeeId">
                      Employee <span className="text-red-500">*</span>
                    </Label>

                    <select
                      id="employeeId"
                      name="employeeId"
                      required
                      value={employeeId}
                      disabled={usersAreLoading || usersAreError}
                      onChange={(event) =>
                        setEmployeeId(event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="">
                        {usersAreLoading
                          ? "Loading employees..."
                          : usersAreError
                            ? "Unable to load employees"
                            : filteredEmployees.length === 0
                              ? "No matching employees found"
                              : "Choose an employee"}
                      </option>

                      {filteredEmployees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} — {employee.email}
                        </option>
                      ))}
                    </select>

                    {usersAreError ? (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-red-600">
                        <span>Could not load employees.</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => refetchUsers()}
                        >
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        {filteredEmployees.length} active employee
                        {filteredEmployees.length === 1 ? "" : "s"} matching
                        your search
                      </p>
                    )}
                  </div>

                  {selectedEmployee && (
                    <div className="rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-sky-50/50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-100 font-bold text-cyan-800">
                          {selectedEmployee.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={selectedEmployee.profileImage}
                              alt={selectedEmployee.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            selectedEmployee.name
                              .split(" ")
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")
                              .toUpperCase()
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="break-words font-semibold text-slate-900">
                              {selectedEmployee.name}
                            </p>
                            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                              Active
                            </span>
                          </div>

                          <p className="mt-1 break-all text-sm text-slate-600">
                            {selectedEmployee.email}
                          </p>

                          {(selectedEmployee.department ||
                            selectedEmployee.designation) && (
                            <p className="mt-1 break-words text-xs text-slate-500">
                              {[
                                selectedEmployee.designation,
                                selectedEmployee.department,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Remarks */}
              <Card className="rounded-2xl border-slate-200/80 shadow-sm">
                <CardHeader className="px-5 pb-2 pt-5 sm:px-6">
                  <CardTitle className="text-base font-bold text-slate-900">
                    Additional information
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-2 sm:px-6 sm:pb-6">
                  <div className="space-y-2">
                    <Label htmlFor="remarks">
                      Remarks{" "}
                      <span className="font-normal text-slate-400">
                        (Optional)
                      </span>
                    </Label>

                    <Textarea
                      id="remarks"
                      name="remarks"
                      value={remarks}
                      onChange={(event) =>
                        setRemarks(event.target.value)
                      }
                      placeholder="E.g. Assigned for office work, project requirements..."
                      maxLength={1000}
                      rows={4}
                      className="resize-y rounded-xl border-slate-200 focus-visible:ring-orange-500"
                    />

                    <div className="flex justify-between gap-3 text-xs text-slate-400">
                      <span>Provide a reason or useful notes.</span>
                      <span className="shrink-0">
                        {remarks.length}/1000
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assignment summary */}
            <aside className="space-y-5 lg:sticky lg:top-6 lg:col-span-2">
              <Card className="overflow-hidden rounded-2xl border-slate-200/80 shadow-sm">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-5 text-white">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="size-5" />
                    <h2 className="font-bold">Assignment summary</h2>
                  </div>
                  <p className="mt-1 text-sm text-orange-50">
                    Review the details before confirming.
                  </p>
                </div>

                <CardContent className="space-y-5 p-5">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Asset
                    </p>

                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <Laptop className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-slate-900">
                          {selectedAsset?.name || "No asset selected"}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {selectedAsset?.assetTag ||
                            (selectedAsset ? selectedAsset.id : "Choose an asset above")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-200" />

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Employee
                    </p>

                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                        <UserRound className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-slate-900">
                          {selectedEmployee?.name || "No employee selected"}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {selectedEmployee?.email ||
                            "Choose an employee above"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-200" />

                  <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3.5">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        Assignment validation
                      </p>
                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        {isFormReady
                          ? "Both selections are ready. The server will validate availability before assigning."
                          : "Select an available asset and an active employee to continue."}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending ||
                      !isFormReady ||
                      assetListIsLoading ||
                      usersAreLoading ||
                      assetListIsError ||
                      usersAreError
                    }
                    className="h-12 w-full rounded-xl bg-orange-500 font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:shadow-none"
                  >
                    {createMutation.isPending ? (
                      <>
                        <LoaderCircle className="mr-2 size-4 animate-spin" />
                        Assigning asset...
                      </>
                    ) : (
                      <>
                        Confirm assignment
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs leading-5 text-slate-400">
                    The asset status will be managed by the backend after
                    a successful assignment.
                  </p>
                </CardContent>
              </Card>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Secure assignment
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-800/80">
                      Only active employees and available assets are offered.
                      The backend remains responsible for enforcing assignment
                      rules.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Responsive bottom actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createMutation.isPending}
              className="h-11 rounded-xl px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createMutation.isPending ||
                !isFormReady ||
                assetListIsLoading ||
                usersAreLoading ||
                assetListIsError ||
                usersAreError
              }
              className="h-11 rounded-xl bg-orange-500 px-6 font-semibold text-white hover:bg-orange-600 sm:min-w-48"
            >
              {createMutation.isPending ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  Assign asset
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}