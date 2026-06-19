import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Bell } from 'lucide-react';
import { useApp } from '../Context/AppContext';

const NotificationToast = () => {
  const { notifications, currentTheme } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(n => (
        <div key={n.id} className={`${getColor(n.type)} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in max-w-md`}>
          {getIcon(n.type)}
          <span className="text-sm font-medium">{n.message}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
