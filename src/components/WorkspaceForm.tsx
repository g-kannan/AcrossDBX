import React, { useState } from 'react';
import { KeyRound, Link, Globe, PlusCircle, X, Code } from 'lucide-react';
import { WorkspaceCredentials, WorkspaceEntry } from '../types/databricks';
import { ENVIRONMENTS } from '../config/constants';

interface WorkspaceFormProps {
  onSubmit: (workspaces: WorkspaceEntry[]) => void;
  isLoading: boolean;
}

export function WorkspaceForm({ onSubmit, isLoading }: WorkspaceFormProps) {
  const [workspaces, setWorkspaces] = useState<WorkspaceEntry[]>([
    { id: '1', credentials: { url: '', token: '', environment: 'development' } }
  ]);
  const [showJsonInput, setShowJsonInput] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workspaces.every(w => w.credentials.url && w.credentials.token)) {
      onSubmit(workspaces);
    }
  };

  const handleJsonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        const newWorkspaces = parsed.map((cred, index) => ({
          id: (Date.now() + index).toString(),
          credentials: {
            url: cred.url,
            token: cred.token,
            environment: cred.environment || 'development'
          }
        }));
        onSubmit(newWorkspaces);
      } else {
        const newWorkspace = {
          id: Date.now().toString(),
          credentials: {
            url: parsed.url,
            token: parsed.token,
            environment: parsed.environment || 'development'
          }
        };
        onSubmit([newWorkspace]);
      }
      setJsonError('');
    } catch (e) {
      setJsonError('Invalid JSON format');
    }
  };

  const addWorkspace = () => {
    setWorkspaces([
      ...workspaces,
      {
        id: Date.now().toString(),
        credentials: { url: '', token: '', environment: 'development' }
      }
    ]);
  };

  const removeWorkspace = (id: string) => {
    if (workspaces.length > 1) {
      setWorkspaces(workspaces.filter(w => w.id !== id));
    }
  };

  const updateWorkspace = (id: string, field: keyof WorkspaceCredentials, value: string) => {
    setWorkspaces(workspaces.map(workspace => 
      workspace.id === id 
        ? { ...workspace, credentials: { ...workspace.credentials, [field]: value } }
        : workspace
    ));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Workspace Credentials</h2>
        <button
          type="button"
          onClick={() => setShowJsonInput(!showJsonInput)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Code className="h-4 w-4 mr-2" />
          Switch to {showJsonInput ? 'Form' : 'JSON'}
        </button>
      </div>

      {showJsonInput ? (
        <form onSubmit={handleJsonSubmit} className="space-y-4">
          <div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{
  "url": "https://your-workspace.cloud.databricks.com",
  "token": "your-token",
  "environment": "development"
}

// Or array of workspaces:
[
  {
    "url": "https://workspace1.cloud.databricks.com",
    "token": "token1",
    "environment": "development"
  },
  {
    "url": "https://workspace2.cloud.databricks.com",
    "token": "token2",
    "environment": "production"
  }
]`}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {jsonError && (
              <p className="mt-2 text-sm text-red-600">{jsonError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {workspaces.map((workspace, index) => (
            <div key={workspace.id} className="space-y-4 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Workspace {index + 1}</h3>
                {workspaces.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWorkspace(workspace.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Workspace URL
                    </div>
                  </label>
                  <input
                    type="url"
                    value={workspace.credentials.url}
                    onChange={(e) => updateWorkspace(workspace.id, 'url', e.target.value)}
                    placeholder="https://your-workspace.cloud.databricks.com"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <KeyRound className="h-4 w-4 mr-2" />
                      Access Token
                    </div>
                  </label>
                  <input
                    type="password"
                    value={workspace.credentials.token}
                    onChange={(e) => updateWorkspace(workspace.id, 'token', e.target.value)}
                    placeholder="Enter your access token"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      Environment
                    </div>
                  </label>
                  <select
                    value={workspace.credentials.environment}
                    onChange={(e) => updateWorkspace(workspace.id, 'environment', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  >
                    {ENVIRONMENTS.map(env => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={addWorkspace}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Workspace
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}