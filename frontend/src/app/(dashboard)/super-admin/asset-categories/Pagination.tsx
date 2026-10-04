// "use client"
// import { Field, FieldLabel } from "@/components/ui/field"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// export function PaginationComponent({birds}) {
//     console.log(birds.length)
//   return (
//     <div className="flex items-center justify-between gap-4">
//       <Field orientation="horizontal" className="w-fit">
//         <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
//         <Select defaultValue="25">
//           <SelectTrigger className="w-20" id="select-rows-per-page">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent align="start">
//             <SelectGroup>
//               <SelectItem value="10">10</SelectItem>
//               <SelectItem value="25">25</SelectItem>
//               <SelectItem value="50">50</SelectItem>
//               <SelectItem value="100">100</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </Field>
//       <Pagination className="mx-0 w-auto">
//         {/* <PaginationContent>
//           <PaginationItem>
//             <PaginationPrevious href="#" />
//           </PaginationItem>
//           <PaginationItem>
//             <PaginationNext href="#" />
//           </PaginationItem>
//         </PaginationContent> */}
//         <PaginationContent>
//         <PaginationItem>
//           <PaginationPrevious href="#" />
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationLink href="#">1</PaginationLink>
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationLink href="#" isActive>
//             2
//           </PaginationLink>
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationLink href="#">3</PaginationLink>
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationEllipsis />
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationNext href="#" />
//         </PaginationItem>
//       </PaginationContent>
//       </Pagination>
//     </div>
//   )
// }

"use client";

import { useMemo, useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationIconsOnlyProps<T> {
  data: T[];
}

export function PaginationIconsOnly<T>({
  data,
}: PaginationIconsOnlyProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  
  // Pagination calculation
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  
  // Page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  
  // Items per page change
  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number(value);
    setItemsPerPage(newItemsPerPage);

    // Reset to first page
    setCurrentPage(1);
  };

  
  // Page numbers
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    // If total pages are small
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // First page
    pages.push(1);

    // Left ellipsis
    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    // Middle pages
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    // Last page
    pages.push(totalPages);

    return pages;
  };

  
  // Return
  return (
    <div className="space-y-4">
      {/* Your paginated data */}
      <div className="space-y-2">
        {currentData.map((item, index) => (
          <div
            key={index}
            className="rounded-md border p-3"
          >
            {JSON.stringify(item)}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4">
        {/* Rows per page */}
        <Field
          orientation="horizontal"
          className="w-fit"
        >
          <FieldLabel htmlFor="select-rows-per-page">
            Rows per page
          </FieldLabel>

          <Select
            value={String(itemsPerPage)}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger
              className="w-20"
              id="select-rows-per-page"
            >
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

        {/* Pagination */}
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(event) => {
                      event.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Information */}
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {totalItems === 0
            ? "0 of 0"
            : `${startIndex + 1}-${Math.min(
                endIndex,
                totalItems
              )} of ${totalItems}`}
        </div>
      </div>
    </div>
  );
}
