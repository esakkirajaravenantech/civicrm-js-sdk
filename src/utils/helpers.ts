/**
 * Formats filter parameters for CiviCRM API calls
 * @param filters - Object containing filter key-value pairs
 * @returns Formatted filter object
 */
export function formatFilters(filters?: Record<string, any>): Record<string, any> {
  if (!filters) {
    return {};
  }
  return filters;
}

/**
 * Formats sort parameters for CiviCRM API calls
 * @param sort - Sort string or object
 * @returns Formatted sort parameter
 */
export function formatSort(sort?: string | Record<string, "ASC" | "DESC">): string | Record<string, "ASC" | "DESC"> {
  if (!sort) {
    return {};
  }
  return sort;
}

/**
 * Builds query parameters for API calls
 * @param params - Parameters object
 * @returns Formatted query parameters
 */
export function buildQueryParams(params: Record<string, any>): Record<string, any> {
  const queryParams: Record<string, any> = {};

  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null) {
      queryParams[key] = value;
    }
  });

  return queryParams;
}

/**
 * Extracts error message from error object
 * @param error - Error object
 * @returns Error message string
 */
export function extractErrorMessage(error: any): string {
  if (error.response && error.response.data) {
    if (error.response.data.error_message) {
      return error.response.data.error_message;
    }
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  return error.message || "An unknown error occurred";
}
