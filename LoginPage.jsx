import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../Context/AppContext';

const LoginPage = () => {
  const { login, currentTheme, data, setData, addNotification } = useApp();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = data.users.find(u => u.email === email && u.password === password);
    if (user) {
      login(user.id);
      navigate('/');
    } else {
      addNotification('Invalid email or password', 'error');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (data.users.some(u => u.email === email)) {
      addNotification('Email already registered', 'error');
      return;
    }

    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role,
      department,
      priority: role === 'admin' ? 'high' : 'medium',
    };

    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser],
    }));

    addNotification('Account created! Please log in.', 'success');
    setIsRegistering(false);
    setEmail('');
    setPassword('');
    setName('');
    setDepartment('');
  };

  const handleQuickLogin = (userId) => {
    login(userId);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} flex items-center justify-center p-4`}>
      <div className={`${currentTheme.card} ${currentTheme.border} border rounded-2xl shadow-2xl p-8 w-full max-w-md`}>
        
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${currentTheme.primary} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${currentTheme.text}`}>SpaceBook</h1>
          <p className={`${currentTheme.textSecondary} mt-2`}>
            {isRegistering ? 'Create your SpaceBook account' : 'Sign in to SpaceBook'}
          </p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
          
          {isRegistering && (
            <div>
              <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="user@company.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary}`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegistering && (
            <>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Engineering"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${currentTheme.primary} text-white font-semibold hover:opacity-90 transition-opacity`}
          >
            {isRegistering ? (
              <>
                <UserPlus className="w-5 h-5" /> Create Account
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setEmail('');
              setPassword('');
              setName('');
              setDepartment('');
            }}
            className={`text-sm ${currentTheme.textSecondary} hover:underline`}
          >
            {isRegistering 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Register"}
          </button>
        </div>

        <div className={`my-6 border-t ${currentTheme.border}`} />

        <div>
          <p className={`text-xs font-semibold ${currentTheme.textSecondary} uppercase tracking-wider mb-3 text-center`}>
            Quick Login (Demo)
          </p>
          <div className="space-y-2">
            {data.users.slice(0, 3).map(user => (
              <button
                key={user.id}
                onClick={() => handleQuickLogin(user.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl ${currentTheme.secondary} hover:${currentTheme.primary} hover:text-white transition-all group text-sm`}
              >
                <div className={`w-8 h-8 rounded-full ${currentTheme.primary} text-white flex items-center justify-center font-bold group-hover:bg-white group-hover:text-blue-600`}>
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-medium">{user.name}</p>
                  <p className={`text-xs ${currentTheme.textSecondary} group-hover:text-blue-100`}>
                    {user.role} • {user.department}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;