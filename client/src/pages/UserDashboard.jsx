import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { getMyBookings, getUserStats, getUtilities } from '../services/api.js';
import W8Icon from '../components/W8Icon.jsx';

const greetingByHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const statConfig = [
  { key: 'totalBookings', label: 'Total Bookings', iconName: 'bookings', color: '#2f6fed' },
  { key: 'activeBookings', label: 'Active Now', iconName: 'utilities', color: '#0ea95f' },
  { key: 'totalHours', label: 'Hours Used', iconName: 'clock', color: '#d97706' },
  { key: 'totalSpent', label: 'Amount Spent', iconName: 'coins', color: '#0284c7', prefix: '₹' }
];

const formatBookingDate = (value) =>
  new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

const formatStatValue = (config, value) => {
  if (value === null || value === undefined) return '--';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '--';
  return `${config.prefix || ''}${numeric.toLocaleString('en-IN')}`;
};

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

  const firstName = user?.name?.split(' ')[0] || 'Member';
  const completionRate = useMemo(() => {
    if (!stats?.totalBookings) return 0;
    const completed = stats.totalBookings - (stats.cancelledBookings || 0);
    return Math.max(0, Math.round((completed / stats.totalBookings) * 100));
  }, [stats]);

  const activeShare = useMemo(() => {
    if (!stats?.totalBookings) return 0;
    return Math.round(((stats.activeBookings || 0) / stats.totalBookings) * 100);
  }, [stats]);

  const upcomingBooking = useMemo(() => {
    return bookings
      .filter((b) => b?.startTime && b.status !== 'cancelled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  }, [bookings]);

  return (
    <div className="dashboard-luxe user-dashboard-luxe">
      <section className="dashboard-hero dashboard-surface">
        <div className="hero-copy">
          <p className="dashboard-eyebrow">Member workspace</p>
          <h1>{greetingByHour()}, {firstName}</h1>
          <p className="dashboard-subtitle">
            {isLoading
              ? 'Loading your booking activity and utility availability.'
              : upcomingBooking
              ? `Next booking: ${upcomingBooking?.utilityId?.name || 'Utility'} on ${formatBookingDate(upcomingBooking.startTime)}.`
              : 'No upcoming booking yet. Reserve your next slot to secure preferred time windows.'}
          </p>
          <div className="hero-meta-row">
            <div className="hero-meta-chip">
              <span>Completion</span>
              <strong>{isLoading ? '--' : `${completionRate}%`}</strong>
            </div>
            <div className="hero-meta-chip">
              <span>Active Share</span>
              <strong>{isLoading ? '--' : `${activeShare}%`}</strong>
            </div>
            <div className="hero-meta-chip">
              <span>Utilities Live</span>
              <strong>{isLoading ? '--' : utilities.length}</strong>
            </div>
          </div>
        </div>
        <div className="hero-actions">
          <Link to="/utilities" className="btn primary dashboard-cta">New Booking</Link>
          <Link to="/calendar" className="btn ghost dashboard-cta secondary">Open Calendar</Link>
        </div>
      </section>
      {error && <p className="dashboard-inline-error">{error}</p>}

      <section className="dashboard-stat-grid">
        {isLoading
          ? Array.from({ length: statConfig.length }).map((_, index) => (
            <article className="dashboard-stat-tile dashboard-stat-tile-skeleton" key={`skeleton-${index}`}>
              <div className="skeleton skeleton-icon" />
              <div className="stat-text">
                <span className="skeleton skeleton-line short" />
                <span className="skeleton skeleton-line long" />
              </div>
            </article>
          ))
          : statConfig.map((s) => (
            <article className="dashboard-stat-tile" key={s.key} style={{ '--accent': s.color }}>
              <div className="stat-icon-shell">
                <W8Icon name={s.iconName} size={28} alt={s.label} />
              </div>
              <div className="stat-text">
                <span>{s.label}</span>
                <strong>{formatStatValue(s, stats?.[s.key])}</strong>
              </div>
            </article>
          ))}
      </section>

      <section className="dashboard-columns">
        <div className="dashboard-panel dashboard-surface">
          <div className="panel-head">
            <h3>Recent Bookings</h3>
            <Link to="/my-bookings" className="link-accent">View all</Link>
          </div>
          <div className="list-stack">
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <div className="dashboard-row-item dashboard-row-item-skeleton" key={`booking-skeleton-${index}`}>
                <div className="skeleton skeleton-line medium" />
                <div className="skeleton skeleton-line short" />
              </div>
            ))}
            {!isLoading && bookings.length === 0 && <p className="empty-state">No bookings yet. Your upcoming reservations will appear here.</p>}
            {!isLoading && bookings.map((b) => (
              <div className="dashboard-row-item" key={b._id}>
                <div className="dashboard-row-main">
                  <strong>{b.utilityId?.name || 'Utility'}</strong>
                  <p>{formatBookingDate(b.startTime)}</p>
                </div>
                <span className={`pill ${b.status}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel dashboard-surface">
          <div className="panel-head">
            <h3>Quick Book</h3>
            <Link to="/utilities" className="link-accent">See all</Link>
          </div>
          <div className="list-stack">
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <div className="dashboard-quick-item dashboard-row-item-skeleton" key={`utility-skeleton-${index}`}>
                <div className="skeleton skeleton-line medium" />
                <div className="skeleton skeleton-line short" />
              </div>
            ))}
            {!isLoading && utilities.length === 0 && <p className="empty-state">No utilities available right now.</p>}
            {!isLoading && utilities.map((u) => (
              <Link className="dashboard-quick-item" key={u._id} to={`/calendar?utility=${u._id}`}>
                <div className="dashboard-row-main">
                  <strong>{u.name}</strong>
                  <p>₹{u.pricePerHour}/hr</p>
                </div>
                <span className="btn ghost sm">Book now</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
