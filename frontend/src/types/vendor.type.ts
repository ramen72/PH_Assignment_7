export interface VendorResponse {
  id: string
  name: string
  companyName: string
  email: string
  phone: string
  address: string
  website: string
  contactPerson: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    assets: number;
    purchases: number;
    maintenanceRecords: number;
  };
}

export interface VendorPayload {
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  contactPerson?: string;
  isActive?: boolean;
}

export type UpdateVendorPayload = Partial<VendorPayload>;
