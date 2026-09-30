import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const features = [
  'Lead & opportunity management',
  'Sales pipeline & proposals',
  'Meetings, tasks & follow-ups',
  'Team performance & reporting',
];

function CreateNewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const strength = checks.filter((c) => c.met).length;
  const strengthLabel = strength <= 1 ? 'Weak' : strength <= 3 ? 'Fair' : 'Good';
  const levels = {
    Weak: { bar: '#DC2626', text: '#B91C1C' },
    Fair: { bar: '#F59E0B', text: '#B45309' },
    Good: { bar: '#16A34A', text: '#15803D' }
  };
  const level = levels[strengthLabel];

  const LockIcon = () => (
    <span className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </span>
  );

  const EyeIcon = ({ open, onClick }) => (
    <span
      className="position-absolute"
      style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6B7280', display: 'flex' }}
      onClick={onClick}
    >
      {open ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </span>
  );

  const RuleItem = ({ label, met }) => (
    <div className="d-flex align-items-center gap-2" style={{ fontSize: '12px', color: met ? '#15803D' : '#6B7280' }}>
      {met ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )}
      <span>{label}</span>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      navigate('/signin', { state: { skipWelcome: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const BrandPanel = () => (
    <div
      className="d-none d-md-flex flex-column text-white"
      style={{
        position: 'relative',
        width: '40%',
        backgroundColor: '#1C3470',
        backgroundImage:
          'linear-gradient(180deg, rgba(24,44,100,0.94) 0%, rgba(30,54,118,0.92) 55%, rgba(38,68,145,0.9) 100%), url(/Loginpage-bgimg.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: 'clamp(24px, 4vw, 56px) clamp(28px, 4vw, 48px)',
        overflow: 'hidden'
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.2"
      >
        <polygon points="50,0 88,50 50,100 12,50" vectorEffect="non-scaling-stroke" />
        <polygon points="50,18 72,50 50,82 28,50" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="d-flex flex-column flex-grow-1" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: 'clamp(36px, 4vw, 44px)', height: 'clamp(36px, 4vw, 44px)', minWidth: '36px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }} className="d-flex align-items-center justify-content-center mb-3">
          <img src="/logo.webp" alt="AFZ Prestige" style={{ width: '55%', height: '55%' }} />
        </div>
        <p className="text-uppercase mb-4" style={{ letterSpacing: '1px', opacity: 0.6, fontSize: 'clamp(10px, 1vw, 11px)', fontWeight: 600 }}>AFZ Prestige Corporate Services</p>

        <h1 className="fw-bold mb-3" style={{ fontSize: 'clamp(20px, 2.2vw, 26px)', lineHeight: '1.3' }}>Welcome to<br />AFZ Prestige CRM</h1>
        <p className="mb-4" style={{ opacity: 0.75, fontSize: 'clamp(12px, 1.2vw, 13px)', lineHeight: '1.6', maxWidth: '320px' }}>
          Manage leads, track sales activities, and stay connected with your team's workflow.
        </p>

        <ul className="list-unstyled mb-4" style={{ fontSize: 'clamp(12px, 1.2vw, 13px)' }}>
          {features.map((item) => (
            <li key={item} className="mb-2 d-flex align-items-center gap-2">
              <span style={{ width: '20px', height: '20px', minWidth: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span style={{ opacity: 0.85 }}>{item}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 mt-auto">
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '14px' }}></div>
          <p style={{ opacity: 0.5, fontSize: 'clamp(10px, 1vw, 11px)' }}>
            For authorized personnel only. This system is monitored in accordance with AFZ Prestige security policy.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex vh-100" style={{ overflow: 'auto' }}>
      <BrandPanel />

      <div
        className="d-flex"
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexGrow: 1,
          paddingTop: 'clamp(24px, 4vw, 56px)',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '24px',
          overflowY: 'auto'
        }}
      >
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', flexShrink: 0 }}>1</span>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Sign In</span>
            </div>
            <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></span>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', flexShrink: 0 }}>2</span>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Request</span>
            </div>
            <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></span>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #1C3470', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#1C3470', flexShrink: 0 }}>3</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C3470' }}>Reset</span>
            </div>
          </div>

          <Link to="/signin" state={{ skipWelcome: true }} className="text-decoration-none d-inline-block mb-3" style={{ fontSize: '13px', color: '#6B7280' }}>
            ‹ Back to Sign In
          </Link>

          <div className="rounded d-flex align-items-center justify-content-center mb-3" style={{ width: '40px', height: '40px', backgroundColor: '#E5ECFF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C3470" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="fw-bold mb-1" style={{ fontSize: '20px', color: '#111827' }}>Create a new password</h2>
          <p className="mb-4" style={{ fontSize: '13px', color: '#6B7280' }}>
            Choose a new password for your CRM account.
          </p>

          {error && <div className="alert alert-danger py-2" style={{ fontSize: '13px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>New Password <span style={{ color: '#B91C1C' }}>*</span></label>
              <div className="position-relative">
                <LockIcon />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ borderRadius: '8px', padding: '9px 36px 9px 36px', fontSize: '13px', borderColor: '#E5E7EB' }}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <EyeIcon open={showPassword} onClick={() => setShowPassword(!showPassword)} />
              </div>

              {password && (
                <div className="mt-2">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="d-flex gap-1" style={{ flex: 1 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            height: '4px',
                            flex: 1,
                            borderRadius: '2px',
                            backgroundColor: i <= strength ? level.bar : '#E5E7EB'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: level.text, minWidth: '32px', textAlign: 'right' }}>{strengthLabel}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(2, auto)', gridAutoFlow: 'column', rowGap: '6px', columnGap: '12px' }}>
                    {checks.map((c) => (
                      <RuleItem key={c.label} label={c.label} met={c.met} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Confirm New Password <span style={{ color: '#B91C1C' }}>*</span></label>
              <div className="position-relative">
                <LockIcon />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ borderRadius: '8px', padding: '9px 36px 9px 36px', fontSize: '13px', borderColor: '#E5E7EB' }}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <EyeIcon open={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{ backgroundColor: '#1C3470', borderRadius: '8px', padding: '10px', fontSize: '14px', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center mt-4" style={{ fontSize: '11px', color: '#9CA3AF' }}>
            © 2026 AFZ Prestige Corporate Services. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateNewPassword;