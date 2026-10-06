import { Brand } from "./brand.type";

export type AssetCondition =
  | "NEW"
  | "GOOD"
  | "FAIR"
  | "POOR"
  | "DAMAGED";

export type AssetStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "UNDER_MAINTENANCE"
  | "LOST"
  | "DAMAGED"
  | "RETIRED"
  | "DISPOSED";
export interface Asset {
  id: string;
  assetTag: string;
  name: string;

  categoryId: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };

  brand: string;
  model: string;
  serialNumber: string;
  description?: string;

  purchasePrice: number;
  purchaseDate: string;
  warrantyExpiry: string;

  condition: string;
  status: string;
  location: string;

  imageUrl?: string;
  assignedTo?: {
    id: string;
    name: string;
    email?: string | null;
  } | null;

  createdAt: string;
  updatedAt: string;

  vendorId: string;
  vendor?: {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
    contactPerson?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateAssetPayload {
  name?: string;
  assetTag?: string;
  categoryId?: string;
  vendorId?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  description?: string;
  status?: string;
  condition?: string;
  location?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  warrantyExpiry?: string;
}


export interface CreateAssetPayload {
  assetTag: string;
  name: string;
  categoryId: string;
  brand: string;
  model: string;
  serialNumber: string;
  description?: string;
  purchasePrice: number;
  purchaseDate: string;
  warrantyExpiry: string;
  condition?: AssetCondition;
  status?: AssetStatus;
  location?: string;
  vendorId?: string;
}