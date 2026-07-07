import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';

export default function CtaBanner() {
  return (
    <div className="cta-banner">
      <h2>Ready to run utility bookings with clarity?</h2>
      <p>Set up your workspace and start accepting bookings in minutes.</p>
      <Link to="/register" className="btn btn-primary">
        Get started for free <IconArrowRight size={18} stroke={2} />
      </Link>
    </div>
  );
}
