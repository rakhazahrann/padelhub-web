export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};
