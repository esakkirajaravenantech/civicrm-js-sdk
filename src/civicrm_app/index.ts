import { AxiosInstance } from "axios";
import { createAxiosInstance } from "../utils/axios";
import { TokenParams } from "./types";
import { CiviCRMAuth } from "../auth";
import { CiviCRMEntity } from "../entity";
import { CiviCRMAPI } from "../api";
import { CiviCRMFile } from "../file";

/**
 * Main CiviCRM SDK class
 * Provides access to all CiviCRM API functionality
 */
export class CiviCRMApp {
  public url: string;
  public siteKey: string;
  public name: string;
  public axiosInstance: AxiosInstance;
  public useToken: boolean;
  public tokenFn?: () => Promise<string> | string;
  public tokenType: "Bearer" | "token";

  private authInstance?: CiviCRMAuth;
  private entityInstance?: CiviCRMEntity;
  private apiInstance?: CiviCRMAPI;
  private fileInstance?: CiviCRMFile;

  /**
   * Creates a new CiviCRMApp instance
   * @param url - Base URL of the CiviCRM installation
   * @param siteKey - CiviCRM site key for authentication
   * @param tokenParams - Optional token authentication parameters
   * @param name - Optional name for this instance
   * @param customHeaders - Optional custom headers to include in requests
   */
  constructor(
    url: string,
    siteKey: string,
    tokenParams?: TokenParams,
    name?: string,
    customHeaders?: Record<string, string>
  ) {
    this.url = url;
    this.siteKey = siteKey;
    this.name = name || "CiviCRM";
    this.useToken = tokenParams?.useToken || false;
    this.tokenFn = tokenParams?.token;
    this.tokenType = tokenParams?.tokenType || "Bearer";

    // Create axios instance with configuration
    this.axiosInstance = createAxiosInstance({
      baseURL: url,
      siteKey,
      useToken: this.useToken,
      tokenFn: this.tokenFn,
      tokenType: this.tokenType,
      customHeaders,
    });
  }

  /**
   * Get authentication module instance
   * @returns CiviCRMAuth instance
   */
  public auth(): CiviCRMAuth {
    if (!this.authInstance) {
      this.authInstance = new CiviCRMAuth(this.axiosInstance);
    }
    return this.authInstance;
  }

  /**
   * Get entity CRUD operations module instance
   * @returns CiviCRMEntity instance
   */
  public entity(): CiviCRMEntity {
    if (!this.entityInstance) {
      this.entityInstance = new CiviCRMEntity(this.axiosInstance);
    }
    return this.entityInstance;
  }

  /**
   * Get API module instance for custom API calls
   * @returns CiviCRMAPI instance
   */
  public api(): CiviCRMAPI {
    if (!this.apiInstance) {
      this.apiInstance = new CiviCRMAPI(this.axiosInstance, this.url);
    }
    return this.apiInstance;
  }

  /**
   * Get file operations module instance
   * @returns CiviCRMFile instance
   */
  public file(): CiviCRMFile {
    if (!this.fileInstance) {
      this.fileInstance = new CiviCRMFile(this.axiosInstance);
    }
    return this.fileInstance;
  }
}
