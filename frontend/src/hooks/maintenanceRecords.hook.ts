import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createMaintenanceRecord,
  deleteMaintenanceRecord,
  getAllMaintenanceRecords,
  getSingleMaintenanceRecord,
  updateMaintenanceRecord,
} from "@/api/maintenanceRecords.api";

import type {
  MaintenanceRecordFilterParams,
  MaintenanceRecordPayload,
  UpdateMaintenanceRecordPayload,
} from "@/types/maintenanceRecords.type";

// Query keys
export const maintenanceRecordKeys = {
  all: ["maintenanceRecords"] as const,

  lists: () => [...maintenanceRecordKeys.all, "list"] as const,

  list: (params: MaintenanceRecordFilterParams) =>
    [...maintenanceRecordKeys.lists(), params] as const,

  details: () => [...maintenanceRecordKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...maintenanceRecordKeys.details(), id] as const,
};

// Get all maintenance records
export const useGetAllMaintenanceRecords = (
  params: MaintenanceRecordFilterParams = {},
) => {
  return useQuery({
    queryKey: maintenanceRecordKeys.list(params),
    queryFn: () => getAllMaintenanceRecords(params),
  });
};

// Get a single maintenance record
export const useGetSingleMaintenanceRecord = (id: string) => {
  return useQuery({
    queryKey: maintenanceRecordKeys.detail(id),
    queryFn: () => getSingleMaintenanceRecord(id),
    enabled: Boolean(id),
  });
};

// Create maintenance record
export const useCreateMaintenanceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MaintenanceRecordPayload) =>
      createMaintenanceRecord(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: maintenanceRecordKeys.all,
      });
    },
  });
};

// Update maintenance record
export const useUpdateMaintenanceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMaintenanceRecordPayload;
    }) => updateMaintenanceRecord(id, payload),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: maintenanceRecordKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: maintenanceRecordKeys.detail(variables.id),
        }),
      ]);
    },
  });
};

// Delete maintenance record
export const useDeleteMaintenanceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMaintenanceRecord(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: maintenanceRecordKeys.all,
      });
    },
  });
};