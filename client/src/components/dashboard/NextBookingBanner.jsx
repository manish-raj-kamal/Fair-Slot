import React from 'react';
import { Link } from 'react-router-dom';

const formatBookingDate = (value) =>
  new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

export default function NextBookingBanner({ booking, isLoading }) {
  if (isLoading) {
    return (
      <div className="dash-banner-new skeleton-banner">
        <div className="banner-icon skeleton"></div>
        <div className="banner-info">
          <div className="skeleton skeleton-line short"></div>
          <div className="skeleton skeleton-line long"></div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="dash-banner-new">
      <div className="banner-icon">
        <span className="icon-placeholder"></span>
      </div>
      <div className="banner-info">
        <p className="banner-eyebrow">NEXT BOOKING</p>
        <p className="banner-details">
          <strong>{booking.utilityId?.name || 'Utility'}</strong> — {formatBookingDate(booking.startTime)}
        </p>
      </div>
      <Link to="/my-bookings" className="banner-link">View details</Link>
    </div>
  );
}
