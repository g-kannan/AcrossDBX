import { useState } from 'react';
import { WorkspaceEntry, ClusterDetails, ApiError } from '../types/databricks';
import { fetchAllClustersParallel } from '../services/databricksApi';
import { getErrorMessage } from '../utils/errorHandling';

export function useDatabricksApi() {
  const [clusters, setClusters] = useState<ClusterDetails[]>([]);
  const [errors, setErrors] = useState<ApiError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getClusters = async (workspaces: WorkspaceEntry[]) => {
    setIsLoading(true);
    setErrors([]);
    
    try {
      const { clusters: clusterData, errors: apiErrors } = 
        await fetchAllClustersParallel(workspaces.map(w => w.credentials));
      
      setClusters(clusterData);
      setErrors(apiErrors);
    } catch (err) {
      setErrors([{ message: getErrorMessage(err) }]);
      setClusters([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clusters,
    errors,
    isLoading,
    getClusters,
  };
}