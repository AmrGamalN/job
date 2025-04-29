export type SaveFiltersType = {
  page: number;
  limit: number;
  targetType?: "user" | "company" | "school" | "group" | "post" | "job";
  start?: Date;
  end?: Date;
};
