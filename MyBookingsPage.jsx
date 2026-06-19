import React, { useState } from 'react';
import { BookOpen, QrCode, Star, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../Context/AppContext';
import BookingListItem from '../Components/BookingListItem';

const MyBookingsPage = () => {
  const { currentTheme, data, currentUser, cancelBooking, checkIn, extendBooking, addReview } = useApp();
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendTime, setExtendTime] = useState('');

  const myBookings = data.bookings.filter(b => b.userId === currentUser?.id).sort((a, b) => b.start - a.start);

  const handleCheckIn = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  const handleExtend = (booking) => {
    setSelectedBooking(booking);
    setExtendTime(format(booking.end, 'HH:mm'));
    setShowExtendModal(true);
  };

  const confirmExtend = () => {
    if (selectedBooking && extendTime) {
      const newEnd = new Date(`${format(selectedBooking.start, 'yyyy-MM-dd')}T${extendTime}`);
      extendBooking(selectedBooking.id, newEnd);
      setShowExtendModal(false);
    }
  };

  const submitReview = () => {
    if (selectedBooking) {
      addReview({
        userId: currentUser.id,
        resourceId: selectedBooking.resourceId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setShowReviewModal(false);
      setReviewForm({ rating: 5, comment: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${currentTheme.text}`}>My Bookings</h3>
          <span className={`px-3 py-1 rounded-full text-xs ${currentTheme.secondary} ${currentTheme.textSecondary}`}>
            Total: {myBookings.length}
          </span>
        </div>

        {myBookings.length === 0 ? (
          <div className={`text-center py-12 ${currentTheme.textSecondary}`}>
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No bookings yet</p>
            <p className="text-sm mt-2">Start by booking a resource from the Resources page</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map(booking => {
              const resource = data.resources.find(r => r.id === booking.resourceId);
              return (
                <BookingListItem
                  key={booking.id}
                  booking={booking}
                  resource={resource}
                  onCancel={cancelBooking}
                  onCheckIn={handleCheckIn}
                  onExtend={handleExtend}
                  onReview={(b) => { setSelectedBooking(b); setShowReviewModal(true); }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQRModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentTheme.card} rounded-2xl shadow-2xl w-full max-w-md p-8 text-center`}>
            <div className={`w-20 h-20 ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <QrCode className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-xl font-bold ${currentTheme.text} mb-2`}>Scan to Check In</h3>
            <div className={`w-48 h-48 mx-auto ${currentTheme.secondary} rounded-xl flex items-center justify-center mb-6`}>
              <QrCode className={`w-24 h-24 mx-auto ${currentTheme.primaryText}`} />
            </div>
            <p className={`text-sm ${currentTheme.text}`}><strong>Booking:</strong> {selectedBooking.title}</p>
            <p className={`text-sm ${currentTheme.textSecondary}`}>{format(selectedBooking.start, 'MMM dd, h:mm a')} - {format(selectedBooking.end, 'h:mm a')}</p>
            <button onClick={() => { checkIn(selectedBooking.id); setShowQRModal(false); }} className={`w-full mt-6 ${currentTheme.primary} text-white py-3 rounded-lg font-medium hover:opacity-90`}>
              Confirm Check In
            </button>
            <button onClick={() => setShowQRModal(false)} className={`w-full mt-2 py-2 text-sm ${currentTheme.textSecondary} hover:${currentTheme.text}`}>Close</button>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentTheme.card} rounded-2xl shadow-2xl w-full max-w-md p-6`}>
            <h3 className={`text-xl font-bold ${currentTheme.text} mb-4`}>Extend Booking</h3>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>New End Time</label>
              <input type="time" value={extendTime} onChange={(e) => setExtendTime(e.target.value)} className={`w-full px-4 py-2 ${currentTheme.bg} ${currentTheme.border} border rounded-lg ${currentTheme.text}`} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowExtendModal(false)} className={`flex-1 py-2.5 ${currentTheme.secondary} rounded-lg text-sm font-medium ${currentTheme.text}`}>Cancel</button>
              <button onClick={confirmExtend} className={`flex-1 ${currentTheme.primary} text-white py-2.5 rounded-lg text-sm font-medium`}>Extend</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentTheme.card} rounded-2xl shadow-2xl w-full max-w-md p-6`}>
            <h3 className={`text-xl font-bold ${currentTheme.text} mb-4`}>Rate Your Experience</h3>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setReviewForm({...reviewForm, rating: star})} className="p-1">
                    <Star className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Comment</label>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} placeholder="Share your experience..." rows={4} className={`w-full px-4 py-2 ${currentTheme.bg} ${currentTheme.border} border rounded-lg ${currentTheme.text}`} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReviewModal(false)} className={`flex-1 py-2.5 ${currentTheme.secondary} rounded-lg text-sm font-medium ${currentTheme.text}`}>Cancel</button>
              <button onClick={submitReview} className={`flex-1 ${currentTheme.primary} text-white py-2.5 rounded-lg text-sm font-medium`}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
