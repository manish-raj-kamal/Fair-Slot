import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { sendRegistrationOtp } from '../services/api.js';
import {
  IconArrowLeft, IconArrowRight, IconShieldCheck,
  IconUsers, IconBuilding, IconMailOpened, IconCircleCheck,
} from '@tabler/icons-react';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';
import Logo from '../components/Logo.jsx';

import '../components/landing/AuthPages.css';

const SIX_DIGITS = /^\d{6}$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, registerOrg, googleLogin } = useAuth();

  useEffect(() => {
    document.title = 'FairSlot | Register';
  }, []);

  const getHomeRoute = (user) => {
    if (user.role === 'superadmin') return '/admin/organizations';
    if (user.role === 'org_admin') return '/admin';
    return user.organizationId ? '/dashboard' : '/verification';
  };

  const [mode, setMode] = useState('member');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', flatNumber: '', password: '',
    phone: '', orgName: '', orgType: 'society', orgAddress: '', contactEmail: '', joinKey: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [shake, setShake] = useState(false);

  const isOrg = mode === 'org_admin';

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === 2) otpRefs.current[0]?.focus();
  }, [step]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isOrg && form.joinKey && !SIX_DIGITS.test(form.joinKey.trim())) {
        setError('Organization Join Key must be exactly 6 digits');
        triggerShake();
        return;
      }
      await sendRegistrationOtp(form.email);
      setCooldown(45);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      triggerShake();
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(''); setLoading(true);
    try {
      await sendRegistrationOtp(form.email);
      setCooldown(45);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally { setLoading(false); }
  };

  const onOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const onOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const onOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const emailOtp = otp.join('');
    if (emailOtp.length < 6) { setError('Enter the full 6-digit code'); triggerShake(); return; }

    setError(''); setLoading(true);
    try {
      let data;
      if (isOrg) {
        data = await registerOrg({ ...form, emailOtp });
      } else {
        data = await register({ name: form.name, email: form.email, password: form.password, flatNumber: form.flatNumber, emailOtp });
      }
      setStep(3);
      setTimeout(() => navigate(getHomeRoute(data.user)), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      triggerShake();
    } finally { setLoading(false); }
  };

  const handleGoogle = async (credential) => {
    setError(''); setLoading(true);
    try {
      const data = await googleLogin(credential);
      navigate(getHomeRoute(data.user));
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-up failed');
    } finally { setLoading(false); }
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
        <div className={`fs-auth-card wide ${shake ? 'fs-shake' : ''}`}>
          {/* Step bar */}
          <div className="fs-steps-bar">
            <div className={`fs-step-dot ${step >= 1 ? 'active' : ''}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={`fs-step-line ${step >= 2 ? 'filled' : ''}`} />
            <div className={`fs-step-dot ${step >= 2 ? 'active' : ''}`}>
              {step > 2 ? '✓' : '2'}
            </div>
          </div>

          {/* ─── Step 1: Form ─── */}
          <div className={`fs-step-panel ${step === 1 ? 'visible' : step > 1 ? 'hidden-left' : 'hidden-right'}`}>
            <div className="fs-auth-header">
              <div className="fs-auth-eyebrow">
                <IconShieldCheck size={14} stroke={2} /> Set up access
              </div>
              <h2>Create account</h2>
              <p>Choose the account type that fits your role.</p>
            </div>

            {/* Role toggle */}
            <div className="fs-role-toggle">
              <button type="button" className={`fs-role-btn ${!isOrg ? 'active' : ''}`} onClick={() => setMode('member')}>
                <IconUsers size={15} stroke={2} /> Member
              </button>
              <button type="button" className={`fs-role-btn ${isOrg ? 'active' : ''}`} onClick={() => setMode('org_admin')}>
                <IconBuilding size={15} stroke={2} /> Organization
              </button>
              <div className={`fs-role-slider ${isOrg ? 'right' : 'left'}`} />
            </div>

            {error && step === 1 && <div className="fs-auth-error">{error}</div>}

            {!isOrg && <GoogleLoginButton onSuccess={handleGoogle} text="signup_with" />}
            {!isOrg && <div className="fs-auth-divider"><span>or register with email</span></div>}

            <form className="fs-auth-form" onSubmit={handleSendOtp}>
              <div className="fs-auth-row">
                <div className="fs-auth-field">
                  <label>Full name</label>
                  <input name="name" placeholder="Rahul Sharma" value={form.name} onChange={onChange} required />
                </div>
                {!isOrg ? (
                  <div className="fs-auth-field">
                    <label>Flat / Unit</label>
                    <input name="flatNumber" placeholder="A-401" value={form.flatNumber} onChange={onChange} required />
                  </div>
                ) : (
                  <div className="fs-auth-field">
                    <label>Email address</label>
                    <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
                  </div>
                )}
              </div>

              {!isOrg && (
                <div className="fs-auth-field">
                  <label>Email address</label>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
                </div>
              )}

              <div className="fs-auth-field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={onChange} minLength={6} required />
              </div>

              {/* Org fields */}
              <div className={`fs-org-fields-wrap ${isOrg ? 'open' : ''}`}>
                <div className="fs-org-fields-inner">
                  <div className="fs-org-divider"><span>Organization details</span></div>

                  <div className="fs-auth-row">
                    <div className="fs-auth-field">
                      <label>Organization name</label>
                      <input name="orgName" placeholder="Sunshine Society" value={form.orgName} onChange={onChange} required={isOrg} />
                    </div>
                    <div className="fs-auth-field">
                      <label>Type</label>
                      <select name="orgType" value={form.orgType} onChange={onChange}>
                        <option value="society">Society</option>
                        <option value="college">College</option>
                        <option value="company">Company</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="fs-auth-row">
                    <div className="fs-auth-field">
                      <label>Phone (optional)</label>
                      <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={onChange} />
                    </div>
                    <div className="fs-auth-field">
                      <label>Join Key (optional, 6 digits)</label>
                      <input
                        name="joinKey"
                        placeholder="654321"
                        value={form.joinKey}
                        onChange={(e) => setForm((p) => ({ ...p, joinKey: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div className="fs-auth-field">
                    <label>Address (optional)</label>
                    <input name="orgAddress" placeholder="123 Main St" value={form.orgAddress} onChange={onChange} />
                  </div>
                </div>
              </div>

              <button className="fs-auth-submit" type="submit" disabled={loading}>
                {loading ? (
                  <span className="fs-auth-spinner" />
                ) : (
                  <>Continue — Verify Email <IconArrowRight size={16} stroke={2} /></>
                )}
              </button>
            </form>

            <p className="fs-auth-footer-text">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>

          {/* ─── Step 2: OTP ─── */}
          <div className={`fs-step-panel ${step === 2 ? 'visible' : step > 2 ? 'hidden-left' : 'hidden-right'}`}>
            <div className="fs-otp-icon">
              <IconMailOpened size={34} stroke={1.5} />
            </div>

            <div className="fs-auth-header" style={{ textAlign: 'center' }}>
              <h2>Enter verification code</h2>
              <p>Sent to <strong>{form.email}</strong></p>
            </div>

            {error && step === 2 && <div className="fs-auth-error">{error}</div>}

            <form className="fs-auth-form" onSubmit={handleVerify} style={{ textAlign: 'center' }}>
              <div className="fs-otp-row">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className={`fs-otp-box ${d ? 'filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(i, e)}
                    onPaste={i === 0 ? onOtpPaste : undefined}
                  />
                ))}
              </div>

              <button className="fs-auth-submit" type="submit" disabled={loading || otp.join('').length < 6}>
                {loading ? <span className="fs-auth-spinner" /> : 'Verify & Create Account'}
              </button>
            </form>

            <div className="fs-otp-actions">
              <button type="button" onClick={() => { setStep(1); setError(''); }}>
                ← Back
              </button>
              <button type="button" onClick={handleResend} disabled={cooldown > 0}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </div>

          {/* ─── Step 3: Success ─── */}
          <div className={`fs-step-panel ${step === 3 ? 'visible' : 'hidden-right'}`}>
            <div className="fs-success-panel">
              <div className="fs-success-icon">
                <IconCircleCheck size={42} stroke={1.5} />
              </div>
              <h2>Account created!</h2>
              <p style={{ color: 'var(--ink-secondary)' }}>Redirecting you to your dashboard…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
