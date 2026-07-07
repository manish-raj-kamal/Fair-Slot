export default function AvailabilityGrid({ slots }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const cellClass = (status) => {
    switch (status) {
      case 'open':         return 'cell cell-open';
      case 'open-strong':  return 'cell cell-open strong';
      case 'booked':       return 'cell cell-booked';
      case 'booked-strong':return 'cell cell-booked strong';
      case 'blocked':      return 'cell cell-blocked';
      default:             return 'cell cell-blocked';
    }
  };

  return (
    <div className="grid-card">
      <div className="gc-head">
        <span className="title">Court B — this week</span>
        <span className="live-pill">
          <span className="live-dot"></span>Live
        </span>
      </div>

      <div className="day-labels">
        <span></span>
        {days.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {slots.map((row, i) => (
        <div className="slot-row" key={i}>
          <span className="row-label">{row.label}</span>
          {row.cells.map((status, j) => (
            <div className={cellClass(status)} key={j}></div>
          ))}
        </div>
      ))}

      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--sage)' }}></span>Open
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--gold)' }}></span>Booked
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: 'rgba(34,26,44,0.15)' }}></span>Blocked
        </div>
      </div>

      <div className="gc-footer">
        <span className="foot-label">Next fairness reset</span>
        <span className="foot-value">Sunday, midnight</span>
      </div>
    </div>
  );
}
