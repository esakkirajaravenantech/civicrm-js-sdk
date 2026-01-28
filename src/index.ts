/**
 * CiviCRM JavaScript SDK
 * 
 * Simple client-side SDK for CiviCRM API v4
 * Works through your existing proxy endpoint (e.g., /api/civicrmv4)
 * 
 * @example
 * ```typescript
 * import { CiviCRM } from 'civicrm-js-sdk';
 * 
 * // Initialize with your proxy endpoint
 * const civicrm = new CiviCRM('/api/civicrmv4');
 * 
 * // Simple get
 * const contacts = await civicrm.get('Contact', {
 *   select: ['id', 'display_name', 'email_primary.email'],
 *   where: [['contact_type', '=', 'Individual']],
 *   limit: 10,
 * });
 * 
 * // With joins (like your members list)
 * const members = await civicrm.get('Contact', {
 *   select: ['id', 'display_name', 'first_name'],
 *   where: [
 *     ['is_deleted', '=', 0],
 *     ['membership.status_id', 'IN', [1, 2]],
 *   ],
 *   join: [['Membership AS membership', 'INNER', ['id', '=', 'membership.contact_id']]],
 *   orderBy: { first_name: 'ASC' },
 *   limit: 25,
 * });
 * ```
 */

export type WhereClause = [string, string, any] | [string, [string, string, any][]];
export type JoinClause = [string, 'INNER' | 'LEFT' | 'RIGHT' | 'EXCLUDE', [string, string, string]];
export type OrderBy = Record<string, 'ASC' | 'DESC'>;

export interface QueryParams {
  /** Fields to select */
  select?: string[];
  /** Where conditions */
  where?: WhereClause[];
  /** Join clauses */
  join?: JoinClause[];
  /** Order by */
  orderBy?: OrderBy;
  /** Group by fields */
  groupBy?: string[];
  /** Limit results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Having clause */
  having?: WhereClause[];
  /** Chain additional API calls */
  chain?: Record<string, any>;
  /** Any additional params */
  [key: string]: any;
}

export interface CreateParams {
  /** Values to create */
  values: Record<string, any>;
  /** Chain additional API calls */
  chain?: Record<string, any>;
}

export interface UpdateParams {
  /** Where conditions to match records */
  where: WhereClause[];
  /** Values to update */
  values: Record<string, any>;
  /** Chain additional API calls */
  chain?: Record<string, any>;
}

export interface DeleteParams {
  /** Where conditions to match records */
  where: WhereClause[];
}

export interface SaveParams {
  /** Records to save (create or update based on id) */
  records: Record<string, any>[];
  /** Match fields for update detection */
  match?: string[];
}

export interface ApiResponse<T = any> {
  values?: T[];
  count?: number;
  countMatched?: number;
  countFetched?: number;
  error?: boolean;
  is_error?: 0 | 1;
  error_message?: string;
  message?: string;
}

export type FetchFunction = typeof fetch;

export interface CiviCRMOptions {
  /** Custom fetch function (useful for SSR with $fetch) */
  fetch?: FetchFunction | any;
}

/**
 * CiviCRM SDK Client
 */
export class CiviCRM {
  private endpoint: string;
  private fetchFn: any;

  /**
   * Create a new CiviCRM client
   * @param endpoint - Your proxy endpoint (e.g., '/api/civicrmv4')
   * @param options - Optional configuration
   */
  constructor(endpoint: string = '/api/civicrmv4', options: CiviCRMOptions = {}) {
    this.endpoint = endpoint;
    this.fetchFn = options.fetch || (typeof $fetch !== 'undefined' ? $fetch : fetch);
  }

  /**
   * Make a raw API call
   */
  async call<T = any>(entity: string, action: string, params: Record<string, any> = {}): Promise<T[]> {
    const response = await this.fetchFn(this.endpoint, {
      method: 'POST',
      body: {
        entity,
        action,
        ...params,
      },
    }) as ApiResponse<T>;

    if (response.error || response.is_error) {
      throw new Error(response.error_message || response.message || 'API Error');
    }

    return Array.isArray(response.values) 
      ? response.values 
      : Object.values(response.values || {});
  }

  /**
   * Get records from an entity
   * 
   * @example
   * // Simple get
   * const contacts = await civicrm.get('Contact', {
   *   select: ['id', 'display_name'],
   *   where: [['contact_type', '=', 'Individual']],
   *   limit: 10,
   * });
   * 
   * // With joins
   * const members = await civicrm.get('Contact', {
   *   select: ['id', 'display_name'],
   *   where: [['membership.status_id', 'IN', [1, 2]]],
   *   join: [['Membership AS membership', 'INNER', ['id', '=', 'membership.contact_id']]],
   * });
   */
  async get<T = any>(entity: string, params: QueryParams = {}): Promise<T[]> {
    return this.call<T>(entity, 'get', params);
  }

  /**
   * Get a single record by ID
   */
  async getOne<T = any>(entity: string, id: number | string, params: Omit<QueryParams, 'where' | 'limit'> = {}): Promise<T | null> {
    const results = await this.get<T>(entity, {
      ...params,
      where: [['id', '=', id]],
      limit: 1,
    });
    return results[0] || null;
  }

  /**
   * Create a new record
   * 
   * @example
   * const contact = await civicrm.create('Contact', {
   *   contact_type: 'Individual',
   *   first_name: 'John',
   *   last_name: 'Doe',
   * });
   */
  async create<T = any>(entity: string, values: Record<string, any>): Promise<T> {
    const results = await this.call<T>(entity, 'create', { values });
    return results[0];
  }

  /**
   * Update records matching conditions
   * 
   * @example
   * await civicrm.update('Contact', {
   *   where: [['id', '=', 123]],
   *   values: { first_name: 'Jane' },
   * });
   */
  async update<T = any>(entity: string, params: UpdateParams): Promise<T[]> {
    return this.call<T>(entity, 'update', params);
  }

  /**
   * Update a single record by ID
   */
  async updateOne<T = any>(entity: string, id: number | string, values: Record<string, any>): Promise<T> {
    const results = await this.update<T>(entity, {
      where: [['id', '=', id]],
      values,
    });
    return results[0];
  }

  /**
   * Save records (create or update based on id/match)
   * 
   * @example
   * const contact = await civicrm.save('Contact', {
   *   contact_type: 'Individual',
   *   first_name: 'John',
   * });
   */
  async save<T = any>(entity: string, record: Record<string, any>): Promise<T> {
    const results = await this.call<T>(entity, 'save', { records: [record] });
    return results[0];
  }

  /**
   * Delete records matching conditions
   */
  async delete(entity: string, params: DeleteParams): Promise<void> {
    await this.call(entity, 'delete', params);
  }

  /**
   * Delete a single record by ID
   */
  async deleteOne(entity: string, id: number | string): Promise<void> {
    await this.delete(entity, { where: [['id', '=', id]] });
  }

  /**
   * Get count of records
   */
  async count(entity: string, params: Omit<QueryParams, 'select' | 'limit' | 'offset'> = {}): Promise<number> {
    const response = await this.fetchFn(this.endpoint, {
      method: 'POST',
      body: {
        entity,
        action: 'get',
        select: ['row_count'],
        ...params,
      },
    }) as ApiResponse;

    return response.countMatched ?? response.count ?? 0;
  }

  /**
   * Check if records exist
   */
  async exists(entity: string, params: Omit<QueryParams, 'select' | 'limit' | 'offset'>): Promise<boolean> {
    const count = await this.count(entity, params);
    return count > 0;
  }

  /**
   * Get the first matching record
   */
  async first<T = any>(entity: string, params: Omit<QueryParams, 'limit'> = {}): Promise<T | null> {
    const results = await this.get<T>(entity, { ...params, limit: 1 });
    return results[0] || null;
  }
}

// Default instance for convenience
let defaultInstance: CiviCRM | null = null;

/**
 * Get or create a default CiviCRM instance
 */
export function useCiviCRM(endpoint?: string): CiviCRM {
  if (!defaultInstance || endpoint) {
    defaultInstance = new CiviCRM(endpoint);
  }
  return defaultInstance;
}

/**
 * Simple function API (like your current civicrmApi)
 * 
 * @example
 * const contacts = await civicrmApi('Contact', 'get', {
 *   select: ['id', 'display_name'],
 *   where: [['contact_type', '=', 'Individual']],
 * });
 */
export async function civicrmApi<T = any>(
  entity: string,
  action: string,
  params: Record<string, any> = {},
  endpoint: string = '/api/civicrmv4'
): Promise<T[]> {
  const civicrm = new CiviCRM(endpoint);
  return civicrm.call<T>(entity, action, params);
}

export default CiviCRM;
