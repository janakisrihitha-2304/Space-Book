import React from 'react';
import {
  MapPin,
  Users,
  Star,
  Eye,
  ArrowRight
} from 'lucide-react';

import { useApp } from '../Context/AppContext';
import { getResourceAvailability } from '../Services/utils';

import Badge from './Badge';
import ResourceTypeIcon from './ResourceTypeIcon';

const ResourceCard = ({
  resource,
  onBook,
  onViewDetail,
}) => {
  const { currentTheme, data } = useApp();

  const availability = getResourceAvailability(
    resource.id,
    data.bookings,
    data.users
  );

  const resourceReviews = data.reviews.filter(
    review => review.resourceId === resource.id
  );

  const avgRating =
    resourceReviews.length > 0
      ? (
          resourceReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / resourceReviews.length
        ).toFixed(1)
      : resource.rating;

  // Handle image loading error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <div
      className={`
        ${currentTheme.card}
        ${currentTheme.border}
        border
        rounded-2xl
        overflow-hidden
        shadow-card
        hover:shadow-cardHover
        hover:-translate-y-2
        transition-all
        duration-300
        group
      `}
    >
      {/* IMAGE HEADER */}
      <div
        className={`
          relative
          h-48
          overflow-hidden
          bg-gray-200
          dark:bg-gray-700
        `}
      >
        {/* Actual Resource Image */}
        {resource.image ? (
          <>
            <img
              src={resource.image}
              alt={resource.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={handleImageError}
            />
            {/* Fallback icon (hidden by default, shown on error) */}
            <div 
              className="hidden absolute inset-0 items-center justify-center bg-gray-200 dark:bg-gray-700"
            >
              <ResourceTypeIcon
                type={resource.type}
                className="w-20 h-20 text-gray-400 opacity-80"
              />
            </div>
          </>
        ) : (
          /* No image provided - show icon fallback */
          <div className="flex items-center justify-center h-full">
            <ResourceTypeIcon
              type={resource.type}
              className="w-20 h-20 text-gray-400 opacity-80"
            />
          </div>
        )}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <Badge
            variant={
              availability.status === 'available'
                ? 'success'
                : 'danger'
            }
          >
            {availability.status === 'available'
              ? 'Available'
              : 'Occupied'}
          </Badge>
        </div>

        {/* Maintenance Badge - Top Left */}
        {resource.maintenance && (
          <div className="absolute top-3 left-3">
            <Badge variant="warning">
              Maintenance
            </Badge>
          </div>
        )}

        {/* Resource Type Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium capitalize
            bg-white/90 dark:bg-black/70 text-gray-800 dark:text-white
            backdrop-blur-sm
          `}>
            {resource.type}
          </span>
        </div>

        {/* Price Badge - Bottom Right */}
        {resource.price && (
          <div className="absolute bottom-3 right-3">
            <span className={`
              px-3 py-1 rounded-full text-xs font-bold
              bg-green-500/90 text-white
              backdrop-blur-sm
            `}>
              ${resource.price}/hr
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3
              className={`
                text-lg
                font-bold
                ${currentTheme.text}
                truncate
              `}
            >
              {resource.name}
            </h3>

            <div
              className={`
                mt-1
                flex
                items-center
                gap-1
                text-sm
                ${currentTheme.textSecondary}
              `}
            >
              <MapPin className="w-4 h-4" />
              {resource.location}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span
              className={`
                font-semibold
                text-sm
                ${currentTheme.text}
              `}
            >
              {avgRating}
            </span>
            <span className={`text-xs ${currentTheme.textSecondary}`}>
              ({resourceReviews.length})
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div
            className={`
              p-3
              rounded-xl
              ${currentTheme.secondary}
            `}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">
                {resource.capacity}
              </span>
            </div>
            <p className="text-xs opacity-70 mt-1">
              Capacity
            </p>
          </div>

          <div
            className={`
              p-3
              rounded-xl
              ${currentTheme.secondary}
            `}
          >
            <p className="text-sm font-medium capitalize">
              {resource.type}
            </p>
            <p className="text-xs opacity-70 mt-1">
              Resource Type
            </p>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mt-4">
          {resource.amenities
            ?.slice(0, 3)
            .map((amenity, index) => (
              <span
                key={index}
                className={`
                  px-2
                  py-1
                  rounded-full
                  text-xs
                  ${currentTheme.secondary}
                  ${currentTheme.textSecondary}
                `}
              >
                {amenity}
              </span>
            ))}

          {resource.amenities && resource.amenities.length > 3 && (
            <span
              className={`
                px-2
                py-1
                rounded-full
                text-xs
                ${currentTheme.secondary}
                ${currentTheme.textSecondary}
              `}
            >
              +{resource.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Occupied Info */}
        {availability.status === 'occupied' && (
          <div
            className="
              mt-4
              p-3
              rounded-xl
              bg-amber-50
              border
              border-amber-200
            "
          >
            <p className="text-xs text-amber-700">
              Occupied by
              <strong>
                {' '}
                {availability.user?.name}
              </strong>
              {' • '}
              {availability.remaining} min left
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onBook(resource)}
            className={`
              flex-1
              ${currentTheme.primary}
              text-white
              py-3
              rounded-xl
              font-medium
              hover:opacity-90
              transition-all
              flex
              items-center
              justify-center
              gap-2
            `}
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onViewDetail(resource)}
            className={`
              px-4
              rounded-xl
              border
              ${currentTheme.border}
              ${currentTheme.text}
              hover:${currentTheme.secondary}
              transition-all
            `}
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;