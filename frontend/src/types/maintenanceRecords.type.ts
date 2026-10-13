export type MaintenanceStatus =
  | "REPORTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  reportedById: string;
  vendorId?: string | null;
  issue: string;
  description?: string | null;
  serviceCost?: number | string | null;
  status: MaintenanceStatus;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  remarks?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Optional related data, when included by the backend
  asset?: {
    id: string;
    assetTag?: string;
    name: string;
  } | null;

  reportedBy?: {
    id: string;
    name: string;
    email?: string;
  } | null;

  vendor?: {
    id: string;
    name: string;
  } | null;
}

export interface MaintenanceRecordPayload {
  assetId: string;
  reportedById: string;
  vendorId?: string | null;
  issue: string;
  description?: string | null;
  serviceCost?: number | string | null;
  status?: MaintenanceStatus;
  startedAt?: string | Date | null;
  completedAt?: string | Date | null;
  remarks?: string | null;
}

export type UpdateMaintenanceRecordPayload =
  Partial<MaintenanceRecordPayload>;

export interface MaintenanceRecordFilterParams {
  searchTerm?: string;
  assetId?: string;
  reportedById?: string;
  vendorId?: string;
  status?: MaintenanceStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface MaintenanceRecordMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MaintenanceRecordListResponse {
  data: MaintenanceRecord[];
  meta?: MaintenanceRecordMeta;
}