import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';

export default function Navbar() {
  return (
    <nav className="landing-nav">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <Logo size={28} />
          <span className="logo-text">FairSlot</span>
        </Link>
        <div className="nav-links">
          <span>How it works</span>
          <span>Benefits</span>
          <span>Security</span>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start free</Link>
        </div>
      </div>
    </nav>
  );
}
