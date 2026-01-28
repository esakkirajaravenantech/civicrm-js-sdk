import { AxiosInstance } from 'axios';
import { createAxiosClient, parseError } from '../utils';
import {
  CiviCRMConfig,
  CiviCRMError,
  ApiV3Response,
  ApiV4Response,
  GetListParams,
  AnyEntity,
} from '../types';

/**
 * Main CiviCRM SDK class
 * Provides unified access to CiviCRM API v3 and v4
 * 
 * @example
 * ```typescript
 * const civicrm = new CiviCRM({
 *   baseUrl: 'https://your-civicrm.org',
 *   apiKey: 'your-api-key',
 *   siteKey: 'your-site-key',
 * });
 * 
 * // Get contacts
 * const contacts = await civicrm.Contact.get({ limit: 10 });
 * 
 * // Create contact
 * const newContact = await civicrm.Contact.create({
 *   contact_type: 'Individual',
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   email: 'john@example.com',
 * });
 * ```
 */
export class CiviCRM {
  private config: CiviCRMConfig;
  private axios: AxiosInstance;
  private apiVersion: 3 | 4;

  // Entity accessors - will be dynamically populated
  public Contact: EntityAPI;
  public Email: EntityAPI;
  public Phone: EntityAPI;
  public Address: EntityAPI;
  public Membership: EntityAPI;
  public Activity: EntityAPI;
  public Contribution: EntityAPI;
  public Participant: EntityAPI;
  public Event: EntityAPI;
  public Relationship: EntityAPI;
  public Note: EntityAPI;
  public Group: EntityAPI;
  public GroupContact: EntityAPI;
  public Tag: EntityAPI;
  public EntityTag: EntityAPI;
  public CustomField: EntityAPI;
  public CustomGroup: EntityAPI;
  public OptionValue: EntityAPI;
  public OptionGroup: EntityAPI;
  public UFMatch: EntityAPI;
  public LineItem: EntityAPI;
  public MembershipType: EntityAPI;
  public MembershipStatus: EntityAPI;
  public ContributionRecur: EntityAPI;
  public PriceSet: EntityAPI;
  public PriceField: EntityAPI;
  public PriceFieldValue: EntityAPI;

  constructor(config: CiviCRMConfig) {
    this.config = config;
    this.apiVersion = config.apiVersion ?? 4;
    this.axios = createAxiosClient(config);

    // Initialize all entity APIs
    this.Contact = this.createEntityAPI('Contact');
    this.Email = this.createEntityAPI('Email');
    this.Phone = this.createEntityAPI('Phone');
    this.Address = this.createEntityAPI('Address');
    this.Membership = this.createEntityAPI('Membership');
    this.Activity = this.createEntityAPI('Activity');
    this.Contribution = this.createEntityAPI('Contribution');
    this.Participant = this.createEntityAPI('Participant');
    this.Event = this.createEntityAPI('Event');
    this.Relationship = this.createEntityAPI('Relationship');
    this.Note = this.createEntityAPI('Note');
    this.Group = this.createEntityAPI('Group');
    this.GroupContact = this.createEntityAPI('GroupContact');
    this.Tag = this.createEntityAPI('Tag');
    this.EntityTag = this.createEntityAPI('EntityTag');
    this.CustomField = this.createEntityAPI('CustomField');
    this.CustomGroup = this.createEntityAPI('CustomGroup');
    this.OptionValue = this.createEntityAPI('OptionValue');
    this.OptionGroup = this.createEntityAPI('OptionGroup');
    this.UFMatch = this.createEntityAPI('UFMatch');
    this.LineItem = this.createEntityAPI('LineItem');
    this.MembershipType = this.createEntityAPI('MembershipType');
    this.MembershipStatus = this.createEntityAPI('MembershipStatus');
    this.ContributionRecur = this.createEntityAPI('ContributionRecur');
    this.PriceSet = this.createEntityAPI('PriceSet');
    this.PriceField = this.createEntityAPI('PriceField');
    this.PriceFieldValue = this.createEntityAPI('PriceFieldValue');
  }

  /**
   * Create entity API wrapper for a given entity
   */
  private createEntityAPI(entityName: string): EntityAPI {
    return new EntityAPI(entityName, this);
  }

  /**
   * Get a dynamic entity API for entities not predefined
   * @example civicrm.entity('Campaign').get({ limit: 10 })
   */
  public entity(entityName: string): EntityAPI {
    return new EntityAPI(entityName, this);
  }

  /**
   * Make a raw API v3 call
   */
  async callV3<T = any>(
    entity: string,
    action: string,
    params: Record<string, any> = {}
  ): Promise<ApiV3Response<T>> {
    const apiPath = '/civicrm/extern/rest.php';
    
    try {
      const response = await this.axios.post(apiPath, null, {
        params: {
          entity,
          action,
          json: JSON.stringify({ sequential: 1, ...params }),
        },
      });

      const data = typeof response.data === 'string' 
        ? JSON.parse(response.data) 
        : response.data;

      if (data.is_error === 1) {
        throw {
          message: data.error_message || 'CiviCRM API error',
          error_code: data.error_code,
          is_error: 1,
          details: data,
        } as CiviCRMError;
      }

      return data;
    } catch (error: any) {
      if (error.is_error) throw error;
      throw parseError(error, `Error calling ${entity}.${action}`);
    }
  }

  /**
   * Make a raw API v4 call
   */
  async callV4<T = any>(
    entity: string,
    action: string,
    params: Record<string, any> = {}
  ): Promise<ApiV4Response<T>> {
    const apiPath = `/civicrm/ajax/api4/${encodeURIComponent(entity)}/${encodeURIComponent(action)}`;
    
    try {
      const form = new URLSearchParams();
      form.set('params', JSON.stringify(params));

      const response = await this.axios.post<string>(apiPath, form.toString(), {
        responseType: 'text',
        transformResponse: [(d) => d],
      });

      const text = typeof response.data === 'string' ? response.data : '';
      
      if (!text) {
        throw {
          message: 'Empty response from CiviCRM API4',
          is_error: 1,
        } as CiviCRMError;
      }

      const data = JSON.parse(text);

      if (data.is_error || data.error_message || data.error_code) {
        throw {
          message: data.error_message || 'CiviCRM API4 error',
          error_code: data.error_code,
          is_error: 1,
          details: data,
        } as CiviCRMError;
      }

      return data;
    } catch (error: any) {
      if (error.is_error) throw error;
      throw parseError(error, `Error calling ${entity}.${action}`);
    }
  }

  /**
   * Make an API call using the configured API version
   */
  async call<T = any>(
    entity: string,
    action: string,
    params: Record<string, any> = {}
  ): Promise<T[]> {
    if (this.apiVersion === 3) {
      const response = await this.callV3<T>(entity, action, params);
      // Normalize v3 response to array
      if (Array.isArray(response.values)) {
        return response.values;
      }
      return Object.values(response.values);
    } else {
      const response = await this.callV4<T>(entity, action, params);
      return response.values || [];
    }
  }

  /**
   * Get the configured API version
   */
  getApiVersion(): 3 | 4 {
    return this.apiVersion;
  }

  /**
   * Set API version for subsequent calls
   */
  setApiVersion(version: 3 | 4): void {
    this.apiVersion = version;
  }
}

/**
 * Entity API wrapper - provides CRUD operations for a specific entity
 */
export class EntityAPI {
  private entityName: string;
  private client: CiviCRM;

  constructor(entityName: string, client: CiviCRM) {
    this.entityName = entityName;
    this.client = client;
  }

  /**
   * Get records from this entity
   * 
   * @example
   * // Get all contacts
   * const contacts = await civicrm.Contact.get();
   * 
   * // Get with filters (API v4 style)
   * const contacts = await civicrm.Contact.get({
   *   where: [['contact_type', '=', 'Individual']],
   *   select: ['id', 'display_name', 'email'],
   *   limit: 10,
   *   orderBy: { created_date: 'DESC' },
   * });
   * 
   * // Simple filters for API v3 style
   * const contacts = await civicrm.Contact.get({
   *   contact_type: 'Individual',
   *   limit: 10,
   * });
   */
  async get<T = AnyEntity>(params: GetListParams | Record<string, any> = {}): Promise<T[]> {
    const apiVersion = this.client.getApiVersion();
    
    if (apiVersion === 4) {
      return this.client.call<T>(this.entityName, 'get', params);
    } else {
      // For v3, convert GetListParams to v3 format
      const v3Params = this.convertToV3Params(params);
      return this.client.call<T>(this.entityName, 'get', v3Params);
    }
  }

  /**
   * Get a single record by ID
   * 
   * @example
   * const contact = await civicrm.Contact.getOne(123);
   * const contact = await civicrm.Contact.getOne(123, { select: ['id', 'display_name'] });
   */
  async getOne<T = AnyEntity>(id: number | string, params: Record<string, any> = {}): Promise<T | null> {
    const apiVersion = this.client.getApiVersion();
    
    let results: T[];
    if (apiVersion === 4) {
      results = await this.client.call<T>(this.entityName, 'get', {
        ...params,
        where: [['id', '=', id]],
        limit: 1,
      });
    } else {
      results = await this.client.call<T>(this.entityName, 'get', {
        ...params,
        id,
        options: { limit: 1 },
      });
    }
    
    return results[0] || null;
  }

  /**
   * Create a new record
   * 
   * @example
   * const contact = await civicrm.Contact.create({
   *   contact_type: 'Individual',
   *   first_name: 'John',
   *   last_name: 'Doe',
   * });
   */
  async create<T = AnyEntity>(data: Record<string, any>): Promise<T> {
    const apiVersion = this.client.getApiVersion();
    
    if (apiVersion === 4) {
      const results = await this.client.call<T>(this.entityName, 'create', {
        values: data,
      });
      return results[0];
    } else {
      const results = await this.client.call<T>(this.entityName, 'create', data);
      return results[0];
    }
  }

  /**
   * Update an existing record
   * 
   * @example
   * const contact = await civicrm.Contact.update(123, {
   *   first_name: 'Jane',
   * });
   */
  async update<T = AnyEntity>(id: number | string, data: Record<string, any>): Promise<T> {
    const apiVersion = this.client.getApiVersion();
    
    if (apiVersion === 4) {
      const results = await this.client.call<T>(this.entityName, 'update', {
        where: [['id', '=', id]],
        values: data,
      });
      return results[0];
    } else {
      const results = await this.client.call<T>(this.entityName, 'create', {
        ...data,
        id,
      });
      return results[0];
    }
  }

  /**
   * Save a record (create or update based on id presence)
   * 
   * @example
   * // Create new
   * const contact = await civicrm.Contact.save({ first_name: 'John' });
   * 
   * // Update existing
   * const contact = await civicrm.Contact.save({ id: 123, first_name: 'Jane' });
   */
  async save<T = AnyEntity>(data: Record<string, any>): Promise<T> {
    const apiVersion = this.client.getApiVersion();
    
    if (apiVersion === 4) {
      const results = await this.client.call<T>(this.entityName, 'save', {
        records: [data],
      });
      return results[0];
    } else {
      const results = await this.client.call<T>(this.entityName, 'create', data);
      return results[0];
    }
  }

  /**
   * Delete a record by ID
   * 
   * @example
   * await civicrm.Contact.delete(123);
   */
  async delete(id: number | string): Promise<boolean> {
    const apiVersion = this.client.getApiVersion();
    
    if (apiVersion === 4) {
      await this.client.call(this.entityName, 'delete', {
        where: [['id', '=', id]],
      });
    } else {
      await this.client.call(this.entityName, 'delete', { id });
    }
    return true;
  }

  /**
   * Get count of records
   * 
   * @example
   * const count = await civicrm.Contact.getCount({ contact_type: 'Individual' });
   */
  async getCount(params: Record<string, any> = {}): Promise<number> {
    const apiVersion = this.client.getApiVersion();
    
    if (apiVersion === 4) {
      const response = await this.client.callV4(this.entityName, 'get', {
        ...params,
        select: ['row_count'],
      });
      return response.count || response.countMatched || 0;
    } else {
      const v3Params = this.convertToV3Params(params);
      const response = await this.client.callV3(this.entityName, 'getcount', v3Params);
      return typeof response === 'number' ? response : (response as any).result || 0;
    }
  }

  /**
   * Check if record(s) exist
   * 
   * @example
   * const exists = await civicrm.Contact.exists({ email: 'john@example.com' });
   */
  async exists(params: Record<string, any>): Promise<boolean> {
    const count = await this.getCount(params);
    return count > 0;
  }

  /**
   * Get the first matching record
   * 
   * @example
   * const contact = await civicrm.Contact.first({ contact_type: 'Individual' });
   */
  async first<T = AnyEntity>(params: GetListParams | Record<string, any> = {}): Promise<T | null> {
    const results = await this.get<T>({ ...params, limit: 1 });
    return results[0] || null;
  }

  /**
   * Custom action call on this entity
   * 
   * @example
   * const result = await civicrm.Contact.action('getfields', { api_action: 'create' });
   */
  async action<T = any>(actionName: string, params: Record<string, any> = {}): Promise<T[]> {
    return this.client.call<T>(this.entityName, actionName, params);
  }

  /**
   * Get entity fields metadata
   */
  async getFields(params: Record<string, any> = {}): Promise<any[]> {
    return this.action('getfields', params);
  }

  /**
   * Convert GetListParams to API v3 format
   */
  private convertToV3Params(params: GetListParams | Record<string, any>): Record<string, any> {
    const v3Params: Record<string, any> = {};
    
    // Handle select
    if (params.select) {
      v3Params.return = params.select;
    }
    
    // Handle where clauses
    if (params.where && Array.isArray(params.where)) {
      for (const clause of params.where) {
        if (clause.length >= 3) {
          const [field, op, value] = clause;
          if (op === '=') {
            v3Params[field] = value;
          } else {
            v3Params[field] = { [op]: value };
          }
        }
      }
    }
    
    // Handle options
    const options: Record<string, any> = {};
    if (params.limit !== undefined) options.limit = params.limit;
    if (params.offset !== undefined) options.offset = params.offset;
    if (params.orderBy) {
      const sortParts: string[] = [];
      for (const [field, dir] of Object.entries(params.orderBy)) {
        sortParts.push(`${field} ${dir}`);
      }
      options.sort = sortParts.join(', ');
    }
    
    if (Object.keys(options).length > 0) {
      v3Params.options = options;
    }
    
    // Copy any other params that don't match GetListParams
    for (const [key, value] of Object.entries(params)) {
      if (!['select', 'where', 'limit', 'offset', 'orderBy', 'groupBy', 'having', 'join', 'chain'].includes(key)) {
        v3Params[key] = value;
      }
    }
    
    return v3Params;
  }
}

export default CiviCRM;
