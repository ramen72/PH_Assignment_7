import type { AssetCondition } from "./asset.type";


export interface AssignmentAsset {
  id: string;
  assetTag: string;
  name: string;
  brand: string | null;
  model: string | null;
  serialNumber: string | null;
  condition: AssetCondition;
  status: string;
  location: string | null;
}

export interface AssignmentEmployee {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  designation: string | null;
}

export interface AssignmentAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  employeeId: string;
  assignedById: string;
  assignedAt: string;
  returnedAt: string | null;
  returnCondition: AssetCondition | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  asset: AssignmentAsset;
  employee: AssignmentEmployee;
  assignedBy: AssignmentAdmin;
}

export interface CreateAssetAssignmentPayload {
  assetId: string;
  employeeId: string;
  remarks?: string;
}

export interface ReturnAssetAssignmentPayload {
  returnCondition?: AssetCondition;
  remarks?: string;
}

export interface UpdateAssetAssignmentPayload {
  remarks?: string;
}

// AssetAssignmentFilters
export interface AssetAssignmentFilterParams {
  searchTerm?: string;
  assetId?: string;
  employeeId?: string;
  assignedById?: string;
  returned?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "assignedAt" | "returnedAt";
  sortOrder?: "asc" | "desc";
}

export interface AssetAssignmentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
