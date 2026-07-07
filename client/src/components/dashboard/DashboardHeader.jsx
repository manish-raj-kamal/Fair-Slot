import React from 'react';
import { Link } from 'react-router-dom';

const greetingByHour = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function DashboardHeader({ userName }) {
  const firstName = userName?.split(' ')[0] || 'Member';

  return (
    <div className="dash-header-new">
      <div className="dash-header-content">
        <p className="dash-eyebrow-new">MEMBER WORKSPACE</p>
        <h1>{greetingByHour()}, {firstName}</h1>
        <p className="dash-subtitle-new">Here's what's happening with your bookings today.</p>
      </div>
      <div className="dash-header-actions">
        <Link to="/utilities" className="btn primary dash-btn">New booking</Link>
        <Link to="/calendar" className="btn ghost dash-btn secondary">Open calendar</Link>
      </div>
    </div>
  );
}
