import React from 'react';
import { Download } from 'lucide-react';
import { ClusterDetails } from '../types/databricks';
import { convertToCSV, downloadCsv } from '../utils/csvExport';

interface ExportButtonProps {
  clusters: ClusterDetails[];
  disabled?: boolean;
}

export function ExportButton({ clusters, disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    const csvContent = convertToCSV(clusters);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `databricks-clusters-${timestamp}.csv`;
    downloadCsv(csvContent, filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || clusters.length === 0}
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="h-5 w-5 mr-2" />
      Export to CSV
    </button>
  );
}