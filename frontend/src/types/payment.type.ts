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