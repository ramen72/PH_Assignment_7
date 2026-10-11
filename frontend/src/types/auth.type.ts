import type { AssetCondition } from "./asset.type";
import type { UserRole, UserStatus } from "./user.type";

export interface AuthResponse {
  success: boolean
  statusCode: number
  message: string
  data: User[]
}
export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  profileImage: string
  phone?: string
  department?: string
  designation?: string
  role: string
  status: string
  authProvider: string
  googleId: string
  isActive: boolean
  needPasswordChange: boolean
  isDeleted: boolean
  deletedAt: string
  createdAt: string
  updatedAt: string
  profile?: Profile
  assetAssignments: AssetAssignment[]
  assignedAssets: AssignedAsset[]
  assetRequests: []
  reviewedAssetRequests: []
  assetPurchases: AssetPurchase[]
  payments: Payment[]
  maintenanceRecordsReported: []
  notifications: []
  auditLogs: []
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  phone?: string;
  department?:string;
  designation?: string;
  role?: UserRole;
  status:UserStatus;
  emailVerified:boolean;
  needPasswordChange:boolean;
  profile?: {
    bio?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    dateOfBirth?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    joiningDate?: string;
    employeeId?: string;
  };
}


export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

// ==========================

export interface Profile {
  id: string
  userId: string
  bio: string
  address: string
  city: string
  postalCode: string
  country: string
  dateOfBirth: string
  emergencyContactName: string
  emergencyContactPhone: string
  joiningDate: string
  employeeId: string
  createdAt: string
  updatedAt: string
}

export interface AssetAssignment {
  id: string
  assetId: string
  employeeId: string
  assignedById: string
  assignedAt: string
  returnedAt: string
  returnCondition: AssetCondition
  remarks: string
  createdAt: string
  updatedAt: string
}

export interface AssignedAsset {
  id: string
  assetId: string
  employeeId: string
  assignedById: string
  assignedAt: string
  returnedAt: string
  returnCondition: AssetCondition
  remarks: string
  createdAt: string
  updatedAt: string
}

export interface AssetPurchase {
  id: string
  assetId: string
  vendorId: string
  createdById: string
  invoiceNumber: string
  quantity: number
  unitPrice: string
  totalAmount: string
  purchaseDate: string
  paymentStatus: string
  invoiceUrl?: string
  remarks?: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  userId: string
  purchaseId: string
  amount: string
  currency: string
  provider: string
  transactionId: string
  paymentStatus: string
  paymentUrl?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}
