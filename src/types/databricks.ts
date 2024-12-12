export interface WorkspaceCredentials {
  url: string;
  token: string;
  environment: string;
}

export interface WorkspaceEntry {
  id: string;
  credentials: WorkspaceCredentials;
}

export interface ClusterDetails {
  cluster_id: string;
  cluster_name: string;
  state: string;
  creator_user_name: string;
  spark_version: string;
  node_type_id: string;
  environment: string;
  workspace_url: string;
  last_restarted_time: number;
  terminated_time?: number;
  uptime_minutes?: number;
  usage_minutes?: number;
  autotermination_minutes: number;
  runtime_engine?: string;
  raw_api_response?: any;
}

export interface ApiError {
  message: string;
  workspaceUrl?: string;
}

export type Environment = 'development' | 'staging' | 'production';