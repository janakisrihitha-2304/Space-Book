import React, { useState, useCallback, useMemo } from 'react';
import { generateMockData, THEMES } from '../Services/data';

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('glass'); // Default to glassmorphism
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState(() => generateMockData());
  const [notifications, setNotifications] = useState([]);
  const [undoAction, setUndoAction] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const currentTheme = THEMES[theme];

  // Theme toggle function
  const toggleTheme = useCallback((themeName) => {
    setTheme(themeName);
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const login = useCallback((userId) => {
    const user = data.users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      addNotification(`Welcome back, ${user.name}!`, 'success');
    }
  }, [data.users, addNotification]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    addNotification('Logged out successfully', 'info');
  }, [addNotification]);

  const addBooking = useCallback((booking) => {
    const newBooking = {
      ...booking,
      id: `b${Date.now()}`,
      createdAt: new Date(),
      checkedIn: false,
      qrCode: `QR-${booking.userId}-${booking.resourceId}-${Date.now()}`,
      extended: false,
      recurring: booking.recurring || null,
    };
    setData(prev => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
      activities: [{
        id: `a${Date.now()}`,
        type: 'booking',
        userId: booking.userId,
        resourceId: booking.resourceId,
        timestamp: new Date(),
        description: `Booked ${prev.resources.find(r => r.id === booking.resourceId)?.name}`,
      }, ...prev.activities],
    }));
    addNotification('Booking confirmed successfully!', 'success');
    return newBooking;
  }, [addNotification]);

  const updateBooking = useCallback((bookingId, updates) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, ...updates } : b),
      activities: [{
        id: `a${Date.now()}`,
        type: 'update',
        userId: currentUser?.id || 'unknown',
        resourceId: prev.bookings.find(b => b.id === bookingId)?.resourceId,
        timestamp: new Date(),
        description: `Updated booking`,
      }, ...prev.activities],
    }));
    addNotification('Booking updated successfully!', 'success');
  }, [currentUser, addNotification]);

  const cancelBooking = useCallback((bookingId) => {
    const booking = data.bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setUndoAction({
      type: 'cancel',
      data: booking,
      timeout: setTimeout(() => setUndoAction(null), 10000),
    });

    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b),
      activities: [{
        id: `a${Date.now()}`,
        type: 'cancel',
        userId: currentUser?.id || 'unknown',
        resourceId: booking.resourceId,
        timestamp: new Date(),
        description: `Cancelled booking for ${prev.resources.find(r => r.id === booking.resourceId)?.name}`,
      }, ...prev.activities],
    }));
    addNotification('Booking cancelled. Click undo to restore.', 'warning');
  }, [data.bookings, currentUser, addNotification]);

  const undoCancel = useCallback(() => {
    if (!undoAction || undoAction.type !== 'cancel') return;
    clearTimeout(undoAction.timeout);
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => 
        b.id === undoAction.data.id ? { ...undoAction.data, status: 'confirmed' } : b
      ),
    }));
    setUndoAction(null);
    addNotification('Booking restored successfully!', 'success');
  }, [undoAction, addNotification]);

  const addToWaitlist = useCallback((waitlistEntry) => {
    const newEntry = {
      ...waitlistEntry,
      id: `w${Date.now()}`,
      position: data.waitlist.filter(w => w.resourceId === waitlistEntry.resourceId && w.status === 'waiting').length + 1,
      status: 'waiting',
    };
    setData(prev => ({
      ...prev,
      waitlist: [...prev.waitlist, newEntry],
    }));
    addNotification(`Added to waitlist. Position: ${newEntry.position}`, 'info');
  }, [data.waitlist, addNotification]);

  const approveBooking = useCallback((bookingId) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b),
    }));
    addNotification('Booking approved!', 'success');
  }, [addNotification]);

  const rejectBooking = useCallback((bookingId) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, status: 'rejected' } : b),
    }));
    addNotification('Booking rejected.', 'info');
  }, [addNotification]);

  const checkIn = useCallback((bookingId) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, checkedIn: true } : b),
      activities: [{
        id: `a${Date.now()}`,
        type: 'checkin',
        userId: currentUser?.id || 'unknown',
        resourceId: prev.bookings.find(b => b.id === bookingId)?.resourceId,
        timestamp: new Date(),
        description: `Checked in`,
      }, ...prev.activities],
    }));
    addNotification('Check-in successful!', 'success');
  }, [currentUser, addNotification]);

  const addReview = useCallback((review) => {
    const newReview = {
      ...review,
      id: `rev${Date.now()}`,
      date: new Date(),
    };
    setData(prev => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
      activities: [{
        id: `a${Date.now()}`,
        type: 'review',
        userId: review.userId,
        resourceId: review.resourceId,
        timestamp: new Date(),
        description: `Left a ${review.rating}-star review`,
      }, ...prev.activities],
    }));
    addNotification('Review submitted!', 'success');
  }, [addNotification]);

  const scheduleMaintenance = useCallback((resourceId, maintenanceData) => {
    setData(prev => ({
      ...prev,
      resources: prev.resources.map(r => 
        r.id === resourceId ? { ...r, maintenance: maintenanceData } : r
      ),
    }));
    addNotification('Maintenance scheduled!', 'info');
  }, [addNotification]);

  const extendBooking = useCallback((bookingId, newEndTime) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => 
        b.id === bookingId ? { ...b, end: newEndTime, extended: true } : b
      ),
    }));
    addNotification('Booking extended!', 'success');
  }, [addNotification]);

  const value = useMemo(() => ({
    theme, setTheme, toggleTheme,
    currentTheme,
    currentUser, login, logout,
    data, setData,
    addBooking, updateBooking, cancelBooking, undoCancel, undoAction,
    addToWaitlist, approveBooking, rejectBooking,
    checkIn, addReview, scheduleMaintenance, extendBooking,
    notifications, addNotification,
    viewMode, setViewMode,
  }), [theme, currentTheme, currentUser, data, undoAction, notifications, viewMode, login, logout, addBooking, updateBooking, cancelBooking, undoCancel, addToWaitlist, approveBooking, rejectBooking, checkIn, addReview, scheduleMaintenance, extendBooking, addNotification]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};