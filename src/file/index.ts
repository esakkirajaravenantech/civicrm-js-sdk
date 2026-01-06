import { AxiosInstance } from "axios";
import { FileUploadArgs, ProgressCallback, FileUploadResponse, FileDownloadResponse } from "./types";

/**
 * File operations module for CiviCRM
 * Handles file uploads and downloads
 */
export class CiviCRMFile {
  private axiosInstance: AxiosInstance;
  private readonly apiV3Path = "/sites/all/modules/civicrm/extern/rest.php";

  /**
   * Creates a new CiviCRMFile instance
   * @param axiosInstance - Configured axios instance
   */
  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  /**
   * Upload a file to CiviCRM
   * @param file - File to upload (File or Blob object)
   * @param fileArgs - Additional file arguments
   * @param onProgress - Optional progress callback
   * @returns Promise resolving to file upload response
   */
  public async uploadFile(
    file: File | Blob,
    fileArgs: FileUploadArgs = {},
    onProgress?: ProgressCallback
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    // Add file arguments
    Object.keys(fileArgs).forEach(key => {
      formData.append(key, String(fileArgs[key]));
    });

    const config: any = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    // Add progress tracking if callback provided
    if (onProgress) {
      config.onUploadProgress = (progressEvent: any) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      };
    }

    const response = await this.axiosInstance.post<FileUploadResponse>(
      `${this.apiV3Path}?entity=Attachment&action=create`,
      formData,
      config
    );

    return response.data;
  }

  /**
   * Download a file from CiviCRM
   * @param fileId - ID of the file to download
   * @returns Promise resolving to file download response
   */
  public async downloadFile(fileId: number | string): Promise<FileDownloadResponse> {
    const response = await this.axiosInstance.get(`${this.apiV3Path}?entity=Attachment&action=get&id=${fileId}`, {
      responseType: "blob",
    });

    // Extract filename from content-disposition header if available
    const contentDisposition = response.headers["content-disposition"];
    let filename = `file_${fileId}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    return {
      data: response.data,
      filename,
      mimeType: response.headers["content-type"] || "application/octet-stream",
    };
  }

  /**
   * Delete a file from CiviCRM
   * @param fileId - ID of the file to delete
   * @returns Promise resolving to deletion result
   */
  public async deleteFile(fileId: number | string): Promise<boolean> {
    const requestParams = {
      entity: "Attachment",
      action: "delete",
      json: JSON.stringify({ id: fileId }),
    };

    const response = await this.axiosInstance.post(this.apiV3Path, null, {
      params: requestParams,
    });

    return response.data.is_error === 0;
  }

  /**
   * Get file information
   * @param fileId - ID of the file
   * @returns Promise resolving to file information
   */
  public async getFileInfo(fileId: number | string): Promise<any> {
    const requestParams = {
      entity: "Attachment",
      action: "get",
      json: JSON.stringify({ id: fileId, sequential: 1 }),
    };

    const response = await this.axiosInstance.get(this.apiV3Path, {
      params: requestParams,
    });

    if (response.data.values && response.data.values.length > 0) {
      return response.data.values[0];
    }

    throw new Error(`File with ID ${fileId} not found`);
  }
}
