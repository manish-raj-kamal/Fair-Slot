import React from 'react';
import { Link } from 'react-router-dom';

const formatBookingDate = (value) =>
  new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

export default function RecentBookingsPanel({ bookings, isLoading }) {
  return (
    <div className="dash-panel-new">
      <div className="dash-panel-head">
        <h3>Recent bookings</h3>
        <Link to="/my-bookings" className="panel-link">View all</Link>
      </div>
      <div className="dash-panel-list">
        {isLoading && Array.from({ length: 3 }).map((_, index) => (
          <div className="panel-row-new skeleton-row" key={`booking-skeleton-${index}`}>
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-line short" />
          </div>
        ))}
        {!isLoading && bookings.length === 0 && <p className="empty-state">No bookings yet. Your upcoming reservations will appear here.</p>}
        {!isLoading && bookings.map((b) => (
          <div className="panel-row-new" key={b._id}>
            <div className="panel-row-info">
              <strong>{b.utilityId?.name || 'Utility'}</strong>
              <p>{formatBookingDate(b.startTime)}</p>
            </div>
            <span className={`pill ${b.status}`}>{b.status}</span>
          </div>
        ))}
      </div>
      {!isLoading && bookings.length > 0 && (
        <div className="dash-panel-footer">
          <Link to="/my-bookings" className="btn outline full-width">Show more bookings</Link>
        </div>
      )}
    </div>
  );
}
