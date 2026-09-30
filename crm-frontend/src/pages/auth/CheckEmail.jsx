import { Link } from 'react-router-dom';

const features = [
  'Lead & opportunity management',
  'Sales pipeline & proposals',
  'Meetings, tasks & follow-ups',
  'Team performance & reporting',
];

function CheckEmail() {
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
        <div style={{ width: '100%', maxWidth: '360px' }} className="text-center">
          <div className="d-flex align-items-center gap-2 mb-4 text-start">
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

          <div className="position-relative d-inline-block mb-3">
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{ width: '48px', height: '48px', backgroundColor: '#FFFFFF', border: '2px solid #BBF7D0' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '2px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#15803D' }}></span>
            </span>
          </div>

          <h2 className="fw-bold mb-2" style={{ fontSize: '20px', color: '#111827' }}>Check your email</h2>
          <p className="mb-2" style={{ fontSize: '13px', color: '#6B7280' }}>
            If an account exists for this email, password reset instructions will be sent shortly.
          </p>
          <p className="mb-4" style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Check your spam folder if you don't see it within a few minutes.
          </p>

          <Link
            to="/signin"
            state={{ skipWelcome: true }}
            className="btn w-100 text-white fw-semibold d-block"
            style={{ backgroundColor: '#1C3470', borderRadius: '8px', padding: '10px', fontSize: '14px', textDecoration: 'none' }}
          >
            Back to Sign In
          </Link>

          <p className="mt-4" style={{ fontSize: '12px', color: '#9CA3AF' }}>
            You can close this page after requesting a reset.
          </p>

          <p className="mt-4" style={{ fontSize: '13px', color: '#9CA3AF' }}>
            Want to set a new password now?{' '}
            <Link to="/create-new-password" style={{ color: '#234090', textDecoration: 'none' }}>
              Go to Reset Password
            </Link>
          </p>

          <p className="text-center mt-5" style={{ fontSize: '11px', color: '#9CA3AF' }}>
            © 2026 AFZ Prestige Corporate Services. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;