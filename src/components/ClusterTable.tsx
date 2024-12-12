import React, { useState } from 'react';
import { ClusterDetails } from '../types/databricks';
import { Server, Clock, Eye, EyeOff, RefreshCw, Download, Code, Copy, Check } from 'lucide-react';

interface ClusterTableProps {
  clusters: ClusterDetails[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function ClusterTable({ clusters, onRefresh, isLoading }: ClusterTableProps) {
  const [threshold, setThreshold] = useState<number>(60);
  const [showCreators, setShowCreators] = useState<Record<string, boolean>>({});
  const [showRawOutput, setShowRawOutput] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (clusters.length === 0) {
    return (
      <div className="text-center py-8">
        <Server className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No clusters found</h3>
        <p className="mt-1 text-sm text-gray-500">Add a workspace to view clusters.</p>
      </div>
    );
  }

  const isOverThreshold = (minutes?: number) => {
    return minutes !== undefined && minutes > threshold;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  const toggleCreator = (clusterId: string) => {
    setShowCreators(prev => ({
      ...prev,
      [clusterId]: !prev[clusterId]
    }));
  };

  const maskCreator = (creator: string) => {
    if (!creator) return '***';
    return creator.slice(-3);
  };

  const getRowHighlightClass = (cluster: ClusterDetails) => {
    if (cluster.runtime_engine === 'PHOTON') return 'bg-red-50';
    if (cluster.autotermination_minutes > 60) return 'bg-yellow-50';
    if (isOverThreshold(cluster.uptime_minutes)) return 'bg-orange-50';
    return undefined;
  };

  const toggleRawOutput = () => {
    setShowRawOutput(!showRawOutput);
  };

  const copyToClipboard = async () => {
    const rawData = JSON.stringify(clusters.map(c => c.raw_api_response));
    try {
      await navigator.clipboard.writeText(rawData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const exportToCsv = () => {
    const headers = [
      'Cluster ID',
      'Cluster Name',
      'Environment',
      'State',
      'Creator',
      'Spark Version',
      'Node Type',
      'Last Restarted',
      'Terminated',
      'Uptime/Usage',
      'Auto Termination',
      'Runtime Engine'
    ];

    const rows = clusters.map(cluster => [
      cluster.cluster_id,
      cluster.cluster_name,
      cluster.environment.toUpperCase(),
      cluster.state,
      cluster.creator_user_name,
      cluster.spark_version,
      cluster.node_type_id,
      formatTime(cluster.last_restarted_time),
      cluster.terminated_time ? formatTime(cluster.terminated_time) : '-',
      cluster.state === 'RUNNING' 
        ? formatDuration(cluster.uptime_minutes)
        : formatDuration(cluster.usage_minutes),
      cluster.autotermination_minutes ? formatDuration(cluster.autotermination_minutes) : 'Never',
      cluster.runtime_engine || 'Standard'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `databricks-clusters-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <label htmlFor="threshold" className="text-sm text-gray-600">
              Highlight clusters running longer than
            </label>
            <input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-16 px-2 py-1 text-sm border rounded"
              min="0"
            />
            <span className="text-sm text-gray-600">minutes</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            Total Clusters: {clusters.length}
          </div>
          <button
            onClick={toggleRawOutput}
            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Code className="h-4 w-4 mr-1" />
            Raw Output
          </button>
          <button
            onClick={exportToCsv}
            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </button>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {showRawOutput && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Raw API Response</span>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="overflow-auto max-h-96 bg-gray-50 p-4 rounded-md">
            <pre className="text-xs font-mono">
              {JSON.stringify(clusters.map(c => c.raw_api_response))}
            </pre>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cluster ID
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cluster Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Env
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creator
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Node
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Start
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Runtime
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auto Term
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engine
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clusters.map((cluster) => {
              const clusterId = `${cluster.workspace_url}-${cluster.cluster_id}`;
              return (
                <tr 
                  key={clusterId}
                  className={getRowHighlightClass(cluster)}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-500">
                    {cluster.cluster_id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                    {cluster.cluster_name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase
                      ${cluster.environment === 'production' ? 'bg-green-100 text-green-800' :
                        cluster.environment === 'staging' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'}`}>
                      {cluster.environment}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${cluster.state === 'RUNNING' ? 'bg-green-100 text-green-800' :
                        cluster.state === 'TERMINATED' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {cluster.state}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>
                        {showCreators[clusterId] ? cluster.creator_user_name : maskCreator(cluster.creator_user_name)}
                      </span>
                      <button
                        onClick={() => toggleCreator(clusterId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showCreators[clusterId] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {cluster.spark_version}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {cluster.node_type_id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {formatTime(cluster.last_restarted_time)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {cluster.terminated_time ? formatTime(cluster.terminated_time) : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {cluster.state === 'RUNNING' 
                      ? formatDuration(cluster.uptime_minutes)
                      : formatDuration(cluster.usage_minutes)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {cluster.autotermination_minutes ? formatDuration(cluster.autotermination_minutes) : 'Never'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {cluster.runtime_engine || 'Standard'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}