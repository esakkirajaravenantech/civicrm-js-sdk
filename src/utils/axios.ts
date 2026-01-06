import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";

/**
 * Configuration for creating an axios instance
 */
export interface AxiosConfig {
  baseURL: string;
  siteKey: string;
  useToken?: boolean;
  tokenFn?: () => Promise<string> | string;
  tokenType?: "Bearer" | "token";
  customHeaders?: Record<string, string>;
}

/**
 * Creates an axios instance configured for CiviCRM API calls
 * @param config - Configuration object for axios
 * @returns Configured axios instance
 */
export function createAxiosInstance(config: AxiosConfig): AxiosInstance {
  const { baseURL, siteKey, useToken = false, tokenFn, tokenType = "Bearer", customHeaders = {} } = config;

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
  });

  // Request interceptor for authentication
  instance.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      // Add site_key to params
      if (!requestConfig.params) {
        requestConfig.params = {};
      }
      requestConfig.params.site_key = siteKey;

      // Add token authentication if enabled
      if (useToken && tokenFn) {
        const token = await tokenFn();
        if (token) {
          if (tokenType === "Bearer") {
            requestConfig.headers.Authorization = `Bearer ${token}`;
          } else {
            requestConfig.params.token = token;
          }
        }
      }

      return requestConfig;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    response => {
      // Check for CiviCRM API errors
      if (response.data && response.data.is_error) {
        const error: any = new Error(response.data.error_message || "CiviCRM API Error");
        error.civicrmError = true;
        error.errorCode = response.data.error_code;
        error.response = response;
        return Promise.reject(error);
      }
      return response;
    },
    (error: AxiosError) => {
      // Format error message
      if (error.response) {
        const errorData: any = error.response.data;
        if (errorData && errorData.error_message) {
          error.message = errorData.error_message;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
