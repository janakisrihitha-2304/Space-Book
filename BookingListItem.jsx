import React, { useState } from 'react';
import { format, isFuture, isToday } from 'date-fns';
import { QrCode, ScanLine, Clock, MapPin } from 'lucide-react';
import { useApp } from '../Context/AppContext';
import Badge from './Badge';
import QRDisplay from './QRDisplay';

const BookingListItem = ({ booking, resource, onCancel, onCheckIn, onExtend, onReview, showActions = true }) => {
  const { currentTheme, currentUser } = useApp();
  const [showQR, setShowQR] = useState(false);

  const isUpcoming = isFuture(booking.start) || isToday(booking.start);
  const canCheckIn = isToday(booking.start) && booking.status === 'confirmed' && !booking.checkedIn;
  const canExtend = isToday(booking.start) && booking.status === 'confirmed' && !booking.extended;
  const canReview = booking.status === 'completed' && !booking.reviewed;
  const canShowQR = isUpcoming && booking.status === 'confirmed';

  // Add resource name to booking for QR display
  const bookingWithResourceName = {
    ...booking,
    resourceName: resource?.name || 'Unknown Resource'
  };

  return (
    <>
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-5 transition-all hover:shadow-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {/* Date badge */}
            <div className={`w-14 h-14 ${currentTheme.primary} rounded-xl flex flex-col items-center justify-center text-white shadow-md`}>
              <span className="text-xs font-medium uppercase">{format(booking.start, 'MMM')}</span>
              <span className="text-xl font-bold">{format(booking.start, 'dd')}</span>
            </div>
            
            <div className="min-w-0">
              <h4 className={`font-semibold ${currentTheme.text} text-lg truncate`}>{booking.title}</h4>
              <p className={`text-sm ${currentTheme.textSecondary} flex items-center gap-1`}>
                <MapPin className="w-3 h-3" />
                {resource?.name || 'Unknown Resource'}
              </p>
              <p className={`text-sm ${currentTheme.textSecondary} flex items-center gap-1 mt-0.5`}>
                <Clock className="w-3 h-3" />
                {format(booking.start, 'h:mm a')} - {format(booking.end, 'h:mm a')}
              </p>
              {booking.recurring && (
                <p className={`text-xs ${currentTheme.primaryText} mt-1 font-medium`}>
                  ↻ Repeats {booking.recurring.type} until {format(booking.recurring.until, 'MMM dd')}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : booking.status === 'cancelled' ? 'danger' : 'default'}>
              {booking.status}
            </Badge>
            {booking.checkedIn && <Badge variant="success">✓ Checked In</Badge>}
            {booking.extended && <Badge variant="info">Extended</Badge>}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Show QR Button */}
            {canShowQR && (
              <button 
                onClick={() => setShowQR(true)} 
                className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center gap-2 transition-all"
              >
                <QrCode className="w-4 h-4" />
                Show QR
              </button>
            )}

            {/* Check In Button */}
            {canCheckIn && (
              <button 
                onClick={() => onCheckIn(booking)} 
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 flex items-center gap-2 transition-all shadow-sm"
              >
                <ScanLine className="w-4 h-4" />
                Check In
              </button>
            )}

            {/* Extend Button */}
            {canExtend && (
              <button 
                onClick={() => onExtend(booking)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium ${currentTheme.primary} text-white hover:opacity-90 transition-all shadow-sm`}
              >
                Extend
              </button>
            )}

            {/* Review Button */}
            {canReview && (
              <button 
                onClick={() => onReview(booking)} 
                className={`px-4 py-2 rounded-lg text-sm font-medium ${currentTheme.secondary} ${currentTheme.text} hover:${currentTheme.primary} hover:text-white transition-all`}
              >
                Review
              </button>
            )}

            {/* Cancel Button */}
            {isUpcoming && booking.status !== 'cancelled' && (
              <button 
                onClick={() => onCancel(booking.id)} 
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 ml-auto transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* QR Display Modal */}
      {showQR && (
        <QRDisplay 
          booking={bookingWithResourceName} 
          onClose={() => setShowQR(false)} 
        />
      )}
    </>
  );
};

export default BookingListItem;