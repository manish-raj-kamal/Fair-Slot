import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/useAuth.js';
import { getMyBookings, getUserStats, getUtilities } from '../services/api.js';

import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import NextBookingBanner from '../components/dashboard/NextBookingBanner.jsx';
import DashboardStatsGrid from '../components/dashboard/DashboardStatsGrid.jsx';
import RecentBookingsPanel from '../components/dashboard/RecentBookingsPanel.jsx';
import QuickBookPanel from '../components/dashboard/QuickBookPanel.jsx';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [utilities, setUtilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Dashboard | FairSlot';
  }, []);

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [statsResponse, bookingsResponse, utilitiesResponse] = await Promise.all([
          getUserStats(),
          getMyBookings(),
          getUtilities()
        ]);

        if (!active) return;
        setStats(statsResponse.data);
        setBookings(bookingsResponse.data.slice(0, 5));
        setUtilities(utilitiesResponse.data.slice(0, 4));
      } catch {
        if (!active) return;
        setError('Unable to load your latest dashboard data. Please refresh the page.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const upcomingBooking = useMemo(() => {
    return bookings
      .filter((b) => b?.startTime && b.status !== 'cancelled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  }, [bookings]);

  return (
    <div className="dash-container-new">
      <DashboardHeader userName={user?.name} />
      
      {error && <p className="dashboard-inline-error">{error}</p>}
      
      <NextBookingBanner booking={upcomingBooking} isLoading={isLoading} />
      
      <DashboardStatsGrid stats={stats} isLoading={isLoading} />
      
      <div className="dash-panels-container">
        <RecentBookingsPanel bookings={bookings} isLoading={isLoading} />
        <QuickBookPanel utilities={utilities} isLoading={isLoading} />
      </div>
    </div>
  );
}
