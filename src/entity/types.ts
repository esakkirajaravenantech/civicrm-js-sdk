/**
 * Options for getting a list of entities
 */
export interface GetListOptions {
  filters?: Record<string, any>;
  fields?: string[];
  limit?: number;
  offset?: number;
  sort?: string | Record<string, "ASC" | "DESC">;
  sequential?: boolean;
}

/**
 * Response from entity operations
 */
export interface EntityResponse<T = any> {
  is_error: number;
  version: number;
  count: number;
  values: T[];
  id?: number;
}

/**
 * Options for counting entities
 */
export interface CountOptions {
  filters?: Record<string, any>;
}
