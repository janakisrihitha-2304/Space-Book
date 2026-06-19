import React from 'react';
import { useApp } from '../Context/AppContext';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const { currentTheme } = useApp();

  const variants = {
    default: `${currentTheme.secondary} ${currentTheme.textSecondary}`,
    primary: `${currentTheme.primary} text-white`,
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
