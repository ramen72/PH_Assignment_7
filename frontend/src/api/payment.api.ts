import apiClient from "@/lib/apiClient";

export const createBkashPayment = (purchaseId: string) => {
  return apiClient(`/bkash/create/${purchaseId}`, {
    method: "POST",
    // body: JSON.stringify(payload),
  });
};


// Get single asset Purchase
export const getSinglePaymentByAssetPurchaseId = (assetPurchaseId: string) => {
  return apiClient(`/bkash/${assetPurchaseId}`, {
    method: "GET",
  });
};