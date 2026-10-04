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

  purchasePrice: string;
  purchaseDate: string;
  warrantyExpiry: string;

  condition: string;
  status: string;
  location: string;

  imageUrl?: string;

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

export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Vendor {
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
}
