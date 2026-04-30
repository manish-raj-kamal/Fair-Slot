import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { sendRegistrationOtp } from '../services/api.js';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';
import W8Icon from '../components/W8Icon.jsx';
import Logo from '../components/Logo.jsx';

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
  const [step, setStep] = useState(1);           // 1=form  2=otp  3=success
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

  // cooldown tick
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // auto-focus first OTP box when step 2
  useEffect(() => {
    if (step === 2) otpRefs.current[0]?.focus();
  }, [step]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  /* step 1 → send OTP */
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

  /* resend */
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

  /* otp input helpers */
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

  /* step 2 → verify & register */
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
      setStep(3); // success
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

  /* ── left-panel dynamic content ── */
  const sideContent = {
    1: {
      title: isOrg ? 'Register your organization' : 'Join your community',
      sub: isOrg
        ? 'Set up your society, college, or company and start managing shared utilities in minutes.'
        : 'Create an account to start booking shared utilities — parking, halls, EV charging and more.',
      feats: isOrg
        ? [{ icon: 'organizations', text: 'Manage multiple utilities' }, { icon: 'analytics', text: 'Analytics and audit logs' }, { icon: 'users', text: 'Invite members instantly' }]
        : [{ icon: 'notifications', text: 'Instant notifications' }, { icon: 'calendar', text: 'Community hall booking' }, { icon: 'utilities', text: 'EV charger scheduling' }],
    },
    2: {
      title: 'Verify your email',
      sub: `We sent a 6-digit code to ${form.email}. Enter it below to finish creating your account.`,
      feats: [{ icon: 'email', text: 'Check your inbox and spam' }, { icon: 'clock', text: 'Code expires in 10 minutes' }, { icon: 'lock', text: 'Secure one-time code' }],
    },
    3: {
      title: 'You\'re all set!',
      sub: 'Your account has been created successfully. Redirecting you now…',
      feats: [{ icon: 'check', text: 'Welcome aboard' }, { icon: 'home', text: 'Dashboard loading' }],
    },
  }[step];

  return (
    <div className="auth-page reg-page">
      <div className="auth-side">
        <div className="auth-side-content reg-side-content" key={step}>
          <Link to="/" className="auth-brand">
            <Logo size={24} showText textColor="#e8f1ff" surface="dark" />
          </Link>
          <span className="auth-side-badge">Create account in minutes</span>
          <h1 className="reg-side-title">{sideContent.title}</h1>
          <p className="reg-side-sub">{sideContent.sub}</p>
          <div className="auth-side-features reg-side-feats">
            {sideContent.feats.map((item, i) => (
              <div className="auth-feature" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                <W8Icon name={item.icon} size={20} alt="" /> {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-side reg-form-side">
        <div className={`auth-form-card reg-card ${shake ? 'reg-shake' : ''}`}>
          <div className="reg-steps-bar">
            <div className={`reg-step-dot ${step >= 1 ? 'active' : ''}`}>
              {step > 1 ? <span className="reg-dot-check">✓</span> : '1'}
            </div>
            <div className={`reg-step-line ${step >= 2 ? 'filled' : ''}`} />
            <div className={`reg-step-dot ${step >= 2 ? 'active' : ''}`}>
              {step > 2 ? <span className="reg-dot-check">✓</span> : '2'}
            </div>
          </div>

          <div className={`reg-step-panel ${step === 1 ? 'visible' : step > 1 ? 'hidden-left' : 'hidden-right'}`}>
            <form onSubmit={handleSendOtp} className="reg-form-inner">
              <div className="auth-form-header">
                <span className="auth-kicker">Set up access</span>
                <h2>Create account</h2>
                <p className="muted">Choose the account type that fits your role.</p>
              </div>

              {/* Role toggle */}
              <div className="role-toggle">
                <button type="button" className={`role-toggle-btn ${!isOrg ? 'active' : ''}`} onClick={() => setMode('member')}>
                  <W8Icon name="people" size={16} alt="" className="role-toggle-icon" /> Member
                </button>
                <button type="button" className={`role-toggle-btn ${isOrg ? 'active' : ''}`} onClick={() => setMode('org_admin')}>
                  <W8Icon name="building" size={16} alt="" className="role-toggle-icon" /> Organization
                </button>
                <div className={`role-toggle-slider ${isOrg ? 'right' : 'left'}`} />
              </div>

              {error && step === 1 && <p className="error-banner reg-error">{error}</p>}

              {!isOrg && <GoogleLoginButton onSuccess={handleGoogle} text="signup_with" />}
              {!isOrg && <div className="auth-divider"><span>or register with email</span></div>}

              <div className="auth-row">
                <label className="auth-label">
                  Full name
                  <input name="name" placeholder="Rahul Sharma" value={form.name} onChange={onChange} required />
                </label>
                {!isOrg ? (
                  <label className="auth-label">
                    Flat / Unit
                    <input name="flatNumber" placeholder="A-401" value={form.flatNumber} onChange={onChange} required />
                  </label>
                ) : (
                  <label className="auth-label">
                    Email address
                    <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
                  </label>
                )}
              </div>

              {!isOrg && (
                <label className="auth-label">
                  Email address
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
                </label>
              )}

              <label className="auth-label">
                Password
                <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={onChange} minLength={6} required />
              </label>

              {/* Org fields */}
              <div className={`org-fields-wrap ${isOrg ? 'open' : ''}`}>
                <div className="org-fields-inner">
                  <div className="org-fields-divider"><span>Organization details</span></div>

                  <div className="auth-row">
                    <label className="auth-label">
                      Organization name
                      <input name="orgName" placeholder="Sunshine Society" value={form.orgName} onChange={onChange} required={isOrg} />
                    </label>
                    <label className="auth-label">
                      Type
                      <select name="orgType" value={form.orgType} onChange={onChange}>
                        <option value="society">Society</option>
                        <option value="college">College</option>
                        <option value="company">Company</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                  </div>

                  <div className="auth-row">
                    <label className="auth-label">
                      Phone (optional)
                      <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={onChange} />
                    </label>
                    <label className="auth-label">
                      Organization Join Key (optional, 6 digits)
                      <input
                        name="joinKey"
                        placeholder="654321"
                        value={form.joinKey}
                        onChange={(e) => setForm((p) => ({ ...p, joinKey: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        inputMode="numeric"
                      />
                    </label>
                  </div>

                  <div className="auth-row">
                    <label className="auth-label">
                      Address (optional)
                      <input name="orgAddress" placeholder="123 Main St" value={form.orgAddress} onChange={onChange} />
                    </label>
                  </div>
                </div>
              </div>

              <button className="btn primary full reg-cta" type="submit" disabled={loading}>
                {loading ? (
                  <span className="reg-spinner" />
                ) : (
                  <>Continue — Verify Email <span className="reg-arrow">→</span></>
                )}
              </button>

              <p className="auth-footer-text">
                Already have an account? <Link to="/login" className="link-accent">Sign in</Link>
              </p>
            </form>
          </div>

          <div className={`reg-step-panel ${step === 2 ? 'visible' : step > 2 ? 'hidden-left' : 'hidden-right'}`}>
            <form onSubmit={handleVerify} className="reg-form-inner reg-otp-form">
              <div className="reg-otp-icon">
                <W8Icon name="mail-open" size={34} alt="" />
              </div>

              <div className="auth-form-header" style={{ textAlign: 'center' }}>
                <h2>Enter verification code</h2>
                <p className="muted">Sent to <strong>{form.email}</strong></p>
              </div>

              {error && step === 2 && <p className="error-banner reg-error">{error}</p>}

              <div className="otp-input-row">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className={`otp-box ${d ? 'filled' : ''}`}
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

              <button className="btn primary full reg-cta" type="submit" disabled={loading || otp.join('').length < 6}>
                {loading ? <span className="reg-spinner" /> : 'Verify & Create Account'}
              </button>

              <div className="otp-actions">
                <button type="button" className="link-accent" onClick={() => { setStep(1); setError(''); }}>
                  ← Back
                </button>
                <button type="button" className={`link-accent ${cooldown > 0 ? 'disabled' : ''}`} onClick={handleResend} disabled={cooldown > 0}>
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          </div>

          <div className={`reg-step-panel ${step === 3 ? 'visible' : 'hidden-right'}`}>
            <div className="reg-form-inner reg-success-panel">
              <div className="reg-success-icon">
                <W8Icon name="check-circle" size={42} alt="" />
              </div>
              <h2>Account created!</h2>
              <p className="muted">Redirecting you to your dashboard…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
