import React, { useState, useRef } from 'react';
import { WorkspaceCredentials } from '../types/databricks';

interface JsonInputModalProps {
  onSubmit: (credentials: WorkspaceCredentials) => void;
  onClose: () => void;
}

export function JsonInputModal({ onSubmit, onClose }: JsonInputModalProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.url || !parsed.token || !parsed.environment) {
        setError('JSON must contain url, token, and environment fields');
        return;
      }
      onSubmit(parsed);
      onClose();
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonInput(content);
        setError('');
      } catch (err) {
        setError('Failed to read file');
      }
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4">Paste or Upload Workspace JSON</h2>
        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors mb-4"
          >
            Click to upload JSON file
          </button>
          <textarea
            className="w-full h-32 p-2 border rounded mb-4"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="{\n  &quot;url&quot;: &quot;https://...&quot;,\n  &quot;token&quot;: &quot;...&quot;,\n  &quot;environment&quot;: &quot;...&quot;\n}"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
