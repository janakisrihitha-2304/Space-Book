# PS-10 Resource Booking & Availability System

A complete, production-grade React application for resource booking and management with advanced features.

## Features

### Core Features
- Smart Booking Recommendation (suggests alternatives when unavailable)
- Waitlist System (with position tracking)
- QR Code Check-In (simulated with visual QR)
- Resource Usage Analytics (6 chart types)
- Resource Popularity Ranking
- Booking Priority Levels (faculty/student/guest)
- Resource Maintenance Scheduling
- Interactive Resource Cards with live status
- Multi-Day Booking support
- Booking Approval Workflow
- Booking Extension
- Recurring Bookings (daily/weekly/monthly)
- Live Resource Status (current user + remaining time)
- Ratings & Reviews system
- Undo Cancellation (10-second window)
- Activity Timeline
- Booking Heatmap
- Theme Customizer (4 themes)
- Personalized Dashboard
- Responsive Design
- Role-Based Access Control

### Tech Stack
- React 18
- React Router 6
- Recharts (charts & visualization)
- date-fns (date manipulation)
- Lucide React (icons)
- Tailwind CSS (styling)
- Context API (state management)

## Project Structure

```
src/
  Components/
    Badge.jsx
    BookingForm.jsx
    BookingListItem.jsx
    LoadingSpinner.jsx
    Navigation.jsx
    NotificationToast.jsx
    ResourceCard.jsx
    ResourceDetailPage.jsx
    ResourceListPage.jsx
    ResourceTypeIcon.jsx
    TimeSlotGrid.jsx
    UndoBanner.jsx
  Pages/
    LoginPage.jsx
    DashboardPage.jsx
    ResourcesPage.jsx
    CalendarPage.jsx
    MyBookingsPage.jsx
    AnalyticsPage.jsx
    WaitlistPage.jsx
    ReviewsPage.jsx
    AdminPage.jsx
  Context/
    AppContext.js
  Services/
    data.js
    utils.js
  App.js
  App.css
  index.js
  index.css
```

## Setup Instructions

1. **Create React App:**
   ```bash
   npx create-react-app ps10-resource-booking
   cd ps10-resource-booking
   ```

2. **Install Dependencies:**
   ```bash
   npm install react-router-dom recharts date-fns lucide-react
   ```

3. **Install Tailwind CSS:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Configure Tailwind:**
   Update `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     darkMode: 'class',
     theme: { extend: {} },
     plugins: [],
   }
   ```

5. **Add Tailwind Directives:**
   In `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

6. **Copy Project Files:**
   Copy all files from this project into your `src/` directory.

7. **Start the App:**
   ```bash
   npm start
   ```

## User Roles

| Role | Priority | Auto-Approval | Access |
|------|----------|---------------|--------|
| Faculty | High | Yes | Full |
| Student | Medium | No | Full |
| Guest | Low | No | Limited |
| Admin | High | Yes | Admin Panel |

## Pages

- `/` - Dashboard (personalized overview)
- `/resources` - Resource Catalog (search, filter, book)
- `/calendar` - Calendar View (heatmap, bookings)
- `/bookings` - My Bookings (manage, check-in, extend, review)
- `/analytics` - Analytics Dashboard (charts, rankings)
- `/waitlist` - Waitlist Management
- `/reviews` - Reviews & Ratings
- `/admin` - Admin Panel (approvals, maintenance, users)
- `/login` - User Selection (simulated auth)

## License

MIT
