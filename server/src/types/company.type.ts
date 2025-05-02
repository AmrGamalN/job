export type CompanyStatusType =
  | "active"
  | "inactive"
  | "pending"
  | "rejected"
  | "banned";

type CompanyMainType = {
  page: number;
  limit: number;
  start?: Date;
  end?: Date;
};

export type CompanyFiltersType = CompanyMainType & {
  companyName?: string;
  status?: CompanyStatusType;
  tags?: string[];
};

export type DocumentFiltersType = CompanyMainType & {
  type?: string;
  name?: string;
};

export type FaqFiltersType = CompanyMainType & {
  questionType?: string;
  userType?: "user" | "member" | "other";
  department?: string;
  status?: CompanyStatusType;
};

export type FeedbackFiltersType = CompanyMainType & {
  status?: CompanyStatusType;
  companyName?: string;
};

export type MemberFiltersType = CompanyMainType & {
  role?: string;
  name?: string;
  status?: CompanyStatusType;
  position?: string;
  department?: string;
};
