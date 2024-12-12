import { ClusterDetails } from '../types/databricks';

export function convertToCSV(clusters: ClusterDetails[]): string {
  if (clusters.length === 0) return '';

  // Define headers based on the cluster properties we want to export
  const headers = [
    'Cluster Name',
    'Environment',
    'State',
    'Creator',
    'Spark Version',
    'Node Type',
    'Workspace URL'
  ];

  // Create CSV header row
  const csvRows = [headers.join(',')];

  // Add data rows
  clusters.forEach(cluster => {
    const row = [
      // Escape values that might contain commas
      escapeCsvValue(cluster.cluster_name),
      escapeCsvValue(cluster.environment),
      escapeCsvValue(cluster.state),
      escapeCsvValue(cluster.creator_user_name),
      escapeCsvValue(cluster.spark_version),
      escapeCsvValue(cluster.node_type_id),
      escapeCsvValue(cluster.workspace_url)
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

function escapeCsvValue(value: string): string {
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape quotes by doubling them and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function downloadCsv(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  // Add to document, trigger download, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}