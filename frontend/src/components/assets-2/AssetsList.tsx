"use client";

import { useState } from "react";

// import AssetFilters from "./asset-filters";
// import AssetTable from "./asset-table";

// import { useGetAllAssets } from "@/hooks/use-assets";
import type { Asset } from "@/types";
import { useGetAllAssets } from "@/hooks";
import AssetFilters from "./AssetFilters";
import AssetTable from "./AssetsTable";
import useDebounce from "@/hooks/debounce.hook";

const AssetList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [condition, setCondition] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 1000);

  const {
    data,
    isPending,
    isFetching,
    isError,
  } = useGetAllAssets({
    searchTerm:debouncedSearch,
    status: status === "all" ? "" : status,
    condition: condition === "all" ? "" : condition,
    categoryId: categoryId === "all" ? "" : categoryId,
    location,
  });
 console.log(data)
  const handleReset = () => {
    setSearchTerm("");
    setStatus("");
    setCondition("");
    setCategoryId("");
    setLocation("");
  };

  if (isPending) {
    return <div>Loading assets...</div>;
  }

  if (isError) {
    return <div>Failed to load assets.</div>;
  }

  const assets = data?.data ?? [];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Assets
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage and monitor all company assets.
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          {data?.meta?.total ?? 0} assets
        </div>
      </div>

      {/* Filters */}
      <AssetFilters
        searchTerm={searchTerm}
        status={status}
        condition={condition}
        categoryId={categoryId}
        categories={data?.meta?.categories ?? []}
        location={location}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatus}
        onConditionChange={setCondition}
        onCategoryChange={setCategoryId}
        onLocationChange={setLocation}
        onReset={handleReset}
      />

      {/* Loading indicator while filtering */}
      {isFetching && !isPending && (
        <div className="text-sm text-muted-foreground">
          Updating assets...
        </div>
      )}

      {/* Table */}
      <AssetTable
        assets={assets}
        onView={(asset:Asset) => {
          console.log("View:", asset);
        }}
        onEdit={(asset:Asset) => {
          console.log("Edit:", asset);
        }}
        onDelete={(asset:Asset) => {
          console.log("Delete:", asset);
        }}
      />
    </div>
  );
};

export default AssetList;

// "use client";
// import { useGetAllAssets } from "@/hooks/assets.hook";
// import AssetTable from "./AssetsTable";

// const AssetList = () => {
//   const { data, isLoading, isError, error } = useGetAllAssets();

//   if (isLoading) {
//     return <div>Loading assets...</div>;
//   }

//   if (isError) {
//     return <div>Error: {error.message}</div>;
//   }

//   console.log("Assets:", data);

//   return (
//     <div>
//       <AssetTable assets={data.data}/>
//     </div>
//   );
// };

// export default AssetList;

/*
[
    {
        "id": "525dc21a-d7f0-4a3f-8d3c-83dfac5f9f82",
        "assetTag": "LAP-000352",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G52",
        "serialNumber": "HP440-G352",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-01T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-10-03T05:09:25.792Z",
        "updatedAt": "2026-10-03T05:09:25.792Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "8353c4a3-3bb1-4106-a096-65e7b53ca362",
        "assetTag": "LAP-00031",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G6",
        "serialNumber": "HP440-G51",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-01T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-16T05:21:22.746Z",
        "updatedAt": "2026-09-16T05:21:22.746Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "cc28e3e4-4548-4e31-8ce4-e7c98b8913d6",
        "assetTag": "LAP-00027",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G90",
        "serialNumber": "HP440-G490",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-14T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-14T04:57:01.738Z",
        "updatedAt": "2026-09-14T04:57:18.455Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "c48f55bd-2de0-42d5-8d69-c2f6408b0b83",
        "assetTag": "LAP-00026",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G89",
        "serialNumber": "HP440-G409",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-14T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "POOR",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-14T04:53:37.189Z",
        "updatedAt": "2026-09-14T09:41:48.215Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "4291f247-97c4-44be-8b25-a95855b20db0",
        "assetTag": "LAP-00025",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G88",
        "serialNumber": "HP440-G408",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-14T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-14T04:44:29.938Z",
        "updatedAt": "2026-09-14T04:44:46.634Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "39916363-6ca1-407d-826e-2440e5dc278d",
        "assetTag": "LAP-00024",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G87",
        "serialNumber": "HP440-G407",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-14T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-14T04:38:03.973Z",
        "updatedAt": "2026-09-14T04:39:51.747Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "de8cc6f4-fc5b-4370-81ab-842d7681de79",
        "assetTag": "LAP-00023",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G7",
        "serialNumber": "HP440-G406",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-14T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-14T04:32:27.994Z",
        "updatedAt": "2026-09-14T04:32:56.351Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "9bfba05e-00ce-459b-953d-18ce384676fc",
        "assetTag": "LAP-00021",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G5",
        "serialNumber": "HP440-G405",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-14T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "ASSIGNED",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-14T03:24:25.357Z",
        "updatedAt": "2026-09-14T08:10:59.807Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "94cb52c4-227c-4fe3-94a0-1252b048c374",
        "assetTag": "LAP-00020",
        "name": "HP Laptop",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "HP",
        "model": "HP Probook 440 G4",
        "serialNumber": "HP440-G40",
        "description": "Company laptop for software development",
        "purchasePrice": "500",
        "purchaseDate": "2026-09-16T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-13T10:13:02.959Z",
        "updatedAt": "2026-09-16T12:45:54.880Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    },
    {
        "id": "3e2c5066-206f-4186-b8eb-4602c9b52391",
        "assetTag": "LAP-00096",
        "name": "Dell Latitude 5526987",
        "categoryId": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
        "brand": "Dell",
        "model": "Latitude 5520",
        "serialNumber": "DL5520-ABC-00845",
        "description": "Company laptop for software development",
        "purchasePrice": "85000",
        "purchaseDate": "2026-09-01T00:00:00.000Z",
        "warrantyExpiry": "2029-09-01T00:00:00.000Z",
        "condition": "NEW",
        "status": "AVAILABLE",
        "location": "Dhaka Office",
        "imageUrl": "https://example.com/laptop.jpg",
        "createdAt": "2026-09-12T05:41:58.104Z",
        "updatedAt": "2026-09-12T05:41:58.104Z",
        "vendorId": "6b731a4e-8e74-4717-92c2-c24a312349bb",
        "category": {
            "id": "080613a0-fcb7-4bd8-ae57-7fc62e84e946",
            "name": "Laptop",
            "description": "Laptop and notebook computers",
            "createdAt": "2026-09-10T02:41:13.927Z",
            "updatedAt": "2026-09-10T02:41:13.927Z"
        },
        "vendor": {
            "id": "6b731a4e-8e74-4717-92c2-c24a312349bb",
            "name": "Tech Solutions",
            "companyName": "Tech Solutions Bangladesh Ltd.",
            "email": "info@techsolutions.com",
            "phone": "01712345678",
            "address": "Dhaka, Bangladesh",
            "website": "https://techsolutions.com",
            "contactPerson": "John Doe",
            "isActive": true,
            "createdAt": "2026-09-10T03:34:15.384Z",
            "updatedAt": "2026-09-10T03:34:15.384Z"
        }
    }
]
*/