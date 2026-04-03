// Re-export shared types for local convenience (optional)
export * from "../shared/types";

export type UsersTableQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
};
