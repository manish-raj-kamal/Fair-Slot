import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';

export default function Navbar() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="landing-nav">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <Logo size={28} />
          <span className="logo-text">FairSlot</span>
        </Link>
        <div className="nav-links">
          <span onClick={() => scrollTo('how-it-works')}>How it works</span>
          <span onClick={() => scrollTo('benefits')}>Benefits</span>
          <span onClick={() => scrollTo('security')}>Security</span>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Start free</Link>
        </div>
      </div>
    </nav>
  );
}
