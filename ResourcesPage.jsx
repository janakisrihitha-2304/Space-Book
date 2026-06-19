import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { addDays } from 'date-fns';

import { useApp } from '../Context/AppContext';
import ResourceCard from '../Components/ResourceCard';
import ResourceListPage from '../Components/ResourceListPage';
import BookingForm from '../Components/BookingForm';
import ResourceDetailPage from '../Components/ResourceDetailPage';

import {
  checkBookingConflicts,
  findAlternativeResource,
} from '../Services/utils';

const ResourcesPage = () => {
  const {
    currentTheme,
    data,
    viewMode,
    addBooking,
    addToWaitlist,
    currentUser,
    addNotification,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showResourceDetail, setShowResourceDetail] = useState(false);

  const resourceTypes = [
    'all',
    'room',
    'equipment',
    'hall',
    'pod',
  ];

  const filteredResources = data.resources.filter(
    (resource) => {
      const matchesSearch =
        resource.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.location
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        resource.amenities.some((amenity) =>
          amenity
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

      const matchesType =
        filterType === 'all' ||
        resource.type === filterType;

      return matchesSearch && matchesType;
    }
  );

  const handleBook = (formData) => {
    if (!currentUser) {
      addNotification(
        'Please login to book a resource',
        'warning'
      );
      return;
    }

    const conflicts = checkBookingConflicts(
      data.bookings,
      selectedResource.id,
      formData.start,
      formData.end
    );

    if (conflicts.length > 0) {
      const alternative = findAlternativeResource(
        data.resources,
        data.bookings,
        selectedResource.id,
        selectedResource.type,
        formData.start,
        formData.end
      );

      if (alternative) {
        addNotification(
          `${selectedResource.name} is unavailable. ${alternative.name} is available at the same time.`,
          'info'
        );
      } else {
        addToWaitlist({
          userId: currentUser.id,
          resourceId: selectedResource.id,
          desiredStart: formData.start,
          desiredEnd: formData.end,
        });
      }

      setShowBookingModal(false);
      return;
    }

    addBooking({
      userId: currentUser.id,
      resourceId: selectedResource.id,
      title: formData.title,
      start: formData.start,
      end: formData.end,
      status:
        currentUser.role === 'student' ||
        currentUser.role === 'guest'
          ? 'pending'
          : 'confirmed',
      priority: currentUser.priority,
      recurring: formData.recurring
        ? {
            type: formData.recurringType,
            until: addDays(formData.start, 30),
          }
        : null,
    });

    setShowBookingModal(false);

    addNotification(
      'Booking created successfully!',
      'success'
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className={`
            text-3xl
            font-bold
            ${currentTheme.text}
          `}
        >
          Resource Directory
        </h1>

        <p
          className={`
            mt-2
            ${currentTheme.textSecondary}
          `}
        >
          Discover and reserve available resources.
        </p>
      </div>

      {/* Search & Filters */}
      <div
        className={`
          ${currentTheme.card}
          ${currentTheme.border}
          border
          rounded-3xl
          p-6
          shadow-card
        `}
      >
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 relative">
            <Search
              className={`
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                w-5
                h-5
                ${currentTheme.textSecondary}
              `}
            />

            <input
              type="text"
              placeholder="Search resources, locations, amenities..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className={`
                w-full
                pl-12
                pr-4
                py-3
                rounded-2xl
                border
                ${currentTheme.border}
                ${currentTheme.bg}
                ${currentTheme.text}
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
              `}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter
              className={`w-5 h-5 ${currentTheme.textSecondary}`}
            />

            <div className="flex flex-wrap gap-2">
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setFilterType(type)
                  }
                  className={`
                    px-5
                    py-2.5
                    rounded-2xl
                    text-sm
                    font-medium
                    capitalize
                    transition-all
                    duration-300
                    ${
                      filterType === type
                        ? `${currentTheme.primary} text-white shadow-lg`
                        : `${currentTheme.secondary} ${currentTheme.textSecondary}`
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p
            className={`
              text-sm
              ${currentTheme.textSecondary}
            `}
          >
            Showing
            <span
              className={`
                ml-1
                font-semibold
                ${currentTheme.text}
              `}
            >
              {filteredResources.length}
            </span>{' '}
            resources
          </p>
        </div>
      </div>

      {/* Resource Grid/List */}
      {filteredResources.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onBook={(resource) => {
                  setSelectedResource(resource);
                  setShowBookingModal(true);
                }}
                onViewDetail={(resource) => {
                  setSelectedResource(resource);
                  setShowResourceDetail(true);
                }}
              />
            ))}
          </div>
        ) : (
          <ResourceListPage
            resources={filteredResources}
            onBook={(resource) => {
              setSelectedResource(resource);
              setShowBookingModal(true);
            }}
            onViewDetail={(resource) => {
              setSelectedResource(resource);
              setShowResourceDetail(true);
            }}
          />
        )
      ) : (
        <div
          className={`
            ${currentTheme.card}
            rounded-3xl
            p-16
            text-center
          `}
        >
          <h3
            className={`
              text-2xl
              font-semibold
              ${currentTheme.text}
            `}
          >
            No Resources Found
          </h3>

          <p
            className={`
              mt-3
              ${currentTheme.textSecondary}
            `}
          >
            Try adjusting your search terms
            or filter options.
          </p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal &&
        selectedResource && (
          <BookingForm
            resource={selectedResource}
            onClose={() =>
              setShowBookingModal(false)
            }
            onSubmit={handleBook}
          />
        )}

      {/* Detail Modal */}
      {showResourceDetail &&
        selectedResource && (
          <ResourceDetailPage
            resource={selectedResource}
            onClose={() =>
              setShowResourceDetail(false)
            }
            onBook={(resource) => {
              setSelectedResource(resource);
              setShowBookingModal(true);
            }}
          />
        )}
    </div>
  );
};

export default ResourcesPage;