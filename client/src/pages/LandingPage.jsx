import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import Logo from '../components/Logo.jsx';

const howItWorks = [
  {
    step: '1',
    title: 'Choose a utility',
    desc: 'Open the utility board, check pricing and rules, and select an available slot.'
  },
  {
    step: '2',
    title: 'Submit your booking',
    desc: 'FairSlot checks overlap, policy limits, and fairness rules before finalizing status.'
  },
  {
    step: '3',
    title: 'Track status in one place',
    desc: 'Approved, waitlisted, and completed bookings stay visible on your dashboard.'
  }
];

export default function LandingPage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'FairSlot | Shared Utility Booking';
  }, []);

  const dashboardPath = !user
    ? '/login'
    : user.role === 'superadmin'
      ? '/admin/organizations'
      : user.role === 'org_admin'
        ? '/admin'
        : user.organizationId
          ? '/dashboard'
          : '/verification';

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="prime-landing">
      <nav className={`pl-nav ${mobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="pl-brand">
          <div className="pl-brand-main">
            <Logo size={30} />
            <div className="pl-brand-copy">
              <strong>FairSlot</strong>
              <span>Shared utility booking</span>
            </div>
          </div>
          <button
            type="button"
            className={`pl-nav-toggle ${mobileMenuOpen ? 'open' : ''}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span className="stair-line one" />
            <span className="stair-line two" />
            <span className="stair-line three" />
          </button>
        </div>

        <div id="landing-navigation" className="pl-nav-menu">
          <div className="pl-nav-center">
            <a href="#how-it-works" className="pl-nav-link" onClick={closeMobileMenu}>How it works</a>
            <a href="#benefits" className="pl-nav-link" onClick={closeMobileMenu}>Benefits</a>
            <a href="#security" className="pl-nav-link" onClick={closeMobileMenu}>Security</a>
          </div>

          <div className="pl-nav-actions">
            {user ? (
              <Link to={dashboardPath} className="btn primary" onClick={closeMobileMenu}>Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="pl-login-link" onClick={closeMobileMenu}>Log in</Link>
                <Link to="/register" className="btn primary" onClick={closeMobileMenu}>Start Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <header className="pl-hero">
        <div className="pl-hero-left">
          <span className="pl-kicker">Production-grade scheduling for communities</span>
          <h1>Book shared utilities in three clear steps.</h1>
          <p>
            Residents book faster, admins resolve conflicts earlier, and every action stays traceable.
          </p>

          <div className="pl-hero-actions">
            {user ? (
              <Link to={dashboardPath} className="btn primary lg">Open Workspace</Link>
            ) : (
              <>
                <Link to="/register" className="btn primary lg">Create Account</Link>
                <Link to="/login" className="btn ghost lg">Sign In</Link>
              </>
            )}
          </div>
        </div>

        <div className="pl-hero-right">
          <article className="pl-live-card">
            <div className="pl-live-head">
              <strong>How bookings move</strong>
              <span>Simple flow</span>
            </div>

            <div className="pl-live-list">
              <div className="pl-live-row">
                <span>1. Request submitted</span>
                <em className="info">Check</em>
              </div>
              <div className="pl-live-row">
                <span>2. Conflict + fairness validation</span>
                <em className="info">Rules</em>
              </div>
              <div className="pl-live-row">
                <span>3. Approved or waitlisted</span>
                <em className="ok">Result</em>
              </div>
            </div>

            <div className="pl-live-metrics">
              <div>
                <span>Status updates</span>
                <strong>Instant</strong>
              </div>
              <div>
                <span>Audit trail</span>
                <strong>Always on</strong>
              </div>
            </div>
          </article>
        </div>
      </header>

      <section className="pl-stats-strip">
        {[
          { value: '< 1 min', label: 'Typical booking time' },
          { value: 'Real-time', label: 'Status visibility' },
          { value: '3 roles', label: 'Member and admin views' }
        ].map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section id="how-it-works" className="pl-section workflow">
        <div className="pl-section-head">
          <p>How it works</p>
          <h2>A direct flow your team can trust</h2>
        </div>
        <div className="pl-workflow-grid">
          {howItWorks.map((item) => (
            <article className="pl-workflow-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="benefits" className="pl-section">
        <div className="pl-section-head">
          <p>Benefits</p>
          <h2>Less manual coordination, better outcomes</h2>
        </div>
        <div className="pl-feature-grid">
          {[
            {
              title: 'For residents',
              desc: 'Find availability quickly and track every booking without back-and-forth messages.'
            },
            {
              title: 'For admins',
              desc: 'Manage utilities, resolve conflicts, and monitor usage from one operations view.'
            },
            {
              title: 'For governance',
              desc: 'Role-based access and action-level audit logs keep decisions transparent.'
            }
          ].map((card) => (
            <article className="pl-feature-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="security" className="pl-trust-band">
        <div>
          <h2>Security and accountability by default</h2>
          <p>FairSlot records who changed what and when, so your organization can audit operations without extra tooling.</p>
        </div>
        <div className="pl-trust-chip-list">
          <span>Role-aware access</span>
          <span>Action-level auditing</span>
          <span>Request traceability</span>
        </div>
      </section>

      <section className="pl-final-cta">
        <h2>Ready to run utility bookings with clarity?</h2>
        <p>Set up your workspace and start accepting bookings in minutes.</p>
        {user ? (
          <Link to={dashboardPath} className="btn primary lg">Go to Dashboard</Link>
        ) : (
          <Link to="/register" className="btn primary lg">Get Started for Free</Link>
        )}
      </section>

      <footer className="pl-footer">
        <span>© {new Date().getFullYear()} FairSlot</span>
        <span>Shared utility operations platform</span>
      </footer>
    </div>
  );
}
