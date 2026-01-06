/**
 * Parameters for API v3 calls
 */
export interface APIv3Params {
  sequential?: boolean;
  [key: string]: any;
}

/**
 * Parameters for API v4 calls
 */
export interface APIv4Params {
  select?: string[];
  where?: [string, string, any][];
  limit?: number;
  offset?: number;
  orderBy?: Record<string, "ASC" | "DESC">;
  [key: string]: any;
}

/**
 * Response from API calls
 */
export interface APIResponse<T = any> {
  is_error?: number;
  version?: number;
  count?: number;
  values?: T;
  [key: string]: any;
}
