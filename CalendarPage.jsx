import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isToday
} from 'date-fns';
import { useApp } from '../Context/AppContext';

const CalendarPage = () => {
  const { currentTheme, data, currentUser } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  const getDayBookings = (date) => {
    return data.bookings.filter(
      (booking) =>
        isSameDay(booking.start, date) &&
        booking.status !== 'cancelled' &&
        (currentUser?.role === 'admin' ||
          booking.userId === currentUser?.id)
    );
  };

  const getHeatmapIntensity = (date) => {
    const count = getDayBookings(date).length;

    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    return 3;
  };

  const CalendarDay = ({ date }) => {
    const bookings = getDayBookings(date);

    const intensity = getHeatmapIntensity(date);

    const isSelected = isSameDay(
      date,
      selectedDate
    );

    const isTodayDate = isToday(date);

    const intensityColor = [
      'bg-transparent',
      currentTheme.heatmapLow,
      currentTheme.heatmapMid,
      currentTheme.heatmapHigh,
    ];

    return (
      <div
        onClick={() => setSelectedDate(date)}
        className={`
          relative
          min-h-[120px]
          p-3
          border
          rounded-2xl
          cursor-pointer
          transition-all
          duration-300
          hover:shadow-lg
          hover:-translate-y-1
          ${currentTheme.border}
          ${
            isSelected
              ? 'ring-2 ring-blue-500 shadow-lg'
              : ''
          }
        `}
      >
        <div
          className={`
            absolute
            inset-0
            rounded-2xl
            opacity-20
            pointer-events-none
            ${intensityColor[intensity]}
          `}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`
                text-sm
                font-semibold
                ${
                  isTodayDate
                    ? currentTheme.primaryText
                    : currentTheme.text
                }
              `}
            >
              {format(date, 'd')}
            </span>

            {bookings.length > 0 && (
              <span
                className={`
                  text-xs
                  px-2
                  py-1
                  rounded-full
                  ${currentTheme.primary}
                  text-white
                `}
              >
                {bookings.length}
              </span>
            )}
          </div>

          {bookings.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              className="
                text-xs
                px-2
                py-1
                rounded-lg
                bg-blue-100
                text-blue-700
                truncate
                mb-1
              "
            >
              {format(
                booking.start,
                'h:mm'
              )}{' '}
              {booking.title}
            </div>
          ))}

          {bookings.length > 3 && (
            <p
              className={`
                text-xs
                ${currentTheme.textSecondary}
              `}
            >
              +{bookings.length - 3} more
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1
          className={`
            text-3xl
            font-bold
            ${currentTheme.text}
          `}
        >
          Booking Calendar
        </h1>

        <p
          className={`
            mt-2
            ${currentTheme.textSecondary}
          `}
        >
          View and manage resource bookings
          through an interactive calendar.
        </p>
      </div>

      {/* Month Navigation */}

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentDate(
                  subMonths(currentDate, 1)
                )
              }
              className="
                p-3
                rounded-xl
                bg-slate-100
                hover:bg-slate-200
                dark:hover:bg-slate-700
                transition-all
              "
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2
              className={`
                text-2xl
                font-bold
                ${currentTheme.text}
              `}
            >
              {format(
                currentDate,
                'MMMM yyyy'
              )}
            </h2>

            <button
              onClick={() =>
                setCurrentDate(
                  addMonths(currentDate, 1)
                )
              }
              className="
                p-3
                rounded-xl
                bg-slate-100
                hover:bg-slate-200
                dark:hover:bg-slate-700
                transition-all
              "
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() =>
              setCurrentDate(new Date())
            }
            className={`
              px-5
              py-2.5
              rounded-xl
              text-white
              font-medium
              ${currentTheme.primary}
            `}
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}

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
        <div className="grid grid-cols-7 gap-3 mb-3">
          {[
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ].map((day) => (
            <div
              key={day}
              className={`
                text-center
                py-2
                font-semibold
                ${currentTheme.textSecondary}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {Array.from({
            length: getDay(monthStart),
          }).map((_, index) => (
            <div
              key={index}
              className="min-h-[120px]"
            />
          ))}

          {monthDays.map((date) => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
            />
          ))}
        </div>
      </div>

      {/* Selected Day Bookings */}

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
        <h3
          className={`
            text-xl
            font-semibold
            mb-5
            ${currentTheme.text}
          `}
        >
          Bookings for{' '}
          {format(
            selectedDate,
            'MMMM d, yyyy'
          )}
        </h3>

        {getDayBookings(selectedDate)
          .length === 0 ? (
          <div className="text-center py-12">
            <Calendar
              className="
                w-16
                h-16
                mx-auto
                opacity-30
                mb-4
              "
            />

            <p
              className={`
                ${currentTheme.textSecondary}
              `}
            >
              No bookings scheduled for
              this date.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {getDayBookings(
              selectedDate
            ).map((booking) => {
              const resource =
                data.resources.find(
                  (r) =>
                    r.id ===
                    booking.resourceId
                );

              const user =
                data.users.find(
                  (u) =>
                    u.id === booking.userId
                );

              return (
                <div
                  key={booking.id}
                  className={`
                    flex
                    items-center
                    gap-4
                    p-4
                    rounded-2xl
                    hover:shadow-md
                    transition-all
                    ${currentTheme.secondary}
                  `}
                >
                  <div className="w-16 text-center">
                    <p
                      className={`
                        text-lg
                        font-bold
                        ${currentTheme.text}
                      `}
                    >
                      {format(
                        booking.start,
                        'h:mm'
                      )}
                    </p>

                    <p
                      className={`
                        text-xs
                        ${currentTheme.textSecondary}
                      `}
                    >
                      {format(
                        booking.start,
                        'a'
                      )}
                    </p>
                  </div>

                  <div className="w-px h-10 bg-gray-300" />

                  <div className="flex-1">
                    <p
                      className={`
                        font-medium
                        ${currentTheme.text}
                      `}
                    >
                      {booking.title}
                    </p>

                    <p
                      className={`
                        text-sm
                        ${currentTheme.textSecondary}
                      `}
                    >
                      {resource?.name} •{' '}
                      {user?.name}
                    </p>
                  </div>

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${
                        booking.status ===
                        'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status ===
                            'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {booking.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;