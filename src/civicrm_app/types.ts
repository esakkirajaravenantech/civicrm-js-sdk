/**
 * Error response from CiviCRM API
 */
export interface CiviCRMError {
  is_error: number;
  error_message: string;
  error_code?: string | number;
}

/**
 * Token parameters for authentication
 */
export interface TokenParams {
  useToken?: boolean;
  token?: () => Promise<string> | string;
  tokenType?: "Bearer" | "token";
}

/**
 * Configuration for CiviCRMApp initialization
 */
export interface CiviCRMAppConfig {
  url: string;
  siteKey: string;
  name?: string;
  tokenParams?: TokenParams;
  customHeaders?: Record<string, string>;
}

/**
 * Response format from CiviCRM API
 */
export interface CiviCRMResponse<T = any> {
  is_error: number;
  version: number;
  count?: number;
  values?: T;
  id?: number;
}
