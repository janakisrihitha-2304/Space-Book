import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, BookOpen, CalendarDays, Clock, Users, Star, Zap } from 'lucide-react';
import { format, isFuture, isToday } from 'date-fns';
import { useApp } from '../Context/AppContext';

const DashboardPage = () => {
  const { currentTheme, data, currentUser } = useApp();
  const navigate = useNavigate();

  const userBookings = data.bookings.filter(b => b.userId === currentUser?.id && b.status !== 'cancelled');
  const upcomingBookings = userBookings.filter(b => isFuture(b.start) || isToday(b.start));
  const pendingApprovals = data.bookings.filter(b => b.status === 'pending');
  const waitlistEntries = data.waitlist.filter(w => w.userId === currentUser?.id);

  const stats = [
    { label: 'Total Bookings', value: userBookings.length, icon: BookOpen },
    { label: 'Upcoming', value: upcomingBookings.length, icon: CalendarDays },
    { label: 'Pending Approval', value: pendingApprovals.length, icon: Clock },
    { label: 'Waitlist', value: waitlistEntries.length, icon: Users },
  ];

  const recentActivity = data.activities.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${currentTheme.text}`}>
              Welcome back, {currentUser?.name || 'Guest'}!
            </h2>
            <p className={`${currentTheme.textSecondary} mt-1`}>
              You have {upcomingBookings.length} upcoming bookings and {waitlistEntries.length} items in your waitlist.
            </p>
          </div>
          <button 
            onClick={() => navigate('/resources')}
            className={`${currentTheme.primary} text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity`}
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${currentTheme.textSecondary}`}>{stat.label}</p>
                <p className={`text-3xl font-bold ${currentTheme.text} mt-1`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${currentTheme.secondary} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${currentTheme.primaryText}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Upcoming Bookings</h3>
            <button onClick={() => navigate('/bookings')} className={`text-sm ${currentTheme.primaryText} hover:underline`}>View all</button>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className={`text-center py-8 ${currentTheme.textSecondary}`}>
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming bookings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.slice(0, 4).map(booking => {
                const resource = data.resources.find(r => r.id === booking.resourceId);
                return (
                  <div key={booking.id} className={`flex items-center gap-4 p-3 ${currentTheme.secondary} rounded-lg`}>
                    <div className={`w-12 h-12 ${currentTheme.primary} rounded-lg flex items-center justify-center text-white font-bold`}>
                      {format(booking.start, 'dd')}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${currentTheme.text}`}>{booking.title}</p>
                      <p className={`text-sm ${currentTheme.textSecondary}`}>
                        {resource?.name} &bull; {format(booking.start, 'MMM dd, h:mm a')} - {format(booking.end, 'h:mm a')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Activity Timeline</h3>
            <button onClick={() => navigate('/analytics')} className={`text-sm ${currentTheme.primaryText} hover:underline`}>View analytics</button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const user = data.users.find(u => u.id === activity.userId);
              const resource = data.resources.find(r => r.id === activity.resourceId);

              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full ${currentTheme.secondary} flex items-center justify-center`}>
                      <Zap className={`w-4 h-4 ${currentTheme.primaryText}`} />
                    </div>
                    {index < recentActivity.length - 1 && (
                      <div className={`w-0.5 h-full ${currentTheme.border} border-l mt-1`}></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm ${currentTheme.text}`}>
                      <span className="font-medium">{user?.name}</span> {activity.description}
                    </p>
                    <p className={`text-xs ${currentTheme.textSecondary} mt-0.5`}>
                      {resource?.name} &bull; {format(activity.timestamp, 'MMM dd, h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Book Resource', icon: Plus, action: () => navigate('/resources') },
            { label: 'View Calendar', icon: CalendarDays, action: () => navigate('/calendar') },
            { label: 'Check Waitlist', icon: Clock, action: () => navigate('/waitlist') },
            { label: 'Write Review', icon: Star, action: () => navigate('/reviews') },
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 ${currentTheme.secondary} rounded-xl hover:${currentTheme.primary} hover:text-white transition-all group`}
            >
              <action.icon className={`w-6 h-6 mx-auto mb-2 ${currentTheme.primaryText} group-hover:text-white`} />
              <p className={`text-sm font-medium ${currentTheme.text} group-hover:text-white`}>{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
