/**
 * Arguments for file upload
 */
export interface FileUploadArgs {
  entity?: string;
  entity_id?: number;
  description?: string;
  mime_type?: string;
  [key: string]: any;
}

/**
 * Progress callback for file uploads
 */
export type ProgressCallback = (progress: number) => void;

/**
 * File upload response
 */
export interface FileUploadResponse {
  id: number;
  name: string;
  mime_type: string;
  uri: string;
  [key: string]: any;
}

/**
 * File download response
 */
export interface FileDownloadResponse {
  data: Blob;
  filename: string;
  mimeType: string;
}
