import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  LayoutDashboard,
  Grid3X3,
  CalendarDays,
  BookOpen,
  BarChart3,
  Clock,
  Star,
  Shield,
  LogOut,
  User,
  Palette,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../Context/AppContext';

const Navigation = () => {
  const { currentTheme, currentUser, logout, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/resources', icon: Grid3X3, label: 'Resources' },
    { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { path: '/bookings', icon: BookOpen, label: 'Bookings' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/waitlist', icon: Clock, label: 'Waitlist' },
    { path: '/reviews', icon: Star, label: 'Reviews' },
  ];

  if (currentUser?.role === 'admin') {
    menuItems.push({
      path: '/admin',
      icon: Shield,
      label: 'Admin Panel',
    });
  }

  const themeOptions = [
    { key: 'light', label: 'Light', icon: '☀️' },
    { key: 'dark', label: 'Dark', icon: '🌙' },
    { key: 'blue', label: 'Ocean', icon: '🌊' },
    { key: 'purple', label: 'Royal', icon: '👑' },
    { key: 'glass', label: 'Glass', icon: '💎' },
  ];

  return (
    <aside
      className={`
        w-72
        h-screen
        fixed
        left-0
        top-0
        z-50
        flex
        flex-col
        ${currentTheme.sidebar}
      `}
    >
      {/* Logo Section */}
      <div className={`p-6 border-b ${currentTheme.border}`}>
        <div className="flex items-center gap-4">
          <div
            className={`
              w-12
              h-12
              rounded-xl
              flex
              items-center
              justify-center
              shadow-lg
              ${currentTheme.primary}
            `}
          >
            <Calendar className="w-6 h-6" />
          </div>

          <div>
            <h1 className={`text-xl font-bold ${currentTheme.text}`}>
              SpaceBook
            </h1>
            <p className={`text-xs ${currentTheme.textSecondary}`}>
              Smart Space Booking
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-300
                ${isActive
                  ? `${currentTheme.primary} shadow-lg scale-[1.02]`
                  : `${currentTheme.textSecondary} hover:bg-white/10 hover:text-gray-900`
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Theme Switcher */}
      <div className={`px-4 py-2 border-t ${currentTheme.border}`}>
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className={`
              w-full
              flex
              items-center
              justify-between
              px-4
              py-2.5
              rounded-xl
              text-sm
              font-medium
              ${currentTheme.secondary}
              ${currentTheme.text}
              transition-all
            `}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span>Theme: {themeOptions.find(t => t.key === theme)?.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
          </button>

          {showThemeMenu && (
            <div className={`
              absolute
              bottom-full
              left-0
              right-0
              mb-2
              rounded-xl
              overflow-hidden
              shadow-lg
              ${currentTheme.card}
              border
              ${currentTheme.border}
            `}>
              {themeOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    toggleTheme(option.key);
                    setShowThemeMenu(false);
                  }}
                  className={`
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-2.5
                    text-sm
                    transition-all
                    ${theme === option.key
                      ? `${currentTheme.primary} font-semibold`
                      : `${currentTheme.textSecondary} hover:bg-white/10`
                    }
                  `}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className={`p-4 border-t ${currentTheme.border}`}>
        {currentUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  font-bold
                  shadow-md
                  ${currentTheme.primary}
                `}
              >
                {currentUser.name?.charAt(0)}
              </div>

              <div className="min-w-0">
                <p className={`font-semibold truncate ${currentTheme.text}`}>
                  {currentUser.name}
                </p>
                <p className={`text-xs capitalize ${currentTheme.textSecondary}`}>
                  {currentUser.role}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-2.5
                rounded-xl
                bg-red-50/80
                backdrop-blur-sm
                text-red-600
                hover:bg-red-100
                transition-all
              "
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className={`
              w-full
              py-3
              rounded-xl
              font-medium
              flex
              items-center
              justify-center
              gap-2
              shadow-md
              ${currentTheme.primary}
            `}
          >
            <User className="w-4 h-4" />
            Login
          </button>
        )}
      </div>
    </aside>
  );
};

export default Navigation;