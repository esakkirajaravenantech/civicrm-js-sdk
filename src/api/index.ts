import { AxiosInstance } from "axios";
import { APIv3Params, APIv4Params, APIResponse } from "./types";

/**
 * API module for custom CiviCRM API calls
 * Supports both API v3 and v4
 */
export class CiviCRMAPI {
  private axiosInstance: AxiosInstance;
  private readonly apiV3Path = "/sites/all/modules/civicrm/extern/rest.php";
  private readonly apiV4Path = "/civicrm/ajax/api4";

  /**
   * Creates a new CiviCRMAPI instance
   * @param axiosInstance - Configured axios instance
   * @param _baseURL - Base URL of the CiviCRM installation (reserved for future use)
   */
  constructor(axiosInstance: AxiosInstance, _baseURL: string) {
    this.axiosInstance = axiosInstance;
    // baseURL is available if needed in the future
  }

  /**
   * Make an API v3 call
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param action - Action to perform (e.g., 'get', 'create', 'delete')
   * @param params - Parameters for the API call
   * @returns Promise resolving to API response
   */
  public async callV3<T = any>(entity: string, action: string, params: APIv3Params = {}): Promise<APIResponse<T>> {
    const requestParams = {
      entity,
      action,
      json: JSON.stringify(params),
    };

    const response = await this.axiosInstance.get<APIResponse<T>>(this.apiV3Path, {
      params: requestParams,
    });

    return response.data;
  }

  /**
   * Make an API v4 call
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param action - Action to perform (e.g., 'get', 'create', 'delete')
   * @param params - Parameters for the API call
   * @returns Promise resolving to API response
   */
  public async callV4<T = any>(entity: string, action: string, params: APIv4Params = {}): Promise<APIResponse<T>> {
    const requestData = {
      params,
    };

    const response = await this.axiosInstance.post<APIResponse<T>>(
      `${this.apiV4Path}/${entity}/${action}`,
      requestData
    );

    return response.data;
  }

  /**
   * Make a generic GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Promise resolving to response data
   */
  public async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, {
      params,
    });

    return response.data;
  }

  /**
   * Make a generic POST request
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @returns Promise resolving to response data
   */
  public async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);

    return response.data;
  }
}
