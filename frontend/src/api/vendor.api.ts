import apiClient from "@/lib/apiClient";

// Get All Vendors
export const getAllVendors = () => {
  return apiClient(`/vendors`, {
    method: "GET",
  });
};