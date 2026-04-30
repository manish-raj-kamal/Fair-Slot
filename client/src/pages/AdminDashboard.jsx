import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import W8Icon from '../components/W8Icon.jsx';
import { getDashboardStats } from '../services/api.js';

const adminStatConfig = [
  { key: 'totalBookings', label: 'Total Bookings', iconName: 'bookings', color: '#2f6fed' },
  { key: 'activeBookings', label: 'Active Sessions', iconName: 'utilities', color: '#0ea95f' },
  { key: 'waitlistedBookings', label: 'Waitlist Queue', iconName: 'calendar', color: '#d97706' },
  { key: 'totalUsers', label: 'Members', iconName: 'users', color: '#0891b2' },
  { key: 'totalUtilities', label: 'Live Utilities', iconName: 'flat', color: '#2563eb' },
  { key: 'totalRevenue', label: 'Revenue', iconName: 'coins', color: '#0284c7', prefix: '₹' }
];

const formatMetric = (config, value) => {
  if (value === null || value === undefined) return '--';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '--';
  return `${config.prefix || ''}${numeric.toLocaleString('en-IN')}`;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Admin Dashboard | FairSlot';
  }, []);

  useEffect(() => {
    let active = true;

    const loadDashboardData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getDashboardStats();
        if (!active) return;
        setStats(response.data);
      } catch {
        if (!active) return;
        setError('Unable to load admin analytics right now. Please refresh the page.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const totalBookings = stats?.totalBookings || 0;
  const activeBookings = stats?.activeBookings || 0;
  const waitlistedBookings = stats?.waitlistedBookings || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  const utilization = useMemo(() => {
    if (!totalBookings) return 0;
    return Math.round((activeBookings / totalBookings) * 100);
  }, [activeBookings, totalBookings]);

  const waitlistPressure = useMemo(() => {
    if (!totalBookings) return 0;
    return Math.round((waitlistedBookings / totalBookings) * 100);
  }, [totalBookings, waitlistedBookings]);

  const revenuePerBooking = useMemo(() => {
    if (!totalBookings) return 0;
    return Math.round(totalRevenue / totalBookings);
  }, [totalBookings, totalRevenue]);

  const insights = [
    {
      title: 'Utilization Rate',
      value: `${utilization}%`,
      note: 'Share of active bookings compared to total booking volume.',
      meter: utilization,
      color: '#0ea95f'
    },
    {
      title: 'Waitlist Pressure',
      value: `${waitlistPressure}%`,
      note: 'Current load in the queue that may need capacity balancing.',
      meter: waitlistPressure,
      color: '#f59f0b'
    },
    {
      title: 'Revenue Per Booking',
      value: `₹${revenuePerBooking.toLocaleString('en-IN')}`,
      note: 'Average paid amount generated from each booking request.',
      meter: totalRevenue ? Math.min(100, Math.round((revenuePerBooking / 1000) * 100)) : 0,
      color: '#ff6d5a'
    }
  ];

  return (
    <div className="dashboard-luxe admin-dashboard-luxe">
      <section className="dashboard-hero dashboard-surface admin-hero">
        <div className="hero-copy">
          <p className="dashboard-eyebrow">Operations dashboard</p>
          <h1>Admin Dashboard</h1>
          <p className="dashboard-subtitle">Monitor demand, capacity, and revenue for your organization in one operational view.</p>
          <div className="hero-meta-row">
            <div className="hero-meta-chip">
              <span>Utilization</span>
              <strong>{isLoading ? '--' : `${utilization}%`}</strong>
            </div>
            <div className="hero-meta-chip">
              <span>Waitlist Load</span>
              <strong>{isLoading ? '--' : `${waitlistPressure}%`}</strong>
            </div>
            <div className="hero-meta-chip">
              <span>Avg Revenue</span>
              <strong>{isLoading ? '--' : `₹${revenuePerBooking.toLocaleString('en-IN')}`}</strong>
            </div>
          </div>
        </div>
        <div className="hero-actions admin-hero-actions">
          <div className="admin-live-pill">
            <span className="live-dot" />
            {isLoading ? 'Loading metrics' : 'Live metrics'}
          </div>
          <Link to="/admin/analytics" className="btn primary dashboard-cta">Open Analytics</Link>
          <Link to="/notifications" className="btn ghost dashboard-cta secondary">Check Alerts</Link>
        </div>
      </section>
      {error && <p className="dashboard-inline-error">{error}</p>}

      <section className="dashboard-stat-grid admin-stat-grid">
        {isLoading
          ? Array.from({ length: adminStatConfig.length }).map((_, index) => (
            <article className="dashboard-stat-tile dashboard-stat-tile-skeleton" key={`admin-stat-skeleton-${index}`}>
              <div className="skeleton skeleton-icon" />
              <div className="stat-text">
                <span className="skeleton skeleton-line short" />
                <span className="skeleton skeleton-line long" />
              </div>
            </article>
          ))
          : adminStatConfig.map((item) => (
            <article className="dashboard-stat-tile" key={item.key} style={{ '--accent': item.color }}>
              <div className="stat-icon-shell">
                <W8Icon name={item.iconName} size={28} alt={item.label} />
              </div>
              <div className="stat-text">
                <span>{item.label}</span>
                <strong>{formatMetric(item, stats?.[item.key])}</strong>
              </div>
            </article>
          ))}
      </section>

      <section className="admin-insight-grid">
        {isLoading
          ? Array.from({ length: insights.length }).map((_, index) => (
            <article className="admin-insight-card dashboard-surface" key={`insight-skeleton-${index}`}>
              <div className="skeleton skeleton-line medium" />
              <div className="skeleton skeleton-line long" />
              <div className="skeleton skeleton-line long" />
            </article>
          ))
          : insights.map((item) => (
            <article className="admin-insight-card dashboard-surface" key={item.title}>
              <div className="admin-insight-head">
                <h3>{item.title}</h3>
                <strong>{item.value}</strong>
              </div>
              <p>{item.note}</p>
              <div className="admin-meter-track">
                <span style={{ width: `${Math.max(0, Math.min(100, item.meter))}%`, background: item.color }} />
              </div>
            </article>
          ))}
      </section>
    </div>
  );
}
