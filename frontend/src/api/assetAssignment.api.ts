
// // import { apiClient } from "@/lib/api-client";

// import apiClient from "@/lib/apiClient";
// import type { AssetAssignmentFilters, CreateAssetAssignmentPayload, ReturnAssetAssignmentPayload, UpdateAssetAssignmentPayload } from "@/types";

// // import type {
// //   AssetAssignmentFilters,
// //   CreateAssetAssignmentPayload,
// //   ReturnAssetAssignmentPayload,
// //   UpdateAssetAssignmentPayload,
// // } from "@/types/assetAssignment.types";

// export const createAssetAssignment = (
//   payload: CreateAssetAssignmentPayload,
// ) => {
//   return apiClient("/assetAssignments", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
// };

// export const getAllAssetAssignments = (
//   filters: AssetAssignmentFilters = {},
// ) => {
//   const params = new URLSearchParams();

//   Object.entries(filters).forEach(([key, value]) => {
//     if (value !== undefined && value !== "") {
//       params.set(key, String(value));
//     }
//   });

//   const query = params.toString();

//   return apiClient(
//     `/assetAssignments${query ? `?${query}` : ""}`,
//     {
//       method: "GET",
//     },
//   );
// };

// export const getSingleAssetAssignment = (id: string) => {
//   return apiClient(`/assetAssignments/${id}`, {
//     method: "GET",
//   });
// };

// export const returnAssetAssignment = (
//   id: string,
//   payload: ReturnAssetAssignmentPayload,
// ) => {
//   return apiClient(`/assetAssignments/return/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
// };

// export const updateAssetAssignment = (
//   id: string,
//   payload: UpdateAssetAssignmentPayload,
// ) => {
//   return apiClient(`/assetAssignments/update/${id}`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });
// };

// export const deleteAssetAssignment = (id: string) => {
//   return apiClient(`/assetAssignments/delete/${id}`, {
//     method: "DELETE",
//   });
// };



import apiClient from "@/lib/apiClient";

import type {
  AssetAssignmentFilterParams,
  CreateAssetAssignmentPayload,
  ReturnAssetAssignmentPayload,
  UpdateAssetAssignmentPayload,
} from "@/types";

export const getAllAssetAssignments = (
  params?: AssetAssignmentFilterParams,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return apiClient(
    `/assetAssignments${query ? `?${query}` : ""}`,
    { method: "GET" },
  );
};

export const getAssetAssignmentById = (id: string) => {
  return apiClient(`/assetAssignments/${id}`, {
    method: "GET",
  });
};

export const createAssetAssignment = (
  payload: CreateAssetAssignmentPayload,
) => {
  return apiClient("/assetAssignments", {
    method: "POST",
    body: payload,
  });
};

export const returnAssetAssignment = (
  id: string,
  payload: ReturnAssetAssignmentPayload,
) => {
  return apiClient(`/assetAssignments/return/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

export const updateAssetAssignment = (
  id: string,
  payload: UpdateAssetAssignmentPayload,
) => {
  return apiClient(`/assetAssignments/update/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

export const deleteAssetAssignment = (id: string) => {
  return apiClient(`/assetAssignments/delete/${id}`, {
    method: "DELETE",
  });
};
