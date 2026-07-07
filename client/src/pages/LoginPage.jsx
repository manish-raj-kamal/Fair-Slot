import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { IconShieldCheck, IconArrowRight, IconArrowLeft, IconUsers, IconBuilding, IconLayoutGrid } from '@tabler/icons-react';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';
import Logo from '../components/Logo.jsx';

import '../components/landing/AuthPages.css';

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
    <div className="fs-auth">
      <div className="auth-wash-1"></div>
      <div className="auth-wash-2"></div>

      <div className="fs-auth-topbar">
        <Link to="/" className="logo">
          <Logo size={28} />
          <span>FairSlot</span>
        </Link>
        <Link to="/" className="back-link">
          <IconArrowLeft size={16} stroke={2} /> Back to home
        </Link>
      </div>

      <div className="fs-auth-main">
        <div className="fs-auth-card">
          <div className="fs-auth-header">
            <div className="fs-auth-eyebrow">
              <IconShieldCheck size={14} stroke={2} /> Secure access
            </div>
            <h2>Sign in</h2>
            <p>Enter your details to continue to your workspace.</p>
          </div>

          {error && <div className="fs-auth-error">{error}</div>}

          <GoogleLoginButton onSuccess={handleGoogle} text="signin_with" />

          <div className="fs-auth-divider"><span>or continue with email</span></div>

          <form className="fs-auth-form" onSubmit={onSubmit}>
            <div className="fs-auth-field">
              <label>Email address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>

            <div className="fs-auth-field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} required />
            </div>

            <button className="fs-auth-submit" type="submit" disabled={loading}>
              {loading ? <span className="fs-auth-spinner" /> : <>Sign In <IconArrowRight size={16} stroke={2} /></>}
            </button>
          </form>

          <p className="fs-auth-footer-text">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

          <div className="fs-test-accounts">
            <p className="fs-test-label">Quick test login</p>
            <div className="fs-test-btns">
              <button type="button" className="fs-test-btn member" onClick={() => testLogin('member@test.com', 'member123')}>
                <IconUsers size={14} stroke={2} /> Member
              </button>
              <button type="button" className="fs-test-btn admin" onClick={() => testLogin('admin@test.com', 'admin123')}>
                <IconBuilding size={14} stroke={2} /> Org Admin
              </button>
              <button type="button" className="fs-test-btn superadmin" onClick={() => testLogin('superadmin@utility.com', 'super123')}>
                <IconLayoutGrid size={14} stroke={2} /> Superadmin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
