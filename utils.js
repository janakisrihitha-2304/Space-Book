import { isSameDay, isFuture, isToday, isWithinInterval, getHours, differenceInMinutes } from 'date-fns';

export const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'completed': return 'bg-blue-100 text-blue-700';
    case 'rejected': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-amber-100 text-amber-700';
    case 'low': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getResourceAvailability = (resourceId, bookings, users, now = new Date()) => {
  const todayBookings = bookings.filter(b => 
    b.resourceId === resourceId && 
    b.status !== 'cancelled' &&
    isSameDay(b.start, now)
  );

  const currentBooking = todayBookings.find(b => 
    isWithinInterval(now, { start: b.start, end: b.end })
  );

  if (currentBooking) {
    const remaining = differenceInMinutes(currentBooking.end, now);
    return { 
      status: 'occupied', 
      user: users.find(u => u.id === currentBooking.userId), 
      remaining 
    };
  }

  const nextBooking = todayBookings.find(b => isFuture(b.start));
  if (nextBooking) {
    return { status: 'available', nextBooking };
  }

  return { status: 'available', nextBooking: null };
};

export const checkBookingConflicts = (bookings, resourceId, start, end) => {
  return bookings.filter(b => 
    b.resourceId === resourceId &&
    b.status !== 'cancelled' &&
    isSameDay(b.start, start) &&
    ((start >= b.start && start < b.end) || 
     (end > b.start && end <= b.end) || 
     (start <= b.start && end >= b.end))
  );
};

export const findAlternativeResource = (resources, bookings, excludedId, type, start, end) => {
  return resources.find(r => 
    r.id !== excludedId && 
    r.type === type &&
    !checkBookingConflicts(bookings, r.id, start, end).length
  );
};

export const getActivityIcon = (type) => {
  switch (type) {
    case 'booking': return 'BookOpen';
    case 'update': return 'Edit3';
    case 'cancel': return 'XCircle';
    case 'checkin': return 'CheckCircle';
    case 'review': return 'Star';
    default: return 'Zap';
  }
};

export const getActivityColor = (type) => {
  switch (type) {
    case 'booking': return 'text-blue-500';
    case 'update': return 'text-amber-500';
    case 'cancel': return 'text-red-500';
    case 'checkin': return 'text-green-500';
    case 'review': return 'text-purple-500';
    default: return 'text-gray-500';
  }
};
