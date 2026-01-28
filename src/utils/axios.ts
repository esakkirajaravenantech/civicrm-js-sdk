import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CiviCRMConfig, CiviCRMError } from '../types';

/**
 * Create a configured Axios instance for CiviCRM API calls
 */
export function createAxiosClient(config: CiviCRMConfig): AxiosInstance {
  const baseURL = config.baseUrl.replace(/\/+$/, '');
  
  const axiosConfig: AxiosRequestConfig = {
    baseURL,
    timeout: config.timeout ?? 30000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...config.customHeaders,
    },
    withCredentials: false,
    validateStatus: () => true,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  };

  const instance = axios.create(axiosConfig);

  // Request interceptor to add auth params
  instance.interceptors.request.use((reqConfig) => {
    // Add API key and site key to params
    const params = reqConfig.params || {};
    params.api_key = config.apiKey;
    params.key = config.siteKey;
    reqConfig.params = params;
    return reqConfig;
  });

  return instance;
}

/**
 * Parse CiviCRM error from response
 */
export function parseError(error: any, defaultMessage: string): CiviCRMError {
  if (error.response) {
    const data = error.response.data;
    return {
      httpStatus: error.response.status,
      httpStatusText: error.response.statusText,
      message: data?.error_message || data?.message || defaultMessage,
      error_code: data?.error_code,
      error_message: data?.error_message,
      is_error: 1,
      details: data,
    };
  }
  
  return {
    message: error?.message || defaultMessage,
    is_error: 1,
  };
}
