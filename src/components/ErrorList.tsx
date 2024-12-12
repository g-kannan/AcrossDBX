import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ApiError } from '../types/databricks';

interface ErrorListProps {
  errors: ApiError[];
}

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {errors.map((error, index) => (
        <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-600">{error.message}</p>
            {error.workspaceUrl && (
              <p className="text-sm text-red-500 mt-1">Workspace: {error.workspaceUrl}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}