import type { UserRole, UserStatus } from "./user.type";

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