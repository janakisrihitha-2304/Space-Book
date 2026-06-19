import React from 'react';
import { format, setHours } from 'date-fns';
import { useApp } from '../Context/AppContext';

const TimeSlotGrid = ({ date, resourceId, onSelect }) => {
  const { currentTheme, data } = useApp();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getSlotStatus = (hour) => {
    const slotStart = setHours(date, hour);
    const slotEnd = setHours(date, hour + 1);

    const booking = data.bookings.find(b => 
      b.resourceId === resourceId &&
      b.status !== 'cancelled' &&
      ((slotStart >= b.start && slotStart < b.end) || (slotEnd > b.start && slotEnd <= b.end))
    );

    return booking ? 'booked' : 'available';
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {hours.map(hour => {
        const status = getSlotStatus(hour);
        return (
          <button
            key={hour}
            onClick={() => status === 'available' && onSelect(hour)}
            disabled={status === 'booked'}
            className={`p-2 rounded-lg text-sm font-medium transition-all ${
              status === 'available' 
                ? `${currentTheme.secondary} ${currentTheme.text} hover:${currentTheme.primary} hover:text-white` 
                : 'bg-red-100 text-red-400 cursor-not-allowed'
            }`}
          >
            {format(setHours(date, hour), 'h a')}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
