import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './Context/AppContext';
import Navigation from './Components/Navigation';
import NotificationToast from './Components/NotificationToast';
import UndoBanner from './Components/UndoBanner';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import ResourcesPage from './Pages/ResourcesPage';
import CalendarPage from './Pages/CalendarPage';
import MyBookingsPage from './Pages/MyBookingsPage';
import AnalyticsPage from './Pages/AnalyticsPage';
import WaitlistPage from './Pages/WaitlistPage';
import ReviewsPage from './Pages/ReviewsPage';
import AdminPage from './Pages/AdminPage';

const AppLayout = () => {
  const { currentTheme, currentUser, theme } = useApp();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (theme === 'glass') {
      document.body.classList.add('theme-glass');
    } else {
      document.body.classList.remove('theme-glass');
    }
  }, [theme]);

  if (!currentUser && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  if (isLoginPage) {
    return <LoginPage />;
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} flex`}>
      <Navigation />
      <div className="flex-1 ml-64">
        <header className={`h-16 ${currentTheme.header} fixed top-0 right-0 left-64 z-30 flex items-center justify-between px-6`}>
          <h2 className={`text-xl font-semibold ${currentTheme.text}`}>
            {{
              '/': 'Dashboard',
              '/resources': 'Resources',
              '/calendar': 'Calendar',
              '/bookings': 'My Bookings',
              '/analytics': 'Analytics',
              '/waitlist': 'Waitlist',
              '/reviews': 'Reviews',
              '/admin': 'Admin Panel',
            }[location.pathname] || 'SpaceBook'}
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => {}} className={`p-2 rounded-lg ${currentTheme.secondary}`}>
              <span className="sr-only">Notifications</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>
        <main className="pt-16 p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
      <NotificationToast />
      <UndoBanner />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default App;