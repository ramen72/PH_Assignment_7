export type AssetRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface AssetRequestPayload {
  categoryId: string;
  requestedAssetId?: string;
  quantity: number;
  reason: string;
}

export interface UpdateAssetRequestPayload {
  categoryId?: string;
  requestedAssetId?: string;
  quantity?: number;
  reason?: string;
}

export interface RejectAssetRequestPayload {
  rejectionReason: string;
}

export interface AssetRequestFilterParams {
  searchTerm?: string;
  employeeId?: string;
  categoryId?: string;
  requestedAssetId?: string;
  status?: AssetRequestStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AssetRequestResponse {
  id: string;
  employeeId: string;
  categoryId: string;
  requestedAssetId: string | null;
  quantity: number;
  reason: string;
  status: AssetRequestStatus;
  reviewedById: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    name: string;
    email: string;
    department?: string | null;
    designation?: string | null;
  };
  category?: {
    id: string;
    name: string;
    description?: string | null;
  };
  requestedAsset?: {
    id: string;
    assetTag: string;
    name: string;
    brand?: string | null;
    model?: string | null;
  } | null;
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AssetRequestUser {
  id: string;
  name: string;
  email: string;
  department?: string | null;
  designation?: string | null;
}

export interface AssetRequestCategory {
  id: string;
  name: string;
  description?: string | null;
}

export interface RequestedAsset {
  id: string;
  assetTag: string;
  name: string;
  categoryId: string;
  brand?: string | null;
  model?: string | null;
  condition?: string;
  status?: string;
}