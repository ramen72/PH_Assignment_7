export interface BkashPayButtonProps {
  purchaseId: string;
  disabled?: boolean;
  className?: string;
}


export interface BkashPaymentData {
  paymentId: string;
  paymentUrl: string;
  transactionId: string;
  amount: string | number;
}

export interface BkashPaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: BkashPaymentData;
}
// ===============================

export type PaymentProvider = "BKASH" | "STRIPE" | "NAGAD" | "ROCKET";

export interface PaymentQueryParams {
  page?: number;
  limit?: number;
}


export interface Payment {
  id: string;
  userId: string;
  purchaseId: string;
  amount: string | number;
  currency: string;
  provider: PaymentProvider | string;
  transactionId: string | null;
  paymentStatus: string;
  paymentUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: Payment[];
  meta?: PaymentMeta;
}
