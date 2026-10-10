import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBkashPayment, getAllPayments, getSingleAssetPurchaseById, getSinglePaymentByAssetPurchaseId, getSinglePaymentsById } from "@/api";
import { PaymentQueryParams } from "@/types";

export const useCreateBkashPayment  = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchaseId: string) => createBkashPayment(purchaseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset-purchases"],
      });
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },
  });
};

// Get all Payment
export const useGetAllPayment = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () => getAllPayments()
  });
};


// Get single Payment By Id
export const useGetSinglePaymentsById = (paymentId?: string) => {
  return useQuery({
    queryKey: ["payment", paymentId],

    queryFn: () => getSinglePaymentsById(paymentId as string),

    enabled: Boolean(paymentId),
  });
};

// Get single asset
export const useGetSinglePaymentByAssetPurchaseId = (assetPurchaseId?: string) => {
  return useQuery({
    queryKey: ["payment", assetPurchaseId],

    queryFn: () => getSinglePaymentByAssetPurchaseId(assetPurchaseId as string),

    enabled: Boolean(assetPurchaseId),
  });
};