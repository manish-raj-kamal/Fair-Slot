import React from 'react';
import W8Icon from '../W8Icon.jsx';

const statConfig = [
  { key: 'totalBookings', label: 'TOTAL BOOKINGS', iconName: 'bookings', bgColor: 'rgba(91, 63, 160, 0.1)' },
  { key: 'activeBookings', label: 'ACTIVE NOW', iconName: 'utilities', bgColor: 'rgba(63, 134, 99, 0.1)' },
  { key: 'totalHours', label: 'HOURS USED', iconName: 'clock', bgColor: 'rgba(217, 154, 43, 0.1)' },
  { key: 'totalSpent', label: 'AMOUNT SPENT', iconName: 'coins', bgColor: 'rgba(91, 63, 160, 0.05)', prefix: '₹' }
];

const formatStatValue = (config, value) => {
  if (value === null || value === undefined) return '--';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '--';
  return `${config.prefix || ''}${numeric.toLocaleString('en-IN')}`;
};

export default function DashboardStatsGrid({ stats, isLoading }) {
  return (
    <section className="dash-stats-grid-new">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <article className="dash-stat-tile-new skeleton" key={`skeleton-${index}`}>
              <div className="stat-icon-new skeleton"></div>
              <div className="stat-text-new">
                <span className="skeleton skeleton-line short" />
                <span className="skeleton skeleton-line long" />
              </div>
            </article>
          ))
        : statConfig.map((s) => (
            <article className="dash-stat-tile-new" key={s.key}>
              <div className="stat-icon-new" style={{ backgroundColor: s.bgColor }}>
                <W8Icon name={s.iconName} size={24} alt={s.label} />
              </div>
              <div className="stat-text-new">
                <span>{s.label}</span>
                <strong>{formatStatValue(s, stats?.[s.key])}</strong>
              </div>
            </article>
          ))}
    </section>
  );
}
