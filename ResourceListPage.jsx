import React from 'react';
import { Grid3X3 } from 'lucide-react';
import { useApp } from '../Context/AppContext';
import { getResourceAvailability } from '../Services/utils';
import Badge from './Badge';

const ResourceListPage = ({ resources, onBook, onViewDetail }) => {
  const { currentTheme, data } = useApp();

  return (
    <div className="space-y-3">
      {resources.map(resource => {
        const availability = getResourceAvailability(resource.id, data.bookings, data.users);
        return (
          <div key={resource.id} className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-4 flex items-center gap-4`}>
            <div className={`w-16 h-16 ${currentTheme.primary} rounded-lg flex items-center justify-center`}>
              <Grid3X3 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${currentTheme.text}`}>{resource.name}</h3>
              <p className={`text-sm ${currentTheme.textSecondary}`}>{resource.location} &bull; {resource.type}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={availability.status === 'available' ? 'success' : 'danger'}>
                  {availability.status === 'available' ? 'Available' : 'Occupied'}
                </Badge>
                <span className={`text-xs ${currentTheme.textSecondary}`}>Capacity: {resource.capacity}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onBook(resource)} className={`${currentTheme.primary} text-white px-4 py-2 rounded-lg text-sm font-medium`}>
                Book
              </button>
              <button onClick={() => onViewDetail(resource)} className={`px-3 py-2 ${currentTheme.secondary} rounded-lg ${currentTheme.textSecondary}`}>
                View
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResourceListPage;
