import { UserRequestType } from "../types/request.type";

export const generateSort = <T extends Record<string, any>>(queries: T) => {
  const sort: Record<string, number> = {};
  if (queries.salary) sort["salary"] = Number(queries.salary);
  if (queries.views) sort["viewsCount"] = Number(queries.views);
  if (queries.createdAt) sort["createdAt"] = Number(queries.createdAt);
  return sort;
};

export const generateFilters = <T extends Record<string, any>>(
  queries: T,
  role?: "admin" | "manager" | "user",
  userInfo?: UserRequestType
) => {
  const filtersOption = Object.keys(queries) as string[];
  let filters: Record<any, any> = {};

  if (role) {
    filters = filterCompany(queries, role);
  }

  if (userInfo) {
    filters = filterFaq(queries, userInfo);
  }

  if (queries.start && queries.end) {
    filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
  }

  if (queries.tags) {
    filters["tags"] = { $in: [queries.tags] };
  }

  if (queries.salaryMin && queries.salaryMax) {
    filters["salary.min"] = {
      $gte: queries.salaryMin,
    };
    filters["salary.max"] = {
      $lte: queries.salaryMax,
    };
  }

  for (const key of filtersOption) {
    if (
      queries[key] &&
      typeof queries[key] == "string" &&
      key !== "page" &&
      key !== "limit"
    )
      filters[key] = queries[key];
  }

  return filters;
};

// Using in company model
const filterCompany = (
  queries: Record<string, any>,
  role?: "admin" | "manager" | "user"
) => {
  let filters: Record<any, any> = {};

  if (role === "admin" || role === "manager") {
    if (queries.status) filters["status"] = queries.status;
    if (queries.start && queries.end) {
      filters["createdAt"] = { $gte: queries.start, $lte: queries.end };
    }
  }

  if (role == "user") {
    filters["status"] = { status: "active" };
  }

  return filters;
};

// Using in faq model
const filterFaq = (queries: Record<string, any>, user: UserRequestType) => {
  let filters: Record<any, any> = {};
  const isViewerOrMember =
    user.role === "user" &&
    (user.company.companyRole === "viewer" ||
      user.company.companyRole === "member");
  if (isViewerOrMember) {
    filters["userId"] = user.userId;
  } else {
    filters["companyId"] = user.company.companyId;
    if (queries.userType) {
      filters["userType"] = queries.userType;
    }
  }
  return filters;
};
