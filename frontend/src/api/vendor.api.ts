import apiClient from "@/lib/apiClient";
import type { ApiResponse, UpdateVendorPayload, VendorPayload, VendorResponse } from "@/types";

// Get All Vendors
export const getAllVendors = () => {
  return apiClient(`/vendors`, {
    method: "GET",
  });
};

export const getSingleVendor = (id: string) => {
  return apiClient(`/vendors/${id}`, {
    method: "GET",
  }) as Promise<ApiResponse<VendorResponse>>;
};

export const createVendor = (data: VendorPayload) => {
  return apiClient("/vendors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const updateVendor = (
  id: string,
  data: UpdateVendorPayload,
) => {
  return apiClient(`/vendors/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteVendor = (id: string) => {
  return apiClient(`/vendors/${id}`, {
    method: "DELETE",
  });
};

export const activateVendor = (id: string) => {
  return apiClient(`/vendors/${id}/activate`, {
    method: "PATCH",
  });
};

export const deactivateVendor = (id: string) => {
  return apiClient(`/vendors/${id}/deactivate`, {
    method: "PATCH",
  });
};
