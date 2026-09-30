import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  Bell,
  CalendarDays,
  DollarSign,
  FileText,
  LayoutDashboard,
  Menu,
  Search,
  Settings2,
  Users,
  X,
} from 'lucide-react';
import './layout.css';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AF';

function Brand({ className, children }) {
  return (
    <div className={className}>
      <img
        src="/afz-mark.png"
        alt="AFZ Prestige"
        className="brand-mark"
      />

      <div className="brand-text">
        <span className="brand-name">AFZ</span>
        <span className="brand-name">PRESTIGE</span>
        <span className="brand-sub">Corporate Services</span>
      </div>

      {children}
    </div>
  );
}

function Item({ icon: Icon, to, children, count, onClick }) {
  const body = (
    <>
      <Icon size={16} />
      <span>{children}</span>
      {count ? <b>{count}</b> : null}
    </>
  );

  if (!to) {
    return (
      <button type="button" className="side-item">
        {body}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `side-item ${isActive ? 'active' : ''}`
      }
    >
      {body}
    </NavLink>
  );
}

export default function Layout({
  children,
  meetings = 0,
  notifications = 0,
}) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay ${menuOpen ? 'show' : ''}`}
        onClick={closeMenu}
      />

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Brand className="brand-logo">
          <button
            type="button"
            className="sidebar-close"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <X size={18} />
          </button>
        </Brand>

        <nav>
          <Item
            icon={LayoutDashboard}
            to="/dashboard"
            onClick={closeMenu}
          >
            Dashboard
          </Item>

          <Item icon={Users} to="/leads" onClick={closeMenu}>
            Leads
          </Item>

          <Item icon={Activity}>Sales Pipeline</Item>

          <Item icon={CalendarDays} count={meetings}>
            Meetings
          </Item>

          <Item icon={FileText}>Proposals</Item>

          <Item icon={DollarSign}>Invoices</Item>

          <Item icon={Bell} count={notifications}>
            Notifications
          </Item>

          <p className="soon-label">COMING SOON</p>

          {[
            'Clients',
            'Operations',
            'Reports',
            'Employees',
            'Administration',
          ].map((x) => (
            <button type="button" className="soon" key={x}>
              <span />
              {x}
              <b>SOON</b>
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <Item icon={Settings2}>Settings</Item>

          <div className="profile">
            <i>{initials(user.name)}</i>

            <span>
              <b>{user.name || 'AFZ User'}</b>

              <small>
                {user.role === 'management'
                  ? 'Sales Manager'
                  : user.role || 'Team Member'}
              </small>
            </span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button
            type="button"
            className="menu-btn"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Brand className="topbar-brand" />

          <div className="search">
            <Search size={17} />

            <input placeholder="Search leads, customers, proposals..." />
          </div>

          <div className="top-user">
            <Bell size={18} />

            <span className="notification" />

            <i>{initials(user.name)}</i>

            <span>
              <b>{user.name || 'AFZ User'}</b>
              <small>Sales Manager</small>
            </span>
          </div>
        </header>

        <main className="content">{children}</main>
      </section>
    </div>
  );
}