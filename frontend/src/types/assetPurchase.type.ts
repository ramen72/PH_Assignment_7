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

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | string;

export interface AssetPurchaseDetails {
  id: string;
  assetId: string;
  vendorId: string;
  createdById: string;
  invoiceNumber: string;
  quantity: number;
  unitPrice: string;
  totalAmount: string;
  purchaseDate: string;
  paymentStatus: PaymentStatus;
  invoiceUrl: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;

  asset: {
    id: string;
    assetTag: string;
    name: string;
    categoryId: string;
    brand: string | null;
    model: string | null;
    serialNumber: string | null;
    description: string | null;
    purchasePrice: string;
    purchaseDate: string;
    warrantyExpiry: string | null;
    condition: string;
    status: string;
    location: string | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    vendorId: string | null;

    category: {
      id: string;
      name: string;
      description: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };

  vendor: {
    id: string;
    name: string;
    companyName: string | null;
    email: string;
    phone: string;
    address: string | null;
    website: string | null;
    contactPerson: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };

  createdBy: {
    id: string;
    name: string;
    email: string;
  };

  payments: {
    id: string;
    userId: string;
    purchaseId: string;
    amount: string;
    currency: string;
    provider: string;
    transactionId: string | null;
    paymentStatus: PaymentStatus;
    paymentUrl: string | null;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
}
