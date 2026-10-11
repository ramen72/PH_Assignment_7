
// "use client";

// import { createAssetAssignment, deleteAssetAssignment, getAllAssetAssignments, getSingleAssetAssignment, returnAssetAssignment, updateAssetAssignment } from "@/api";
// import type { AssetAssignment, AssetAssignmentFilters, AssetAssignmentListResponse, CreateAssetAssignmentPayload, ReturnAssetAssignmentPayload, UpdateAssetAssignmentPayload } from "@/types";
// import {
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";


// export const assetAssignmentKeys = {
//   all: ["asset-assignments"] as const,
//   lists: () => [...assetAssignmentKeys.all, "list"] as const,
//   list: (filters: AssetAssignmentFilters) =>
//     [...assetAssignmentKeys.lists(), filters] as const,
//   details: () => [...assetAssignmentKeys.all, "detail"] as const,
//   detail: (id: string) =>
//     [...assetAssignmentKeys.details(), id] as const,
// };

// export const useGetAllAssetAssignments = (
//   filters: AssetAssignmentFilters = {},
// ) => {
//   return useQuery({
//     queryKey: assetAssignmentKeys.list(filters),
//     queryFn: () =>
//       getAllAssetAssignments(filters) as Promise<AssetAssignmentListResponse>,
//     placeholderData: (previousData) => previousData,
//   });
// };

// export const useGetSingleAssetAssignment = (id: string) => {
//   return useQuery({
//     queryKey: assetAssignmentKeys.detail(id),
//     queryFn: () =>
//       getSingleAssetAssignment(id) as Promise<{
//         success: boolean;
//         data: AssetAssignment;
//       }>,
//     enabled: Boolean(id),
//   });
// };

// export const useCreateAssetAssignment = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: CreateAssetAssignmentPayload) =>
//       createAssetAssignment(payload),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: assetAssignmentKeys.all,
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["assets"],
//       });
//     },
//   });
// };

// export const useReturnAssetAssignment = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: ReturnAssetAssignmentPayload;
//     }) => returnAssetAssignment(id, payload),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: assetAssignmentKeys.all,
//       });

//       queryClient.invalidateQueries({
//         queryKey: ["assets"],
//       });
//     },
//   });
// };

// export const useUpdateAssetAssignment = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: UpdateAssetAssignmentPayload;
//     }) => updateAssetAssignment(id, payload),

//     onSuccess: (_data, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: assetAssignmentKeys.all,
//       });

//       queryClient.invalidateQueries({
//         queryKey: assetAssignmentKeys.detail(variables.id),
//       });
//     },
//   });
// };

// export const useDeleteAssetAssignment = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => deleteAssetAssignment(id),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: assetAssignmentKeys.all,
//       });
//     },
//   });
// };



import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAssetAssignment,
  deleteAssetAssignment,
  getAllAssetAssignments,
  getAssetAssignmentById,
  returnAssetAssignment,
  updateAssetAssignment,
} from "@/api";

import type {
  AssetAssignmentFilterParams,
  CreateAssetAssignmentPayload,
  ReturnAssetAssignmentPayload,
  UpdateAssetAssignmentPayload,
} from "@/types";

export const useGetAllAssetAssignments = (
  params?: AssetAssignmentFilterParams,
) => {
  return useQuery({
    queryKey: ["asset-assignments", params],
    queryFn: () => getAllAssetAssignments(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAssetAssignmentById = (id?: string) => {
  return useQuery({
    queryKey: ["asset-assignment", id],
    queryFn: () => getAssetAssignmentById(id as string),
    enabled: Boolean(id),
  });
};

export const useCreateAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssetAssignmentPayload) =>
      createAssetAssignment(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },
  });
};

export const useReturnAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReturnAssetAssignmentPayload;
    }) => returnAssetAssignment(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["asset-assignment", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },
  });
};

export const useUpdateAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAssetAssignmentPayload;
    }) => updateAssetAssignment(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["asset-assignment", variables.id],
      });
    },
  });
};

export const useDeleteAssetAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAssetAssignment(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset-assignments"],
      });
    },
  });
};
