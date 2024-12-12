import { ApiError } from '../types/databricks';

export class DatabricksError extends Error {
  status?: number;
  workspaceUrl?: string;
  
  constructor(message: string, status?: number, workspaceUrl?: string) {
    super(message);
    this.name = 'DatabricksError';
    this.status = status;
    this.workspaceUrl = workspaceUrl;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof DatabricksError) {
    switch (error.status) {
      case 401:
        return 'Invalid access token. Please check your credentials.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      default:
        return error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}