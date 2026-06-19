import { format, addDays, setHours, setMinutes, subMinutes } from 'date-fns';

export const THEMES = {
  light: {
    name: 'Light',
    bg: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    primary: 'bg-blue-600',
    primaryText: 'text-blue-600',
    primaryHover: 'hover:bg-blue-700',
    secondary: 'bg-gray-100',
    sidebar: 'bg-white',
    header: 'bg-white',
    chart: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    heatmapLow: '#DBEAFE',
    heatmapMid: '#3B82F6',
    heatmapHigh: '#1E40AF',
  },
  dark: {
    name: 'Dark',
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    primary: 'bg-blue-500',
    primaryText: 'text-blue-400',
    primaryHover: 'hover:bg-blue-600',
    secondary: 'bg-gray-700',
    sidebar: 'bg-gray-800',
    header: 'bg-gray-800',
    chart: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6'],
    heatmapLow: '#1E3A5F',
    heatmapMid: '#3B82F6',
    heatmapHigh: '#93C5FD',
  },
  blue: {
    name: 'Ocean Blue',
    bg: 'bg-slate-900',
    card: 'bg-slate-800',
    text: 'text-slate-100',
    textSecondary: 'text-slate-400',
    border: 'border-slate-700',
    primary: 'bg-cyan-500',
    primaryText: 'text-cyan-400',
    primaryHover: 'hover:bg-cyan-600',
    secondary: 'bg-slate-700',
    sidebar: 'bg-slate-800',
    header: 'bg-slate-800',
    chart: ['#06B6D4', '#14B8A6', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899'],
    heatmapLow: '#0F172A',
    heatmapMid: '#06B6D4',
    heatmapHigh: '#67E8F9',
  },
  purple: {
    name: 'Royal Purple',
    bg: 'bg-violet-950',
    card: 'bg-violet-900',
    text: 'text-violet-100',
    textSecondary: 'text-violet-300',
    border: 'border-violet-800',
    primary: 'bg-fuchsia-500',
    primaryText: 'text-fuchsia-400',
    primaryHover: 'hover:bg-fuchsia-600',
    secondary: 'bg-violet-800',
    sidebar: 'bg-violet-900',
    header: 'bg-violet-900',
    chart: ['#D946EF', '#A855F7', '#F59E0B', '#F43F5E', '#06B6D4', '#10B981'],
    heatmapLow: '#2E1065',
    heatmapMid: '#A855F7',
    heatmapHigh: '#E9D5FF',
  },
  glass: {
    name: 'Glassmorphism',
    bg: 'bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30',
    card: 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/5',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    border: 'border-white/40',
    primary: 'bg-white/30 backdrop-blur-md border border-white/50 text-gray-900 hover:bg-white/50 hover:shadow-lg',
    primaryText: 'text-gray-900',
    primaryHover: 'hover:bg-white/50',
    secondary: 'bg-white/15 backdrop-blur-md border border-white/25',
    sidebar: 'bg-white/15 backdrop-blur-2xl border-r border-white/30',
    header: 'bg-white/15 backdrop-blur-2xl border-b border-white/30',
    chart: ['rgba(99,102,241,0.8)', 'rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)', 'rgba(139,92,246,0.8)', 'rgba(236,72,153,0.8)'],
    heatmapLow: 'rgba(199,210,254,0.6)',
    heatmapMid: 'rgba(99,102,241,0.8)',
    heatmapHigh: 'rgba(67,56,202,0.9)',
  },
};



export const generateMockData = () => {
  const resources = [
    { 
      id: 'r1', 
      name: 'Conference Room A', 
      type: 'room', 
      capacity: 20, 
      location: 'Floor 1', 
      amenities: ['Projector', 'Whiteboard', 'Video Conf'], 
      rating: 4.5, 
      reviews: 12, 
      price: 50,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
      maintenance: null 
    },
    { 
      id: 'r2', 
      name: 'Conference Room B', 
      type: 'room', 
      capacity: 12, 
      location: 'Floor 1', 
      amenities: ['Whiteboard', 'TV'], 
      rating: 4.2, 
      reviews: 8, 
      price: 40,
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600',
      maintenance: null 
    },
    { 
      id: 'r3', 
      name: 'Seminar Hall', 
      type: 'hall', 
      capacity: 100, 
      location: 'Floor 2', 
      amenities: ['Projector', 'Sound System', 'Stage'], 
      rating: 4.8, 
      reviews: 25, 
      price: 150,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      maintenance: null 
    },
    { 
      id: 'r4', 
      name: 'Projector P1', 
      type: 'equipment', 
      capacity: 1, 
      location: 'Storage A', 
      amenities: ['HDMI', 'Wireless'], 
      rating: 4.0, 
      reviews: 6, 
      price: 10,
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600',
      maintenance: null 
    },
    { 
      id: 'r5', 
      name: 'Projector P2', 
      type: 'equipment', 
      capacity: 1, 
      location: 'Storage A', 
      amenities: ['HDMI', '4K'], 
      rating: 4.3, 
      reviews: 9, 
      price: 15,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
      maintenance: null 
    },
    { 
      id: 'r6', 
      name: 'Meeting Pod 1', 
      type: 'pod', 
      capacity: 4, 
      location: 'Floor 3', 
      amenities: ['TV', 'Phone'], 
      rating: 4.1, 
      reviews: 5, 
      price: 30,
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
      maintenance: null 
    },
    { 
      id: 'r7', 
      name: 'Meeting Pod 2', 
      type: 'pod', 
      capacity: 4, 
      location: 'Floor 3', 
      amenities: ['TV', 'Phone'], 
      rating: 4.1, 
      reviews: 5, 
      price: 30,
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600',
      maintenance: null 
    },
    { 
      id: 'r8', 
      name: 'Laptop L1', 
      type: 'equipment', 
      capacity: 1, 
      location: 'IT Desk', 
      amenities: ['i7', '16GB RAM'], 
      rating: 4.6, 
      reviews: 15, 
      price: 20,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
      maintenance: null 
    },
    { 
      id: 'r9', 
      name: 'Laptop L2', 
      type: 'equipment', 
      capacity: 1, 
      location: 'IT Desk', 
      amenities: ['i5', '8GB RAM'], 
      rating: 3.9, 
      reviews: 7, 
      price: 15,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=600',
      maintenance: null 
    },
    { 
      id: 'r10', 
      name: 'Board Room', 
      type: 'room', 
      capacity: 16, 
      location: 'Floor 2', 
      amenities: ['Projector', 'Whiteboard', 'Video Conf', 'Coffee'], 
      rating: 4.7, 
      reviews: 18, 
      price: 80,
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600',
      maintenance: null 
    },
  ];

  const users = [
    {
      id: 'u1',
      name: 'Admin User',
      email: 'admin@ps10.com',
      password: 'admin123',
      role: 'admin',
      department: 'IT',
      priority: 'high',
    },
    {
      id: 'u2', 
      name: 'John Doe',
      email: 'john@ps10.com',
      password: 'user123',
      role: 'user',
      department: 'Engineering',
      priority: 'medium',
    },
    {
      id: 'u3',
      name: 'Jane Smith',
      email: 'jane@ps10.com',
      password: 'user123',
      role: 'user',
      department: 'Marketing',
      priority: 'medium',
    },
    {
      id: 'u4',
      name: 'Bob Wilson',
      email: 'bob@ps10.com',
      password: 'user123',
      role: 'user',
      department: 'Sales',
      priority: 'low',
    },
    {
      id: 'u5',
      name: 'Alice Brown',
      email: 'alice@ps10.com',
      password: 'user123',
      role: 'user',
      department: 'HR',
      priority: 'low',
    },
  ];

  const today = new Date();
  const bookings = [];
  const waitlist = [];
  const activities = [];
  const reviews = [];

  const sampleBookings = [
    { userId: 'u1', resourceId: 'r1', title: 'CS Department Meeting', start: setHours(setMinutes(today, 0), 10), end: setHours(setMinutes(today, 0), 12), status: 'confirmed', priority: 'high' },
    { userId: 'u2', resourceId: 'r3', title: 'Physics Lecture', start: setHours(setMinutes(today, 0), 14), end: setHours(setMinutes(today, 0), 16), status: 'confirmed', priority: 'high' },
    { userId: 'u3', resourceId: 'r6', title: 'Group Study Session', start: setHours(setMinutes(today, 0), 9), end: setHours(setMinutes(today, 0), 11), status: 'confirmed', priority: 'medium' },
    { userId: 'u4', resourceId: 'r1', title: 'Business Presentation', start: setHours(setMinutes(addDays(today, 1), 0), 13), end: setHours(setMinutes(addDays(today, 1), 0), 15), status: 'pending', priority: 'medium' },
    { userId: 'u1', resourceId: 'r10', title: 'Research Discussion', start: setHours(setMinutes(addDays(today, -1), 0), 10), end: setHours(setMinutes(addDays(today, -1), 0), 12), status: 'completed', priority: 'high' },
    { userId: 'u3', resourceId: 'r4', title: 'Project Presentation', start: setHours(setMinutes(addDays(today, 2), 0), 15), end: setHours(setMinutes(addDays(today, 2), 0), 17), status: 'confirmed', priority: 'medium' },
    { userId: 'u5', resourceId: 'r2', title: 'Guest Meeting', start: setHours(setMinutes(addDays(today, 1), 0), 10), end: setHours(setMinutes(addDays(today, 1), 0), 11), status: 'pending', priority: 'low' },
  ];

  sampleBookings.forEach((b, i) => {
    bookings.push({
      id: `b${i + 1}`,
      ...b,
      createdAt: subMinutes(b.start, 1440),
      checkedIn: b.status === 'completed' ? true : false,
      qrCode: `QR-${b.userId}-${b.resourceId}-${Date.now()}`,
      extended: false,
      recurring: null,
    });
  });

  waitlist.push(
    { id: 'w1', userId: 'u3', resourceId: 'r1', desiredStart: setHours(setMinutes(today, 0), 10), desiredEnd: setHours(setMinutes(today, 0), 12), position: 1, status: 'waiting' },
    { id: 'w2', userId: 'u4', resourceId: 'r1', desiredStart: setHours(setMinutes(today, 0), 10), desiredEnd: setHours(setMinutes(today, 0), 12), position: 2, status: 'waiting' },
    { id: 'w3', userId: 'u5', resourceId: 'r3', desiredStart: setHours(setMinutes(today, 0), 14), desiredEnd: setHours(setMinutes(today, 0), 16), position: 1, status: 'waiting' },
  );

  const activityTypes = [
    { type: 'booking', color: 'blue' },
    { type: 'update', color: 'amber' },
    { type: 'cancel', color: 'red' },
    { type: 'checkin', color: 'green' },
    { type: 'review', color: 'purple' },
  ];

  for (let i = 0; i < 15; i++) {
    const act = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    activities.push({
      id: `a${i}`,
      type: act.type,
      userId: users[Math.floor(Math.random() * users.length)].id,
      resourceId: resources[Math.floor(Math.random() * resources.length)].id,
      timestamp: subMinutes(today, Math.floor(Math.random() * 2880)),
      description: `${act.type} activity recorded`,
    });
  }

  reviews.push(
    {
      id: 'rev1',
      userId: 'u1',
      resourceId: 'r1',
      rating: 5,
      comment: 'Great meeting room with excellent facilities!',
      date: subMinutes(today, 1440),
    },
    {
      id: 'rev2',
      userId: 'u2',
      resourceId: 'r3',
      rating: 4,
      comment: 'Seminar hall was spacious and well-equipped.',
      date: subMinutes(today, 2880),
    },
    {
      id: 'rev3',
      userId: 'u1',
      resourceId: 'r10',
      rating: 5,
      comment: 'Perfect for board meetings. Coffee service was great!',
      date: subMinutes(today, 4320),
    }
  );

  return { resources, users, bookings, waitlist, activities, reviews };
};