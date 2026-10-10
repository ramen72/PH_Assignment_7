import apiClient from "@/lib/apiClient";

export const createBkashPayment = (purchaseId: string) => {
  return apiClient(`/bkash/create/${purchaseId}`, {
    method: "POST",
    // body: JSON.stringify(payload),
  });
};


// Get All Payment
export const getAllPayments = () => {
  return apiClient(`/bkash/allPayment`, {
    method: "GET",
  });
};

// Get Single Payment By Id
export const getSinglePaymentsById = (paymentId:string) => {
  return apiClient(`/bkash/singlePayment/${paymentId}`, {
    method: "GET",
  });
};

// Get single asset Purchase
export const getSinglePaymentByAssetPurchaseId = (assetPurchaseId: string) => {
  return apiClient(`/bkash/${assetPurchaseId}`, {
    method: "GET",
  });
};