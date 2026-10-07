import apiClient from "@/lib/apiClient";

export const createBkashPayment = (purchaseId: string) => {
  return apiClient(`/bkash/create/${purchaseId}`, {
    method: "POST",
    // body: JSON.stringify(payload),
  });
};