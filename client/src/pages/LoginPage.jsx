import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';
import W8Icon from '../components/W8Icon.jsx';
import Logo from '../components/Logo.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'FairSlot | Sign in';
  }, []);

  const getHomeRoute = (user) => {
    if (user.role === 'superadmin') return '/admin/organizations';
    if (user.role === 'org_admin') return '/admin';
    return user.organizationId ? '/dashboard' : '/verification';
  };

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      navigate(getHomeRoute(data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      const data = await login({ email, password });
      navigate(getHomeRoute(data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError('');
    setLoading(true);
    try {
      const data = await googleLogin(credential);
      navigate(getHomeRoute(data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-content">
          <Link to="/" className="auth-brand">
            <Logo size={24} showText textColor="#e8f1ff" surface="dark" />
          </Link>
          <span className="auth-side-badge">Shared utility workspace</span>
          <h1>Sign in and keep utility operations moving.</h1>
          <p>Review bookings, approvals, and usage in one place without switching between tools.</p>
          <div className="auth-side-features">
            <div className="auth-feature"><W8Icon name="calendar-check" size={20} alt="" /> Book slots with conflict checks</div>
            <div className="auth-feature"><W8Icon name="shield-check" size={20} alt="" /> Apply fairness rules consistently</div>
            <div className="auth-feature"><W8Icon name="trend" size={20} alt="" /> Review usage and approvals at a glance</div>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-form-card" onSubmit={onSubmit}>
          <div className="auth-form-header">
            <span className="auth-kicker">Secure access</span>
            <h2>Sign in</h2>
            <p className="muted">Enter your details to continue to your workspace.</p>
          </div>

          {error && <p className="error-banner">{error}</p>}

          <GoogleLoginButton onSuccess={handleGoogle} text="signin_with" />

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <label className="auth-label">
            Email address
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
          </label>

          <label className="auth-label">
            Password
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} required />
          </label>

          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register" className="link-accent">Create one</Link>
          </p>

          <div className="test-accounts">
            <p className="test-accounts-label">Quick test login</p>
            <div className="test-btns">
              <button type="button" className="test-btn member" onClick={() => testLogin('member@test.com', 'member123')}>
                <W8Icon name="people" size={16} alt="" /> Member
              </button>
              <button type="button" className="test-btn admin" onClick={() => testLogin('admin@test.com', 'admin123')}>
                <W8Icon name="building" size={16} alt="" /> Org Admin
              </button>
              <button type="button" className="test-btn superadmin" onClick={() => testLogin('superadmin@utility.com', 'super123')}>
                <W8Icon name="workspace" size={16} alt="" /> Superadmin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
