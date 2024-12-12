// API endpoints and configurations
export const API_VERSION = '2.0';
export const API_ENDPOINTS = {
  CLUSTERS: '/api/2.0/clusters/list',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ENVIRONMENTS = [
  'development',
  'staging',
  'production',
] as const;

export type Environment = typeof ENVIRONMENTS[number];