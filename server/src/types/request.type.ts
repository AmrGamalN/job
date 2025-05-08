import { CompanyUserRoleType, UserRoleType } from "./role.type";

export type UserRequestType = {
  userId: string;
  email: string;
  userName?: string;
  profileLink?: string;
  phoneNumber?: string;
  role: UserRoleType;
  name?: string;
  profileImage?: string;
  dateToJoin?: string;
  lastSeen: string;
  sign_with?: string;
  emailVerified?: boolean;
  visibility?: string;
  company: {
    companyId: string;
    memberId: string;
    companyRole: CompanyUserRoleType;
    status:
      | "active"
      | "inactive"
      | "pending"
      | "rejected"
      | "banned"
      | "no_company";
  };
};
