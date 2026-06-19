import React from 'react';
import { Monitor, Projector, Users, Box, Coffee } from 'lucide-react';

const ResourceTypeIcon = ({ type, className = '' }) => {
  const icons = {
    room: Users,
    hall: Users,
    equipment: Monitor,
    pod: Box,
    default: Coffee,
  };

  const Icon = icons[type] || icons.default;
  return <Icon className={className} />;
};

export default ResourceTypeIcon;
