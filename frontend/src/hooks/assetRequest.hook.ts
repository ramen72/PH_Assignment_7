"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AssetRequestFilterParams, AssetRequestPayload, RejectAssetRequestPayload, UpdateAssetRequestPayload } from "@/types";
import { approveAssetRequest, cancelAssetRequest, createAssetRequest, deleteAssetRequestById, getAllAssetRequests, getMyAssetRequests, getSingleAssetRequestById, rejectAssetRequest, updateAssetRequest } from "@/api";
import { RejectAssetRequestInput } from "@/validation";


export const assetRequestKeys = {
  all: ["asset-requests"] as const,

  lists: () => [...assetRequestKeys.all, "list"] as const,

  list: (params?: AssetRequestFilterParams) =>
    [...assetRequestKeys.lists(), params] as const,

  mine: (params?: AssetRequestFilterParams) =>
    [...assetRequestKeys.all, "mine", params] as const,

  details: () => [...assetRequestKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...assetRequestKeys.details(), id] as const,
};

export function useCreateAssetRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssetRequestPayload) =>createAssetRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: assetRequestKeys.all,
      });
    },
  });
}

export function useGetAllAssetRequests(
  params?: AssetRequestFilterParams,
) {
  return useQuery({
    queryKey: assetRequestKeys.list(params),
    queryFn: () => getAllAssetRequests(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetMyAssetRequests(
  params?: AssetRequestFilterParams,
) {
  return useQuery({
    queryKey: assetRequestKeys.mine(params),
    queryFn: () => getMyAssetRequests(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetSingleAssetRequestById(id: string) {
  return useQuery({
    queryKey: assetRequestKeys.detail(id),
    queryFn: () => getSingleAssetRequestById(id),
    enabled: Boolean(id),
  });
}


export function useUpdateAssetRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAssetRequestPayload;
    }) => updateAssetRequest(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: assetRequestKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: assetRequestKeys.detail(variables.id),
        }),
      ]);
    },
  });
}

// export function useApproveAssetRequest() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) =>
//       approveAssetRequest(id),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: assetRequestKeys.all,
//       });
//     },
//   });
// }

// export function useCancelAssetRequest() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) =>
//       cancelAssetRequest(id),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: assetRequestKeys.all,
//       });
//     },
//   });
// }

// export function useRejectAssetRequest() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: RejectAssetRequestPayload;
//     }) => rejectAssetRequest(id, payload),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: assetRequestKeys.all,
//       });
//     },
//   });
// }

// export function useDeleteAssetRequestById() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) =>
//       deleteAssetRequestById(id),

//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: assetRequestKeys.all,
//       });
//     },
//   });
// }

export function useAssetRequestAction() {
  const queryClient = useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey: assetRequestKeys.all,
    });

  return {
    cancel: useMutation({
      mutationFn: (id: string) => cancelAssetRequest(id),
      onSuccess: refresh,
    }),
    approve: useMutation({
      mutationFn: (id: string) => approveAssetRequest(id),
      onSuccess: refresh,
    }),
    reject: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: RejectAssetRequestInput;
      }) => rejectAssetRequest(id, payload),
      onSuccess: refresh,
    }),
    delete: useMutation({
      mutationFn: (id: string) => deleteAssetRequestById(id),
      onSuccess: refresh,
    }),
  };
}