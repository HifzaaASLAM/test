import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  'Lead & opportunity management',
  'Sales pipeline & proposals',
  'Meetings, tasks & follow-ups',
  'Team performance & reporting',
];

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMobileForm, setShowMobileForm] = useState(() => {
    const skip = sessionStorage.getItem('skipWelcome') === 'true';
    if (skip) sessionStorage.removeItem('skipWelcome');
    return skip;
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const BrandPanel = ({ mobile }) => (
    <div
      className={mobile ? 'd-flex d-md-none flex-column text-white' : 'd-none d-md-flex flex-column text-white'}
      style={{
        position: 'relative',
        width: mobile ? '100%' : '40%',
        minHeight: mobile ? '100vh' : 'auto',
        backgroundColor: '#1C3470',
        backgroundImage:
          'linear-gradient(180deg, rgba(24,44,100,0.94) 0%, rgba(30,54,118,0.92) 55%, rgba(38,68,145,0.9) 100%), url(/Loginpage-bgimg.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: mobile ? '56px 32px 40px' : 'clamp(24px, 4vw, 56px) clamp(28px, 4vw, 48px)',
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

        {mobile ? (
          <button
            onClick={() => setShowMobileForm(true)}
            className="btn text-white fw-semibold d-flex align-items-center justify-content-center gap-2 mt-auto"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '12px', fontSize: '14px' }}
          >
            Continue <span>→</span>
          </button>
        ) : (
          <div className="pt-2 mt-auto">
            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: '14px' }}></div>
            <p style={{ opacity: 0.5, fontSize: 'clamp(10px, 1vw, 11px)' }}>
              For authorized personnel only. This system is monitored in accordance with AFZ Prestige security policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="d-flex vh-100" style={{ overflow: 'auto' }}>
      <BrandPanel mobile={false} />
      {!showMobileForm && <BrandPanel mobile={true} />}

      <div
        className={showMobileForm ? 'd-flex' : 'd-none d-md-flex'}
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexGrow: 1,
          paddingTop: 'clamp(24px, 4vw, 56px)',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '24px',
          overflowY: 'auto',
          animation: 'fadeSlideIn 0.4s ease'
        }}
      >
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #1C3470', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#1C3470', flexShrink: 0 }}>1</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C3470' }}>Sign In</span>
            </div>
            <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></span>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', flexShrink: 0 }}>2</span>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Request</span>
            </div>
            <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></span>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', flexShrink: 0 }}>3</span>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Reset</span>
            </div>
          </div>

          <h2 className="fw-bold mb-1" style={{ fontSize: '20px', color: '#111827' }}>Welcome back</h2>
          <p className="mb-4" style={{ fontSize: '13px', color: '#6B7280' }}>Sign in to access your CRM workspace.</p>

          {error && <div className="alert alert-danger py-2" style={{ fontSize: '13px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Work Email <span style={{ color: '#B91C1C' }}>*</span></label>
              <input
                type="email"
                className="form-control"
                style={{ borderRadius: '8px', padding: '9px 12px', fontSize: '13px', borderColor: '#E5E7EB' }}
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#111827' }}>Password <span style={{ color: '#B91C1C' }}>*</span></label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  style={{ borderRadius: '8px', padding: '9px 36px 9px 12px', fontSize: '13px', borderColor: '#E5E7EB' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute"
                  style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6B7280' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
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
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: '13px', color: '#374151' }}>
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" style={{ fontSize: '13px', color: '#234090', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{ backgroundColor: '#1C3470', borderRadius: '8px', padding: '10px', fontSize: '14px', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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

export default SignIn;