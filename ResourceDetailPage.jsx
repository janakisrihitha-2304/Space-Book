import React from 'react';
import { X, Users, Star, MapPin, Layers } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../Context/AppContext';

const ResourceDetailPage = ({ resource, onClose, onBook }) => {
  const { currentTheme, data } = useApp();

  if (!resource) return null;

  const resourceReviews = data.reviews.filter(r => r.resourceId === resource.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${currentTheme.card} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 ${currentTheme.border} border-b flex items-center justify-between`}>
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>{resource.name}</h3>
          <button onClick={onClose} className={`${currentTheme.textSecondary} hover:${currentTheme.text}`}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`${currentTheme.secondary} rounded-lg p-4 text-center`}>
              <Users className={`w-6 h-6 mx-auto mb-2 ${currentTheme.primaryText}`} />
              <p className={`text-lg font-bold ${currentTheme.text}`}>{resource.capacity}</p>
              <p className={`text-xs ${currentTheme.textSecondary}`}>Capacity</p>
            </div>
            <div className={`${currentTheme.secondary} rounded-lg p-4 text-center`}>
              <Star className={`w-6 h-6 mx-auto mb-2 text-amber-400`} />
              <p className={`text-lg font-bold ${currentTheme.text}`}>{resource.rating}</p>
              <p className={`text-xs ${currentTheme.textSecondary}`}>Rating</p>
            </div>
            <div className={`${currentTheme.secondary} rounded-lg p-4 text-center`}>
              <MapPin className={`w-6 h-6 mx-auto mb-2 ${currentTheme.primaryText}`} />
              <p className={`text-lg font-bold ${currentTheme.text}`}>{resource.location}</p>
              <p className={`text-xs ${currentTheme.textSecondary}`}>Location</p>
            </div>
            <div className={`${currentTheme.secondary} rounded-lg p-4 text-center`}>
              <Layers className={`w-6 h-6 mx-auto mb-2 ${currentTheme.primaryText}`} />
              <p className={`text-lg font-bold ${currentTheme.text} capitalize`}>{resource.type}</p>
              <p className={`text-xs ${currentTheme.textSecondary}`}>Type</p>
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${currentTheme.text} mb-3`}>Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {resource.amenities.map((amenity, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-lg ${currentTheme.secondary} ${currentTheme.text} text-sm`}>{amenity}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${currentTheme.text} mb-3`}>Reviews</h4>
            <div className="space-y-3">
              {resourceReviews.map(review => {
                const user = data.users.find(u => u.id === review.userId);
                return (
                  <div key={review.id} className={`${currentTheme.secondary} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 ${currentTheme.primary} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                        {user?.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${currentTheme.text}`}>{user?.name}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <span className={`ml-auto text-xs ${currentTheme.textSecondary}`}>{format(review.date, 'MMM dd, yyyy')}</span>
                    </div>
                    <p className={`text-sm ${currentTheme.textSecondary}`}>{review.comment}</p>
                  </div>
                );
              })}
              {resourceReviews.length === 0 && <p className={`text-sm ${currentTheme.textSecondary} text-center py-4`}>No reviews yet</p>}
            </div>
          </div>

          <div>
            <h4 className={`font-semibold ${currentTheme.text} mb-3`}>Availability Trend</h4>
            <div className={`${currentTheme.secondary} rounded-lg p-4`}>
              <p className={`text-sm ${currentTheme.textSecondary}`}>Usually busy between 10 AM - 2 PM on weekdays</p>
              <div className="mt-3 space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => {
                  const dayBookings = data.bookings.filter(b => 
                    b.resourceId === resource.id && 
                    b.status !== 'cancelled' &&
                    format(b.start, 'EEE') === day
                  );
                  const intensity = Math.min(dayBookings.length * 20, 100);
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className={`text-sm w-8 ${currentTheme.text}`}>{day}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${currentTheme.primary} rounded-full transition-all`} style={{ width: `${intensity}%` }}></div>
                      </div>
                      <span className={`text-xs ${currentTheme.textSecondary} w-8`}>{dayBookings.length} bookings</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className={`p-6 ${currentTheme.border} border-t`}>
          <button onClick={() => { onClose(); onBook(resource); }} className={`w-full ${currentTheme.primary} text-white py-3 rounded-lg font-medium hover:opacity-90`}>
            Book This Resource
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
