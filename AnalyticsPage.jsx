import React from 'react';
import { BookOpen, Zap, Clock, Star } from 'lucide-react';
import { format, getHours, isWithinInterval } from 'date-fns';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../Context/AppContext';

const AnalyticsPage = () => {
  const { currentTheme, data } = useApp();

  const resourceBookings = data.resources.map(resource => ({
    name: resource.name,
    bookings: data.bookings.filter(b => b.resourceId === resource.id && b.status !== 'cancelled').length,
  })).sort((a, b) => b.bookings - a.bookings);

  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    bookings: data.bookings.filter(b => b.status !== 'cancelled' && getHours(b.start) === hour).length,
  }));

  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
    day,
    bookings: data.bookings.filter(b => b.status !== 'cancelled' && format(b.start, 'EEE') === day).length,
  }));

  const typeDistribution = [
    { name: 'Rooms', value: data.bookings.filter(b => data.resources.find(r => r.id === b.resourceId)?.type === 'room').length },
    { name: 'Equipment', value: data.bookings.filter(b => data.resources.find(r => r.id === b.resourceId)?.type === 'equipment').length },
    { name: 'Halls', value: data.bookings.filter(b => data.resources.find(r => r.id === b.resourceId)?.type === 'hall').length },
    { name: 'Pods', value: data.bookings.filter(b => data.resources.find(r => r.id === b.resourceId)?.type === 'pod').length },
  ];

  const statusData = [
    { name: 'Confirmed', value: data.bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Pending', value: data.bookings.filter(b => b.status === 'pending').length },
    { name: 'Completed', value: data.bookings.filter(b => b.status === 'completed').length },
    { name: 'Cancelled', value: data.bookings.filter(b => b.status === 'cancelled').length },
  ];

  const userActivity = data.users.map(user => ({
    name: user.name.split(' ')[0],
    bookings: data.bookings.filter(b => b.userId === user.id && b.status !== 'cancelled').length,
    reviews: data.reviews.filter(r => r.userId === user.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: data.bookings.length, icon: BookOpen },
          { label: 'Active Now', value: data.bookings.filter(b => b.status === 'confirmed' && isWithinInterval(new Date(), { start: b.start, end: b.end })).length, icon: Zap },
          { label: 'Pending Approval', value: data.bookings.filter(b => b.status === 'pending').length, icon: Clock },
          { label: 'Total Reviews', value: data.reviews.length, icon: Star },
        ].map((stat, index) => (
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
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Most Booked Resources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resourceBookings.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="bookings" fill={currentTheme.chart[0]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Peak Booking Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" style={{ fontSize: '12px' }} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="bookings" stroke={currentTheme.chart[0]} fill={currentTheme.chart[0]} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Weekly Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill={currentTheme.chart[1]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Resource Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={currentTheme.chart[index % currentTheme.chart.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Booking Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={currentTheme.chart[index % currentTheme.chart.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>User Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookings" name="Bookings" fill={currentTheme.chart[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="reviews" name="Reviews" fill={currentTheme.chart[2]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Resource Popularity Ranking</h3>
        <div className="space-y-3">
          {resourceBookings.slice(0, 5).map((resource, index) => (
            <div key={resource.name} className={`flex items-center gap-4 p-4 ${currentTheme.secondary} rounded-lg`}>
              <div className={`w-10 h-10 ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                #{index + 1}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${currentTheme.text}`}>{resource.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${currentTheme.primary} rounded-full`} style={{ width: `${(resource.bookings / resourceBookings[0].bookings) * 100}%` }}></div>
                  </div>
                  <span className={`text-sm ${currentTheme.textSecondary} w-16`}>{resource.bookings} bookings</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
