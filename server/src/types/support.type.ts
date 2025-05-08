// save model
export type SaveFiltersType = {
  page?: number;
  limit?: number;
  targetType?: "user" | "company" | "school" | "group" | "post" | "job";
  start?: Date;
  end?: Date;
};

// report model
export type ReportFiltersType = {
  page?: number;
  limit?: number;
  start?: Date;
  end?: Date;
  targetType?:
    | "user"
    | "post"
    | "comment"
    | "video"
    | "company"
    | "group"
    | "school"
    | "job"
    | "other";
  subject?: string;
  status?: "pending" | "reviewed" | "dismissed";
};

// Help
export type HelpFiltersType = {
  page: number;
  limit: number;
  start?: Date;
  end?: Date;
  status?: "pending" | "reviewed" | "resolved";
};
