import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  'Lead & opportunity management',
  'Sales pipeline & proposals',
  'Meetings, tasks & follow-ups',
  'Team performance & reporting',
];

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMobileForm, setShowMobileForm] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      navigate('/check-email');
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
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', flexShrink: 0 }}>1</span>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Sign In</span>
            </div>
            <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></span>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #1C3470', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#1C3470', flexShrink: 0 }}>2</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C3470' }}>Request</span>
            </div>
            <span style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></span>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: '#9CA3AF', flexShrink: 0 }}>3</span>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Reset</span>
            </div>
          </div>

          <Link to="/signin" state={{ skipWelcome: true }} className="text-decoration-none d-block mb-3" style={{ fontSize: '13px', color: '#6B7280' }}>
            ‹ Back to Sign In
          </Link>

          <div className="rounded d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '40px', height: '40px', backgroundColor: '#E5ECFF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C3470" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <h2 className="fw-bold mb-1" style={{ fontSize: '20px', color: '#111827' }}>Forgot your password?</h2>
          <p className="mb-4" style={{ fontSize: '13px', color: '#6B7280' }}>
            Enter your work email address and we'll help you reset your password.
          </p>

          {error && <div className="alert alert-danger py-2" style={{ fontSize: '13px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
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
              <p className="mt-1" style={{ fontSize: '12px', color: '#9CA3AF' }}>
                We'll send instructions to this address if an account exists.
              </p>
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold mt-3"
              style={{ backgroundColor: '#1C3470', borderRadius: '8px', padding: '10px', fontSize: '14px', border: 'none' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/signin" state={{ skipWelcome: true }} style={{ fontSize: '13px', color: '#234090', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </div>

          <p className="text-center mt-4" style={{ fontSize: '11px', color: '#9CA3AF' }}>
            © 2026 AFZ Prestige Corporate Services. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;