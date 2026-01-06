import { AxiosInstance } from "axios";
import { LoginCredentials, User, TokenValidation } from "./types";

/**
 * Authentication module for CiviCRM
 * Handles login, logout, and user information
 */
export class CiviCRMAuth {
  private axiosInstance: AxiosInstance;
  private currentUser?: User;
  private apiKey?: string;

  /**
   * Creates a new CiviCRMAuth instance
   * @param axiosInstance - Configured axios instance
   */
  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  /**
   * Login with API key authentication
   * @param credentials - Login credentials containing API key
   * @returns Promise resolving to user information
   */
  public async login(credentials: LoginCredentials): Promise<User> {
    try {
      this.apiKey = credentials.apiKey;

      // Add API key to axios instance params
      this.axiosInstance.defaults.params = {
        ...this.axiosInstance.defaults.params,
        api_key: this.apiKey,
        key: credentials.key || credentials.apiKey,
      };

      // Verify login by getting current user
      const user = await this.getCurrentUser();
      this.currentUser = user;
      return user;
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Logout and clear authentication
   */
  public logout(): void {
    this.currentUser = undefined;
    this.apiKey = undefined;

    // Clear API key from axios instance
    if (this.axiosInstance.defaults.params) {
      delete this.axiosInstance.defaults.params.api_key;
      delete this.axiosInstance.defaults.params.key;
    }
  }

  /**
   * Get current authenticated user information
   * @returns Promise resolving to user information
   */
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await this.axiosInstance.get("/sites/all/modules/civicrm/extern/rest.php", {
        params: {
          entity: "Contact",
          action: "get",
          json: JSON.stringify({
            sequential: 1,
            id: "user_contact_id",
            return: ["id", "contact_id", "display_name", "email"],
          }),
        },
      });

      if (response.data && response.data.values && response.data.values.length > 0) {
        return response.data.values[0];
      }

      throw new Error("Unable to retrieve user information");
    } catch (error: any) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }
  }

  /**
   * Validate the current authentication token
   * @returns Promise resolving to validation result
   */
  public async validateToken(): Promise<TokenValidation> {
    try {
      const user = await this.getCurrentUser();
      return {
        valid: true,
        user,
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * Get the currently authenticated user (cached)
   * @returns Current user or undefined if not authenticated
   */
  public getUser(): User | undefined {
    return this.currentUser;
  }
}
