import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../Context/AppContext';

const BookingForm = ({ resource, onClose, onSubmit }) => {
  const { currentTheme, currentUser } = useApp();

  const [form, setForm] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    recurring: false,
    recurringType: 'weekly',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const start = new Date(
      `${form.date}T${form.startTime}`
    );

    const end = new Date(
      `${form.date}T${form.endTime}`
    );

    if (end <= start) {
      alert('End time must be later than start time');
      return;
    }

    onSubmit({
      ...form,
      start,
      end,
    });
  };

  // Handle image error - show fallback
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className={`
          ${currentTheme.card}
          w-full
          max-w-2xl
          rounded-3xl
          shadow-2xl
          overflow-hidden
          animate-fade-in
          max-h-[90vh]
          overflow-y-auto
        `}
      >
        {/* Header */}
        <div
          className={`
            px-6
            py-5
            border-b
            ${currentTheme.border}
            flex
            items-center
            justify-between
          `}
        >
          <div>
            <h2
              className={`
                text-2xl
                font-bold
                ${currentTheme.text}
              `}
            >
              Book Resource
            </h2>

            <p
              className={`
                text-sm
                mt-1
                ${currentTheme.textSecondary}
              `}
            >
              Reserve a resource for your meeting or event
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-xl
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition-all
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resource Card WITH IMAGE */}
        <div className="p-6 pb-0">
          <div
            className={`
              rounded-2xl
              ${currentTheme.secondary}
              overflow-hidden
            `}
          >
            {/* Resource Image */}
            <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
              {resource.image ? (
                <>
                  <img
                    src={resource.image}
                    alt={resource.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  {/* Fallback shown on error */}
                  <div 
                    className="hidden absolute inset-0 items-center justify-center bg-gray-200 dark:bg-gray-700"
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Resource type badge */}
              <div className="absolute top-3 right-3">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium capitalize
                  bg-white/90 dark:bg-black/70 text-gray-800 dark:text-white
                `}>
                  {resource.type}
                </span>
              </div>
            </div>

            {/* Resource Info */}
            <div className="p-5">
              <h3
                className={`
                  text-lg
                  font-semibold
                  ${currentTheme.text}
                `}
              >
                {resource.name}
              </h3>

              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {resource.location}
                </span>

                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Capacity: {resource.capacity}
                </span>

                {resource.price && (
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-green-600">
                      ${resource.price}/hr
                    </span>
                  </span>
                )}
              </div>

              {/* Amenities */}
              {resource.amenities && resource.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {resource.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className={`
                        px-2 py-1 rounded-lg text-xs
                        ${currentTheme.bg}
                        ${currentTheme.textSecondary}
                        border ${currentTheme.border}
                      `}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          {/* Title */}
          <div>
            <label
              className={`
                block
                mb-2
                font-medium
                ${currentTheme.text}
              `}
            >
              Booking Title *
            </label>

            <input
              type="text"
              required
              placeholder="e.g. Team Meeting"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className={`
                w-full
                px-4
                py-3
                rounded-xl
                border
                ${currentTheme.border}
                ${currentTheme.bg}
                ${currentTheme.text}
                focus:ring-2
                focus:ring-blue-500
                outline-none
              `}
            />
          </div>

          {/* Date */}
          <div>
            <label
              className={`
                block
                mb-2
                font-medium
                ${currentTheme.text}
              `}
            >
              Date *
            </label>

            <input
              type="date"
              required
              min={format(new Date(), 'yyyy-MM-dd')}
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              className={`
                w-full
                px-4
                py-3
                rounded-xl
                border
                ${currentTheme.border}
                ${currentTheme.bg}
                ${currentTheme.text}
              `}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`
                  block
                  mb-2
                  font-medium
                  ${currentTheme.text}
                `}
              >
                Start Time *
              </label>

              <input
                type="time"
                required
                value={form.startTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startTime: e.target.value,
                  })
                }
                className={`
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  ${currentTheme.border}
                  ${currentTheme.bg}
                  ${currentTheme.text}
                `}
              />
            </div>

            <div>
              <label
                className={`
                  block
                  mb-2
                  font-medium
                  ${currentTheme.text}
                `}
              >
                End Time *
              </label>

              <input
                type="time"
                required
                value={form.endTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endTime: e.target.value,
                  })
                }
                className={`
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  ${currentTheme.border}
                  ${currentTheme.bg}
                  ${currentTheme.text}
                `}
              />
            </div>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="recurring"
              checked={form.recurring}
              onChange={(e) =>
                setForm({
                  ...form,
                  recurring: e.target.checked,
                })
              }
              className="w-4 h-4"
            />

            <label
              htmlFor="recurring"
              className={currentTheme.text}
            >
              Recurring Booking
            </label>
          </div>

          {form.recurring && (
            <div>
              <label
                className={`
                  block
                  mb-2
                  font-medium
                  ${currentTheme.text}
                `}
              >
                Repeat Every
              </label>

              <select
                value={form.recurringType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    recurringType: e.target.value,
                  })
                }
                className={`
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  ${currentTheme.border}
                  ${currentTheme.bg}
                  ${currentTheme.text}
                `}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          {/* Priority */}
          <div
            className={`
              p-4
              rounded-xl
              ${currentTheme.secondary}
            `}
          >
            <p
              className={`
                text-sm
                ${currentTheme.textSecondary}
              `}
            >
              <strong>Booking Priority:</strong>{' '}
              {currentUser?.priority || 'Medium'}
            </p>
          </div>

          {/* Buttons */}
          <div
            className={`
              pt-4
              border-t
              ${currentTheme.border}
              flex
              gap-3
            `}
          >
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                py-3
                rounded-xl
                bg-slate-100
                text-slate-700
                font-medium
                hover:bg-slate-200
                transition-all
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`
                flex-1
                py-3
                rounded-xl
                text-white
                font-semibold
                shadow-lg
                hover:scale-[1.02]
                transition-all
                ${currentTheme.primary}
              `}
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;