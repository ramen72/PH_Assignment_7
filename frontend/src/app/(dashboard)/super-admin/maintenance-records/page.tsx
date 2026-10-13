const MaintenanceRecordsPage = () => {
    return (
        <div>
            <h1>MaintenanceRecordsPage</h1>
        </div>
    );
};

export default MaintenanceRecordsPage;

// "use client";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AlertTriangle,
//   CalendarDays,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   CirclePlus,
//   Clock,
//   Eye,
//   Loader2,
//   MoreHorizontal,
//   Pencil,
//   Search,
//   Trash2,
//   Wrench,
//   XCircle,
// } from "lucide-react";
// // import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MaintenanceRecord, MaintenanceRecordFilterParams } from "@/types";
// import { useDeleteMaintenanceRecord, useGetAllMaintenanceRecords } from "@/hooks";
// import { toast } from "@/components/ui/toast";

// // Update these import paths/names to match your existing exports.
// // import {
// //   useGetMaintenanceRecords,
// //   useDeleteMaintenanceRecord,
// // } from "@/hooks/maintenanceRecords.hook";

// // import type {
// //   MaintenanceRecord,
// //   MaintenanceRecordFilterParams,
// // } from "@/types";

// const PAGE_SIZE = 10;

// const STATUS_OPTIONS = [
//   { value: "ALL", label: "All statuses" },
//   { value: "REPORTED", label: "Reported" },
//   { value: "IN_PROGRESS", label: "In progress" },
//   { value: "COMPLETED", label: "Completed" },
//   { value: "CANCELLED", label: "Cancelled" },
// ] as const;

// const statusStyles: Record<string, string> = {
//   REPORTED:
//     "border-blue-200 bg-blue-50 text-blue-700",
//   IN_PROGRESS:
//     "border-amber-200 bg-amber-50 text-amber-700",
//   COMPLETED:
//     "border-green-200 bg-green-50 text-green-700",
//   CANCELLED:
//     "border-red-200 bg-red-50 text-red-700",
// };

// function formatDate(value?: string | Date | null) {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "—";

//   return new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// function formatCurrency(value?: string | number | null) {
//   return new Intl.NumberFormat("en-BD", {
//     style: "currency",
//     currency: "BDT",
//     maximumFractionDigits: 2,
//   }).format(Number(value ?? 0));
// }

// function StatusBadge({ status }: { status: string }) {
//   return (
//     <Badge
//       variant="outline"
//       className={statusStyles[status] ?? ""}
//     >
//       {status.replaceAll("_", " ")}
//     </Badge>
//   );
// }

// function LoadingRows() {
//   return (
//     <>
//       {Array.from({ length: 5 }, (_, index) => (
//         <TableRow key={`maintenance-skeleton-${index}`}>
//           {Array.from({ length: 6 }, (_, cellIndex) => (
//             <TableCell key={`skeleton-cell-${cellIndex}`}>
//               <div className="h-5 animate-pulse rounded-md bg-muted" />
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </>
//   );
// }

// export default function MaintenanceRecordsPage() {
//   const router = useRouter();

//   const [searchInput, setSearchInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [status, setStatus] = useState("ALL");
//   const [page, setPage] = useState(1);
//   const [deleteTarget, setDeleteTarget] =
//     useState<MaintenanceRecord | null>(null);

//   // Search is applied when the user submits the search field.
//   const params = useMemo<MaintenanceRecordFilterParams>(
//     () => ({
//       page,
//       limit: PAGE_SIZE,
//       ...(searchTerm ? { searchTerm } : {}),
//       ...(status !== "ALL" ? { status } : {}),
//     }),
//     [page, searchTerm, status],
//   );

//   const {
//     data: response,
//     isPending,
//     isFetching,
//     isError,
//     error,
//     refetch,
//   } = useGetAllMaintenanceRecords(params);

//   const deleteMutation = useDeleteMaintenanceRecord();

//   /*
//    * Assumed API response:
//    * {
//    *   success: true,
//    *   data: {
//    *     data: MaintenanceRecord[],
//    *     meta: { page, limit, total, totalPage }
//    *   }
//    * }
//    *
//    * Adapt this extraction if your API uses a different response shape.
//    */
//   const result = response?.data;

//   const records: MaintenanceRecord[] = Array.isArray(result)
//     ? result
//     : Array.isArray(result?.data)
//       ? result.data
//       : [];

//   const meta = Array.isArray(result)
//     ? undefined
//     : result?.meta;

//   const total = Number(meta?.total ?? records.length);
//   const totalPages = Math.max(
//     1,
//     Number(meta?.totalPage ?? Math.ceil(total / PAGE_SIZE)),
//   );

//   const reportedCount = records.filter(
//     (record) => record.status === "REPORTED",
//   ).length;

//   const inProgressCount = records.filter(
//     (record) => record.status === "IN_PROGRESS",
//   ).length;

//   const completedCount = records.filter(
//     (record) => record.status === "COMPLETED",
//   ).length;

//   const handleSearch = () => {
//     setPage(1);
//     setSearchTerm(searchInput.trim());
//   };

//   const handleStatusChange = (value: string) => {
//     setStatus(value);
//     setPage(1);
//   };

//   const handleDelete = () => {
//     if (!deleteTarget) return;

//     deleteMutation.mutate(deleteTarget.id, {
//       onSuccess: () => {
//         toast.add({
//             type:"success",
//             title:"Maintenance record deleted successfully."
//         })
//         setDeleteTarget(null);

//         // Query invalidation should be implemented inside the hook.
//       },
//       onError: (mutationError) => {
//         toast.add({
//             type:"error",
//             title:"Maintenance record deleted successfully.",
//             description: mutationError instanceof Error
//             ? mutationError.message
//             : "Failed to delete maintenance record.",
//         })
//       },
//     });
//   };

//   return (
//     <div className="space-y-6 p-4 md:p-6 lg:p-8">
//       {/* Page heading */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <Wrench className="size-6 text-[#f15825]" />
//             <h1 className="text-2xl font-bold tracking-tight">
//               Maintenance Records
//             </h1>
//           </div>

//           <p className="mt-2 text-sm text-muted-foreground">
//             Track asset repairs, maintenance costs, and service status.
//           </p>
//         </div>

//         <Button
//           onClick={() =>
//             router.push(
//               "/super-admin/maintenance-records/create",
//             )
//           }
//           className="bg-[#f15825] text-white hover:bg-[#d94b1d]"
//         >
//           <CirclePlus className="mr-2 size-4" />
//           Add Maintenance
//         </Button>
//       </div>

//       {/* Summary cards */}
//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Records
//             </CardTitle>
//             <Wrench className="size-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{total}</div>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Matching records
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">
//               Reported
//             </CardTitle>
//             <AlertTriangle className="size-4 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{reportedCount}</div>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Awaiting maintenance
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">
//               In Progress
//             </CardTitle>
//             <Clock className="size-4 text-amber-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{inProgressCount}</div>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Currently being serviced
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">
//               Completed
//             </CardTitle>
//             <CheckCircle2 className="size-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{completedCount}</div>
//             <p className="mt-1 text-xs text-muted-foreground">
//               Completed on this page
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent className="p-4">
//           <div className="flex flex-col gap-3 md:flex-row">
//             <form
//               className="flex flex-1 gap-2"
//               onSubmit={(event) => {
//                 event.preventDefault();
//                 handleSearch();
//               }}
//             >
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   value={searchInput}
//                   onChange={(event) =>
//                     setSearchInput(event.target.value)
//                   }
//                   placeholder="Search issue, asset, or vendor..."
//                   className="pl-9"
//                 />
//               </div>

//               <Button type="submit" variant="outline">
//                 Search
//               </Button>
//             </form>

//             <Select
//               value={status}
//               onValueChange={handleStatusChange}
//             >
//               <SelectTrigger className="w-full md:w-47.5">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 {STATUS_OPTIONS.map((option) => (
//                   <SelectItem
//                     key={option.value}
//                     value={option.value}
//                   >
//                     {option.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Button
//               variant="outline"
//               onClick={() => {
//                 setSearchInput("");
//                 setSearchTerm("");
//                 setStatus("ALL");
//                 setPage(1);
//               }}
//             >
//               <XCircle className="mr-2 size-4" />
//               Reset
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Records table */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-lg">
//             Maintenance History
//           </CardTitle>

//           {isFetching && !isPending && (
//             <Loader2 className="size-4 animate-spin text-muted-foreground" />
//           )}
//         </CardHeader>

//         <CardContent>
//           {isError ? (
//             <div className="flex flex-col items-center gap-3 py-12 text-center">
//               <AlertTriangle className="size-10 text-destructive" />
//               <p className="font-medium">
//                 Failed to load maintenance records.
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 {error instanceof Error
//                   ? error.message
//                   : "An unexpected error occurred."}
//               </p>
//               <Button variant="outline" onClick={() => refetch()}>
//                 Try Again
//               </Button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Issue / Asset</TableHead>
//                     <TableHead>Reported By</TableHead>
//                     <TableHead>Service Cost</TableHead>
//                     <TableHead>Started At</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">
//                       Actions
//                     </TableHead>
//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {isPending ? (
//                     <LoadingRows />
//                   ) : records.length === 0 ? (
//                     <TableRow>
//                       <TableCell
//                         colSpan={6}
//                         className="h-36 text-center"
//                       >
//                         <div className="flex flex-col items-center gap-2">
//                           <Wrench className="size-8 text-muted-foreground" />
//                           <p className="font-medium">
//                             No maintenance records found
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             Try another search or create a new record.
//                           </p>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     records.map((record) => (
//                       <TableRow key={record.id}>
//                         <TableCell className="min-w-55">
//                           <p className="font-medium">
//                             {record.issue}
//                           </p>
//                           <p className="mt-1 text-xs text-muted-foreground">
//                             {record.asset?.name ??
//                               record.assetId}
//                           </p>
//                         </TableCell>

//                         <TableCell>
//                           {record.reportedBy?.name ??
//                             record.reportedById}
//                         </TableCell>

//                         <TableCell className="whitespace-nowrap font-medium">
//                           {formatCurrency(record.serviceCost)}
//                         </TableCell>

//                         <TableCell className="whitespace-nowrap">
//                           <span className="inline-flex items-center gap-2">
//                             <CalendarDays className="size-4 text-muted-foreground" />
//                             {formatDate(record.startedAt)}
//                           </span>
//                         </TableCell>

//                         <TableCell>
//                           <StatusBadge status={record.status} />
//                         </TableCell>

//                         <TableCell className="text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 aria-label="Open maintenance actions"
//                               >
//                                 <MoreHorizontal className="size-4" />
//                               </Button>
//                             </DropdownMenuTrigger>

//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   router.push(
//                                     `/super-admin/maintenance-records/${record.id}`,
//                                   )
//                                 }
//                               >
//                                 <Eye className="mr-2 size-4" />
//                                 View Details
//                               </DropdownMenuItem>

//                               <DropdownMenuItem
//                                 onClick={() =>
//                                   router.push(
//                                     `/super-admin/maintenance-records/${record.id}/edit`,
//                                   )
//                                 }
//                               >
//                                 <Pencil className="mr-2 size-4" />
//                                 Edit Record
//                               </DropdownMenuItem>

//                               <DropdownMenuSeparator />

//                               <DropdownMenuItem
//                                 className="text-destructive focus:text-destructive"
//                                 onClick={() =>
//                                   setDeleteTarget(record)
//                                 }
//                               >
//                                 <Trash2 className="mr-2 size-4" />
//                                 Delete Record
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}

//           {/* Pagination */}
//           {!isPending && !isError && (
//             <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
//               <p className="text-sm text-muted-foreground">
//                 Showing{" "}
//                 {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
//                 {"–"}
//                 {Math.min(page * PAGE_SIZE, total)} of {total} records
//               </p>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={page <= 1 || isFetching}
//                   onClick={() =>
//                     setPage((current) => Math.max(1, current - 1))
//                   }
//                 >
//                   <ChevronLeft className="mr-1 size-4" />
//                   Previous
//                 </Button>

//                 <span className="min-w-20 text-center text-sm">
//                   Page {page} of {totalPages}
//                 </span>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   disabled={page >= totalPages || isFetching}
//                   onClick={() =>
//                     setPage((current) =>
//                       Math.min(totalPages, current + 1),
//                     )
//                   }
//                 >
//                   Next
//                   <ChevronRight className="ml-1 size-4" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Delete confirmation */}
//       <AlertDialog
//         open={Boolean(deleteTarget)}
//         onOpenChange={(open) => {
//           if (!open && !deleteMutation.isPending) {
//             setDeleteTarget(null);
//           }
//         }}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               Delete maintenance record?
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               This will attempt to delete the maintenance record for
//               {" "}
//               <span className="font-medium">
//                 {deleteTarget?.issue}
//               </span>
//               . This action cannot be undone. Records associated with
//               payments or other protected data may be rejected by the
//               backend.
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={deleteMutation.isPending}>
//               Cancel
//             </AlertDialogCancel>

//             <AlertDialogAction
//               disabled={deleteMutation.isPending}
//               onClick={(event) => {
//                 event.preventDefault();
//                 handleDelete();
//               }}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {deleteMutation.isPending && (
//                 <Loader2 className="mr-2 size-4 animate-spin" />
//               )}
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
