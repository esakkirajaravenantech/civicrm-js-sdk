import { AxiosInstance } from "axios";
import { GetListOptions, EntityResponse } from "./types";

/**
 * Entity CRUD operations module for CiviCRM
 * Provides methods for interacting with CiviCRM entities
 */
export class CiviCRMEntity {
  private axiosInstance: AxiosInstance;
  private readonly apiV3Path = "/sites/all/modules/civicrm/extern/rest.php";

  /**
   * Creates a new CiviCRMEntity instance
   * @param axiosInstance - Configured axios instance
   */
  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  /**
   * Get a single entity by ID
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param id - Entity ID
   * @param params - Additional parameters
   * @returns Promise resolving to entity data
   */
  public async get<T = any>(entity: string, id: number | string, params?: Record<string, any>): Promise<T> {
    const requestParams = {
      entity,
      action: "get",
      json: JSON.stringify({
        sequential: 1,
        id,
        ...params,
      }),
    };

    const response = await this.axiosInstance.get<EntityResponse<T>>(this.apiV3Path, {
      params: requestParams,
    });

    if (response.data.values && response.data.values.length > 0) {
      return response.data.values[0];
    }

    throw new Error(`${entity} with ID ${id} not found`);
  }

  /**
   * Get a list of entities with optional filters and pagination
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param options - Query options including filters, pagination, and sorting
   * @returns Promise resolving to array of entities
   */
  public async getList<T = any>(entity: string, options: GetListOptions = {}): Promise<T[]> {
    const { filters = {}, fields, limit, offset, sort, sequential = 1 } = options;

    const queryData: any = {
      sequential,
      ...filters,
    };

    if (fields && fields.length > 0) {
      queryData.return = fields;
    }

    if (limit !== undefined) {
      queryData.options = queryData.options || {};
      queryData.options.limit = limit;
    }

    if (offset !== undefined) {
      queryData.options = queryData.options || {};
      queryData.options.offset = offset;
    }

    if (sort) {
      queryData.options = queryData.options || {};
      queryData.options.sort = sort;
    }

    const requestParams = {
      entity,
      action: "get",
      json: JSON.stringify(queryData),
    };

    const response = await this.axiosInstance.get<EntityResponse<T>>(this.apiV3Path, {
      params: requestParams,
    });

    return response.data.values || [];
  }

  /**
   * Create a new entity
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param data - Entity data
   * @returns Promise resolving to created entity
   */
  public async create<T = any>(entity: string, data: Record<string, any>): Promise<T> {
    const requestParams = {
      entity,
      action: "create",
      json: JSON.stringify(data),
    };

    const response = await this.axiosInstance.post<EntityResponse<T>>(this.apiV3Path, null, {
      params: requestParams,
    });

    if (response.data.values && response.data.values.length > 0) {
      return response.data.values[0];
    }

    throw new Error(`Failed to create ${entity}`);
  }

  /**
   * Update an existing entity
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param id - Entity ID
   * @param data - Updated entity data
   * @returns Promise resolving to updated entity
   */
  public async update<T = any>(entity: string, id: number | string, data: Record<string, any>): Promise<T> {
    const updateData = {
      id,
      ...data,
    };

    const requestParams = {
      entity,
      action: "create",
      json: JSON.stringify(updateData),
    };

    const response = await this.axiosInstance.post<EntityResponse<T>>(this.apiV3Path, null, {
      params: requestParams,
    });

    if (response.data.values && response.data.values.length > 0) {
      return response.data.values[0];
    }

    throw new Error(`Failed to update ${entity} with ID ${id}`);
  }

  /**
   * Delete an entity
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param id - Entity ID
   * @returns Promise resolving to deletion result
   */
  public async delete(entity: string, id: number | string): Promise<boolean> {
    const requestParams = {
      entity,
      action: "delete",
      json: JSON.stringify({ id }),
    };

    const response = await this.axiosInstance.post(this.apiV3Path, null, {
      params: requestParams,
    });

    return response.data.is_error === 0;
  }

  /**
   * Get count of entities matching filters
   * @param entity - Entity name (e.g., 'Contact', 'Activity')
   * @param filters - Filter criteria
   * @returns Promise resolving to count
   */
  public async getCount(entity: string, filters?: Record<string, any>): Promise<number> {
    const requestParams = {
      entity,
      action: "getcount",
      json: JSON.stringify(filters || {}),
    };

    const response = await this.axiosInstance.get(this.apiV3Path, {
      params: requestParams,
    });

    return response.data.result || 0;
  }
}
