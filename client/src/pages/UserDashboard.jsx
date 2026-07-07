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
        setBookings(bookingsResponse.data);
        setUtilities(utilitiesResponse.data);
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
    const now = new Date().getTime();
    return bookings
      .filter((b) => b?.startTime && b.status !== 'cancelled' && new Date(b.startTime).getTime() > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  }, [bookings]);

  const topUtilities = useMemo(() => {
    if (!utilities.length) return [];
    const tally = {};
    bookings.forEach(b => {
      const uid = b.utilityId?._id || b.utilityId;
      if (uid) tally[uid] = (tally[uid] || 0) + 1;
    });
    
    return [...utilities]
      .sort((a, b) => (tally[b._id] || 0) - (tally[a._id] || 0))
      .slice(0, 3);
  }, [bookings, utilities]);

  return (
    <div className="dash-container-new">
      <DashboardHeader userName={user?.name} />
      
      {error && <p className="dashboard-inline-error">{error}</p>}
      
      <NextBookingBanner booking={upcomingBooking} isLoading={isLoading} />
      
      <DashboardStatsGrid stats={stats} isLoading={isLoading} />
      
      <div className="dash-panels-container">
        <RecentBookingsPanel bookings={bookings.slice(0, 3)} isLoading={isLoading} />
        <QuickBookPanel utilities={topUtilities} isLoading={isLoading} />
      </div>
    </div>
  );
}
