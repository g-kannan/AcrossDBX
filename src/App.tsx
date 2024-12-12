import { useState } from 'react';
import { ClusterTable } from './components/ClusterTable';
import { WorkspaceForm } from './components/WorkspaceForm';
import { WorkspaceCredentials, ClusterDetails, ApiError } from './types/databricks';
import { fetchAllClustersParallel } from './services/databricksApi';

function App() {
  const [workspaces, setWorkspaces] = useState<WorkspaceCredentials[]>([]);
  const [clusters, setClusters] = useState<ClusterDetails[]>([]);
  const [errors, setErrors] = useState<ApiError[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClusters = async (credentials: WorkspaceCredentials[]) => {
    setLoading(true);
    try {
      const result = await fetchAllClustersParallel(credentials);
      setClusters(result.clusters);
      setErrors(result.errors);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceSubmit = (entries: { credentials: WorkspaceCredentials }[]) => {
    const credentials = entries.map(entry => entry.credentials);
    setWorkspaces(credentials);
    fetchClusters(credentials);
  };

  const handleRefresh = () => {
    if (workspaces.length > 0) {
      fetchClusters(workspaces);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AcrossX
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitor your Databricks clusters across workspaces
          </p>
        </div>

        <div className="mt-8">
          <WorkspaceForm onSubmit={handleWorkspaceSubmit} isLoading={loading} />
          
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
              <h3 className="font-semibold">Errors occurred:</h3>
              <ul className="list-disc pl-5">
                {errors.map((error, index) => (
                  <li key={index}>
                    {error.workspaceUrl ? `${error.workspaceUrl}: ` : ''}{error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {clusters.length > 0 && (
            <div className="mt-8">
              <ClusterTable 
                clusters={clusters} 
                onRefresh={handleRefresh}
                isLoading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;