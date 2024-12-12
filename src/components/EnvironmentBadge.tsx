import React from 'react';
import { ENVIRONMENTS } from '../config/constants';

interface EnvironmentBadgeProps {
  environment: string;
}

export function EnvironmentBadge({ environment }: EnvironmentBadgeProps) {
  const envConfig = ENVIRONMENTS.find(env => env.value === environment) || {
    label: environment,
    color: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${envConfig.color}`}>
      {envConfig.label}
    </span>
  );
}