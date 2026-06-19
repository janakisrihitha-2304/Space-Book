import React from 'react';
import { useApp } from '../Context/AppContext';

const LoadingSpinner = ({ className = '' }) => {
  const { currentTheme } = useApp();

  return (
    <div className={`animate-pulse ${currentTheme.secondary} rounded-lg ${className}`}>
      <div className="h-4 bg-opacity-50 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-opacity-50 rounded w-1/2"></div>
    </div>
  );
};

export default LoadingSpinner;
