import React from 'react';
import { Link } from 'react-router-dom';

export default function QuickBookPanel({ utilities, isLoading }) {
  return (
    <div className="dash-panel-new">
      <div className="dash-panel-head">
        <h3>Quick book</h3>
        <Link to="/utilities" className="panel-link">See all</Link>
      </div>
      <div className="dash-panel-list">
        {isLoading && Array.from({ length: 3 }).map((_, index) => (
          <div className="panel-row-new skeleton-row" key={`utility-skeleton-${index}`}>
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-line short" />
          </div>
        ))}
        {!isLoading && utilities.length === 0 && <p className="empty-state">No utilities available right now.</p>}
        {!isLoading && utilities.map((u) => (
          <div className="panel-row-new hoverable" key={u._id}>
            <div className="panel-row-info">
              <strong>{u.name}</strong>
              <p>₹{u.pricePerHour}/hr</p>
            </div>
            <Link to={`/calendar?utility=${u._id}`} className="btn ghost sm">Book now</Link>
          </div>
        ))}
      </div>
      {!isLoading && utilities.length > 0 && (
        <div className="dash-panel-footer">
          <Link to="/utilities" className="btn outline full-width">Show more</Link>
        </div>
      )}
    </div>
  );
}
