import { WorkspaceCredentials, ClusterDetails, ApiError } from '../types/databricks';
import { API_ENDPOINTS } from '../config/constants';
import { DatabricksError } from '../utils/errorHandling';

export async function fetchClusterDetails(credentials: WorkspaceCredentials): Promise<ClusterDetails[]> {
  try {
    const baseUrl = credentials.url.endsWith('/')
      ? credentials.url.slice(0, -1)
      : credentials.url;

    const response = await fetch(`${baseUrl}${API_ENDPOINTS.CLUSTERS}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${credentials.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new DatabricksError(
        'Failed to fetch cluster details',
        response.status,
        baseUrl
      );
    }

    const data = await response.json();
    
    if (!data.clusters || !Array.isArray(data.clusters)) {
      throw new DatabricksError('Invalid response format from Databricks API', undefined, baseUrl);
    }

    return data.clusters.map(cluster => {
      const startTime = cluster.last_restarted_time;
      const terminatedTime = cluster.terminated_time;
      const currentTime = Date.now();
      
      let uptimeMinutes;
      let usageMinutes;
      
      if (cluster.state === 'RUNNING') {
        uptimeMinutes = Math.floor((currentTime - startTime) / (1000 * 60));
      } else if (terminatedTime) {
        usageMinutes = Math.floor((terminatedTime - startTime) / (1000 * 60));
      }

      return {
        ...cluster,
        environment: credentials.environment,
        workspace_url: baseUrl,
        last_restarted_time: startTime,
        terminated_time: terminatedTime,
        uptime_minutes: uptimeMinutes,
        usage_minutes: usageMinutes,
        raw_api_response: cluster
      };
    });
  } catch (error) {
    console.error('Error fetching cluster details:', error);
    throw error;
  }
}

export async function fetchAllClustersParallel(workspaces: WorkspaceCredentials[]): Promise<{
  clusters: ClusterDetails[];
  errors: ApiError[];
}> {
  const results = await Promise.allSettled(
    workspaces.map(credentials => fetchClusterDetails(credentials))
  );

  const clusters: ClusterDetails[] = [];
  const errors: ApiError[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      clusters.push(...result.value);
    } else {
      errors.push({
        message: result.reason.message,
        workspaceUrl: workspaces[index].url
      });
    }
  });

  return { clusters, errors };
}