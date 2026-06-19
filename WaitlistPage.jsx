import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '../Context/AppContext';
import Badge from '../Components/Badge';

const WaitlistPage = () => {
  const { currentTheme, data, currentUser } = useApp();

  const myWaitlist = data.waitlist.filter(w => w.userId === currentUser?.id);
  const allWaitlist = currentUser?.role === 'admin' ? data.waitlist : myWaitlist;

  return (
    <div className="space-y-6">
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${currentTheme.text}`}>
            {currentUser?.role === 'admin' ? 'All Waitlist Entries' : 'My Waitlist'}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs ${currentTheme.secondary} ${currentTheme.textSecondary}`}>
            {allWaitlist.length} entries
          </span>
        </div>

        {allWaitlist.length === 0 ? (
          <div className={`text-center py-12 ${currentTheme.textSecondary}`}>
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No waitlist entries</p>
            <p className="text-sm mt-2">When resources are fully booked, you can join the waitlist</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allWaitlist.map(entry => {
              const resource = data.resources.find(r => r.id === entry.resourceId);
              const user = data.users.find(u => u.id === entry.userId);
              return (
                <div key={entry.id} className={`${currentTheme.card} ${currentTheme.border} border rounded-xl p-5`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${currentTheme.secondary} rounded-full flex items-center justify-center`}>
                      <span className={`text-2xl font-bold ${currentTheme.primaryText}`}>#{entry.position}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${currentTheme.text}`}>{resource?.name}</h4>
                      <p className={`text-sm ${currentTheme.textSecondary}`}>
                        Desired: {format(entry.desiredStart, 'MMM dd, h:mm a')} - {format(entry.desiredEnd, 'h:mm a')}
                      </p>
                      {currentUser?.role === 'admin' && (
                        <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                          User: {user?.name} ({user?.email})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={entry.status === 'waiting' ? 'warning' : 'success'}>{entry.status}</Badge>
                      <p className={`text-xs ${currentTheme.textSecondary} mt-1`}>
                        {entry.status === 'waiting' && `Waiting for cancellation`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistPage;
