/**
 * Login credentials for API key authentication
 */
export interface LoginCredentials {
  apiKey: string;
  key?: string;
}

/**
 * User information returned from authentication
 */
export interface User {
  id: number;
  contact_id: number;
  name?: string;
  email?: string;
  [key: string]: any;
}

/**
 * Token validation response
 */
export interface TokenValidation {
  valid: boolean;
  user?: User;
  error?: string;
}
