export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface AssetCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assets: number;
    assetRequests: number;
  };
}

export interface AssetCategoryPayload {
  name: string;
  description?: string;
}

export interface AssetCategoryResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AssetCategory[];
}

