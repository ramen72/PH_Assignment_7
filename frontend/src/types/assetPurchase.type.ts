export interface AssetPurchasePayload {
  assetId: string;
  vendorId: string;
  invoiceNumber: string;
  quantity: number;
  unitPrice: number;
  purchaseDate: string,
  paymentStatus: string;
  invoiceUrl: string;
  remarks?: string;
  page?: number;
  limit?: number;
}

export interface AssetPurchaseFilterParams {
  searchTerm?: string;
  assetId?: string;
  assetTag?: string;
  vendorId?: string;
  invoiceNumber?: string;
  quantity?: number;
  unitPrice?: number;
  purchaseDate?: string;
  paymentStatus?: string;
  invoiceUrl?: string;
  remarks?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}