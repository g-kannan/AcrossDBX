import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}