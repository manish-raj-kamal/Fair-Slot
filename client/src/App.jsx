import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/useAuth.js';
import AppLayout from './layouts/AppLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import UtilitiesPage from './pages/UtilitiesPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUtilities from './pages/AdminUtilities.jsx';
import AdminBookings from './pages/AdminBookings.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import AuditLogsPage from './pages/AuditLogsPage.jsx';
import OrgVerificationPage from './pages/OrgVerificationPage.jsx';
import AdminOrganizations from './pages/AdminOrganizations.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AppLoadingScreen from './components/AppLoadingScreen.jsx';

const getDefaultRouteForUser = (user) => {
  if (!user) return '/login';
  if (user.role === 'superadmin') return '/admin/organizations';
  if (user.role === 'org_admin') return '/admin';
  return user.organizationId ? '/dashboard' : '/verification';
};

const ProtectedRoute = ({ children, allowedRoles = null, requireOrganization = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoadingScreen message="Checking your account and loading your workspace..." />;

  if (!user) return <Navigate to="/login" />;

  if (requireOrganization && user.role !== 'superadmin' && !user.organizationId) {
    return <Navigate to="/verification" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForUser(user)} />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AppLoadingScreen message="Booting FairSlot..." />;
  if (user) {
    return <Navigate to={getDefaultRouteForUser(user)} />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Universal: all logged-in users */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Member + Org Admin: view/book utilities (no superadmin) */}
      <Route element={<ProtectedRoute allowedRoles={['member', 'org_admin']} requireOrganization><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/utilities" element={<UtilitiesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Route>

      {/* Org Admin + Superadmin: admin home + analytics */}
      <Route element={<ProtectedRoute allowedRoles={['org_admin', 'superadmin']} requireOrganization><AppLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Org Admin only: manage utilities, bookings, members */}
      <Route element={<ProtectedRoute allowedRoles={['org_admin']} requireOrganization><AppLayout /></ProtectedRoute>}>
        <Route path="/admin/utilities" element={<AdminUtilities />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* Logged-in users: join/create organization */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/verification" element={<OrgVerificationPage />} />
      </Route>

      {/* Superadmin only: organisations list, audit logs */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin']} requireOrganization><AppLayout /></ProtectedRoute>}>
        <Route path="/admin/organizations" element={<AdminOrganizations />} />
        <Route path="/admin/audit" element={<AuditLogsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
