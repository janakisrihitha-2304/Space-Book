import React, { useState } from 'react';
import { Star, X, Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../Context/AppContext';

const ReviewsPage = () => {
  const { currentTheme, data, currentUser, addReview, addNotification } = useApp();

  // State for review form
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedResource, setSelectedResource] = useState('');

  const averageRating = data.reviews.length > 0 
    ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: data.reviews.filter(r => r.rating === star).length,
    percentage: data.reviews.length > 0 ? (data.reviews.filter(r => r.rating === star).length / data.reviews.length) * 100 : 0,
  }));

  // Handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!currentUser) {
      addNotification('Please log in to write a review', 'error');
      return;
    }
    if (rating === 0) {
      addNotification('Please select a rating', 'error');
      return;
    }
    if (!selectedResource) {
      addNotification('Please select a resource to review', 'error');
      return;
    }
    if (comment.trim().length < 5) {
      addNotification('Comment must be at least 5 characters', 'error');
      return;
    }

    const existingReview = data.reviews.find(
      r => r.userId === currentUser.id && r.resourceId === selectedResource
    );
    if (existingReview) {
      addNotification('You have already reviewed this resource', 'warning');
      return;
    }

    addReview({
      userId: currentUser.id,
      resourceId: selectedResource,
      rating,
      comment: comment.trim(),
    });

    setRating(0);
    setHoverRating(0);
    setComment('');
    setSelectedResource('');
    setShowForm(false);
  };

  // Get resources the current user has booked
  const userBookedResources = data.bookings
    .filter(b => b.userId === currentUser?.id && b.status === 'confirmed')
    .map(b => b.resourceId);

  const eligibleResources = data.resources.filter(r => 
    userBookedResources.includes(r.id)
  );

  return (
    <div className="space-y-6">
      
      {/* Header with Write Review Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Reviews</h2>
          <p className={`text-sm ${currentTheme.textSecondary}`}>
            {data.reviews.length} reviews from our community
          </p>
        </div>
        <button
          onClick={() => {
            if (!currentUser) {
              addNotification('Please log in to write a review', 'error');
              return;
            }
            setShowForm(true);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentTheme.primary} text-white font-medium hover:opacity-90 transition-opacity`}
        >
          <MessageSquare className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme.card} rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Write a Review</h3>
              <button 
                onClick={() => setShowForm(false)}
                className={`p-1 rounded-lg hover:${currentTheme.secondary} ${currentTheme.textSecondary}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              
              {/* Select Resource */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                  Select Resource *
                </label>
                <select
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Choose a resource...</option>
                  {eligibleResources.length > 0 ? (
                    eligibleResources.map(resource => (
                      <option key={resource.id} value={resource.id}>
                        {resource.name} ({resource.type})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No eligible resources (book first!)</option>
                  )}
                </select>
                {eligibleResources.length === 0 && (
                  <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                    You need to book and confirm a resource before reviewing it.
                  </p>
                )}
              </div>

              {/* Star Rating */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2`}>
                  Rating *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating) 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                  {rating > 0 ? `${rating} out of 5 stars` : 'Click to rate'}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder="Share your experience with this resource..."
                />
                <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                  Minimum 5 characters
                </p>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`flex-1 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} hover:${currentTheme.secondary} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={eligibleResources.length === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${currentTheme.primary} text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-4 h-4" />
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Summary */}
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className={`text-5xl font-bold ${currentTheme.text}`}>{averageRating}</p>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>{data.reviews.length} reviews</p>
            </div>
          </div>
          <div className="space-y-2">
            {ratingDistribution.map(r => (
              <div key={r.star} className="flex items-center gap-3">
                <span className={`text-sm w-8 ${currentTheme.text}`}>{r.star} &#9733;</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${currentTheme.primary} rounded-full transition-all`} style={{ width: `${r.percentage}%` }}></div>
                </div>
                <span className={`text-sm w-8 ${currentTheme.textSecondary}`}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>All Reviews</h3>
        
        {data.reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className={`w-12 h-12 ${currentTheme.textSecondary} mx-auto mb-3`} />
            <p className={`${currentTheme.textSecondary}`}>No reviews yet. Be the first to write one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.reviews.map(review => {
              const user = data.users.find(u => u.id === review.userId);
              const resource = data.resources.find(r => r.id === review.resourceId);
              return (
                <div key={review.id} className={`${currentTheme.secondary} rounded-lg p-5`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                        {user?.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${currentTheme.text}`}>{user?.name}</p>
                        <p className={`text-xs ${currentTheme.textSecondary}`}>{resource?.name}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm ${currentTheme.text} mb-2`}>{review.comment}</p>
                  <p className={`text-xs ${currentTheme.textSecondary}`}>
                    {format(review.date, 'MMM dd, yyyy')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;