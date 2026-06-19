import React, { useState } from 'react';
import { Clock, BookOpen, Wrench, Users, CheckCircle, XCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../Context/AppContext';
import Badge from '../Components/Badge';

const AdminPage = () => {
  const { currentTheme, data, approveBooking, rejectBooking, scheduleMaintenance } = useApp();
  const [activeTab, setActiveTab] = useState('approvals');
  const [selectedResource, setSelectedResource] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({ start: '', end: '', reason: '' });
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const pendingBookings = data.bookings.filter(b => b.status === 'pending');
  const allBookings = data.bookings;
  const allUsers = data.users;

  const handleScheduleMaintenance = () => {
    if (selectedResource && maintenanceForm.start && maintenanceForm.end) {
      scheduleMaintenance(selectedResource.id, {
        start: new Date(maintenanceForm.start),
        end: new Date(maintenanceForm.end),
        reason: maintenanceForm.reason,
      });
      setShowMaintenanceModal(false);
      setMaintenanceForm({ start: '', end: '', reason: '' });
      setSelectedResource(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-2`}>
        <div className="flex gap-2">
          {[
            { id: 'approvals', label: 'Pending Approvals', icon: Clock },
            { id: 'bookings', label: 'All Bookings', icon: BookOpen },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'users', label: 'Users', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? `${currentTheme.primary} text-white` : `${currentTheme.secondary} ${currentTheme.textSecondary}`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'approvals' && (
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Pending Approvals ({pendingBookings.length})</h3>
          {pendingBookings.length === 0 ? (
            <p className={`text-center py-8 ${currentTheme.textSecondary}`}>No pending approvals</p>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map(booking => {
                const resource = data.resources.find(r => r.id === booking.resourceId);
                const user = data.users.find(u => u.id === booking.userId);
                return (
                  <div key={booking.id} className={`${currentTheme.secondary} rounded-lg p-5`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                          {user?.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-medium ${currentTheme.text}`}>{booking.title}</p>
                          <p className={`text-sm ${currentTheme.textSecondary}`}>{user?.name} ({user?.role}) &bull; {resource?.name}</p>
                          <p className={`text-sm ${currentTheme.textSecondary}`}>{format(booking.start, 'MMM dd, h:mm a')} - {format(booking.end, 'h:mm a')}</p>
                          <Badge variant={user?.priority === 'high' ? 'danger' : user?.priority === 'medium' ? 'warning' : 'default'}>{user?.priority} priority</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => rejectBooking(booking.id)} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => approveBooking(booking.id)} className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>All Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${currentTheme.border} border-b`}>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${currentTheme.textSecondary}`}>Title</th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${currentTheme.textSecondary}`}>User</th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${currentTheme.textSecondary}`}>Resource</th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${currentTheme.textSecondary}`}>Date</th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${currentTheme.textSecondary}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map(booking => {
                  const resource = data.resources.find(r => r.id === booking.resourceId);
                  const user = data.users.find(u => u.id === booking.userId);
                  return (
                    <tr key={booking.id} className={`${currentTheme.border} border-b hover:${currentTheme.secondary}`}>
                      <td className={`py-3 px-4 text-sm ${currentTheme.text}`}>{booking.title}</td>
                      <td className={`py-3 px-4 text-sm ${currentTheme.text}`}>{user?.name}</td>
                      <td className={`py-3 px-4 text-sm ${currentTheme.text}`}>{resource?.name}</td>
                      <td className={`py-3 px-4 text-sm ${currentTheme.textSecondary}`}>{format(booking.start, 'MMM dd, h:mm a')}</td>
                      <td className="py-3 px-4">
                        <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'default'}>{booking.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>Schedule Maintenance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.resources.map(resource => (
              <div key={resource.id} className={`${currentTheme.secondary} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`font-medium ${currentTheme.text}`}>{resource.name}</p>
                  <Badge variant={resource.maintenance ? 'warning' : 'success'}>{resource.maintenance ? 'Maintenance' : 'Active'}</Badge>
                </div>
                {resource.maintenance && (
                  <div className="mb-3">
                    <p className={`text-xs ${currentTheme.textSecondary}`}>{format(resource.maintenance.start, 'MMM dd')} - {format(resource.maintenance.end, 'MMM dd')}</p>
                    <p className={`text-xs ${currentTheme.textSecondary}`}>{resource.maintenance.reason}</p>
                  </div>
                )}
                <button onClick={() => { setSelectedResource(resource); setShowMaintenanceModal(true); }} className={`w-full py-2 rounded-lg text-sm font-medium ${currentTheme.primary} text-white hover:opacity-90`}>
                  {resource.maintenance ? 'Update Maintenance' : 'Schedule Maintenance'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>All Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUsers.map(user => {
              const userBookings = data.bookings.filter(b => b.userId === user.id && b.status !== 'cancelled').length;
              return (
                <div key={user.id} className={`${currentTheme.secondary} rounded-lg p-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 ${currentTheme.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-medium ${currentTheme.text}`}>{user.name}</p>
                      <p className={`text-xs ${currentTheme.textSecondary}`}>{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className={`text-xs ${currentTheme.textSecondary}`}>Role: <span className={currentTheme.text}>{user.role}</span></p>
                    <p className={`text-xs ${currentTheme.textSecondary}`}>Department: <span className={currentTheme.text}>{user.department}</span></p>
                    <p className={`text-xs ${currentTheme.textSecondary}`}>Priority: <span className={currentTheme.text}>{user.priority}</span></p>
                    <p className={`text-xs ${currentTheme.textSecondary}`}>Bookings: <span className={currentTheme.text}>{userBookings}</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentTheme.card} rounded-2xl shadow-2xl w-full max-w-md p-6`}>
            <h3 className={`text-xl font-bold ${currentTheme.text} mb-4`}>Schedule Maintenance for {selectedResource.name}</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Start Date</label>
                <input type="date" value={maintenanceForm.start} onChange={(e) => setMaintenanceForm({...maintenanceForm, start: e.target.value})} className={`w-full px-4 py-2 ${currentTheme.bg} ${currentTheme.border} border rounded-lg ${currentTheme.text}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>End Date</label>
                <input type="date" value={maintenanceForm.end} onChange={(e) => setMaintenanceForm({...maintenanceForm, end: e.target.value})} className={`w-full px-4 py-2 ${currentTheme.bg} ${currentTheme.border} border rounded-lg ${currentTheme.text}`} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Reason</label>
                <textarea value={maintenanceForm.reason} onChange={(e) => setMaintenanceForm({...maintenanceForm, reason: e.target.value})} placeholder="Maintenance reason..." rows={3} className={`w-full px-4 py-2 ${currentTheme.bg} ${currentTheme.border} border rounded-lg ${currentTheme.text}`} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowMaintenanceModal(false)} className={`flex-1 py-2.5 ${currentTheme.secondary} rounded-lg text-sm font-medium ${currentTheme.text}`}>Cancel</button>
              <button onClick={handleScheduleMaintenance} className={`flex-1 ${currentTheme.primary} text-white py-2.5 rounded-lg text-sm font-medium`}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
