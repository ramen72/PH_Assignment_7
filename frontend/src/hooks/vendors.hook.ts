import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateVendor, createVendor, deactivateVendor, deleteVendor, getAllVendors, getSingleVendor, updateVendor } from "@/api";
import type { UpdateVendorPayload, VendorPayload } from "@/types";

// Get All Vendors
export const useGetAllVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => getAllVendors()
  });
};


export const vendorKeys = {
  all: ["vendors"] as const,
  detail: (id: string) => ["vendor", id] as const,
};

export const useGetSingleVendor = (id: string) => {
  return useQuery({
    queryKey: vendorKeys.detail(id),
    queryFn: () => getSingleVendor(id),
    enabled: Boolean(id),
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VendorPayload) =>
      createVendor(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vendorKeys.all,
      });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateVendorPayload;
    }) => updateVendor(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vendorKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: vendorKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVendor(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vendorKeys.all,
      });
    },
  });
};

export const useActivateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateVendor(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: vendorKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: vendorKeys.detail(id),
      });
    },
  });
};

export const useDeactivateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateVendor(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: vendorKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: vendorKeys.detail(id),
      });
    },
  });
};
