import { Link } from 'react-router-dom';
import { IconShieldCheck, IconArrowRight } from '@tabler/icons-react';
import AvailabilityGrid from './AvailabilityGrid.jsx';

const defaultSlots = [
  {
    label: '6 AM',
    cells: ['open-strong', 'open', 'booked', 'open', 'open-strong', 'booked-strong', 'blocked'],
  },
  {
    label: '8 AM',
    cells: ['booked-strong', 'booked', 'open', 'booked', 'open', 'open-strong', 'blocked'],
  },
  {
    label: '6 PM',
    cells: ['open', 'booked-strong', 'booked-strong', 'open-strong', 'booked', 'open', 'blocked'],
  },
];

export default function Hero() {
  return (
    <div className="hero">
      <div>
        <div className="eyebrow">
          <IconShieldCheck size={16} stroke={2} /> Fairness-first scheduling
        </div>
        <h1>
          Every resident gets<br />
          a <em>fair</em> shot at<br />
          the slot they want.
        </h1>
        <p className="sub">
          FairSlot balances demand across your community — no double-booking,
          no favoritism, no manual referee work.
        </p>
        <div className="hero-ctas">
          <Link to="/register" className="btn btn-primary">
            Create account <IconArrowRight size={18} stroke={2} />
          </Link>
          <Link to="/login" className="btn btn-ghost">Sign in</Link>
        </div>
        <div className="stat-row">
          <div>
            <div className="stat-num">&lt;1 min</div>
            <div className="stat-label">Typical booking time</div>
          </div>
          <div>
            <div className="stat-num">Real-time</div>
            <div className="stat-label">Status visibility</div>
          </div>
          <div>
            <div className="stat-num">3 roles</div>
            <div className="stat-label">Member and admin views</div>
          </div>
        </div>
      </div>

      <AvailabilityGrid slots={defaultSlots} />
    </div>
  );
}
