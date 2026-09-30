import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  CirclePlus,
  CircleX,
  Clock3,
  Copy,
  DollarSign,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Users,
  X,
} from 'lucide-react';
import Layout from '../../components/Layout';
import './dashboard.css';

const API =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const sources = {
  meta: ['M', 'Meta Ads', 'blue'],
  google: ['G', 'Google Ads', 'red'],
  website: ['W', 'Website', 'dark'],
  upwork: ['U', 'Upwork', 'green'],
  b2b: ['B', 'B2B', 'navy'],
  email: ['E', 'Email Marketing', 'purple'],
  manual: ['+', 'Manual Entry', 'gray'],
};

const serviceGroups = [
  [
    'Business Setup & Corporate Services',
    [
      'Company formation',
      'Free zone & mainland',
      'Licensing',
      'Visas & Emirates ID',
      'Bank account assistance',
      'PRO services',
    ],
  ],
  [
    'Accounting, Tax & Audit',
    [
      'Accounting',
      'Bookkeeping',
      'VAT',
      'Corporate Tax',
      'Audit',
      'Financial reporting',
    ],
  ],
  [
    'Digital Marketing',
    [
      'SEO',
      'Meta Ads',
      'Google Ads',
      'Social media management',
      'LinkedIn marketing',
      'Email marketing',
      'Google Business Profile',
      'Lead generation',
    ],
  ],
  [
    'Web & E-Commerce Development',
    [
      'Corporate websites',
      'E-commerce',
      'Shopify',
      'Web applications',
      'Website maintenance',
    ],
  ],
  [
    'Mobile App Development',
    [
      'iOS & Android apps',
      'Flutter development',
      'App maintenance',
      'App integrations',
    ],
  ],
  [
    'AI & Automation',
    [
      'AI chatbots',
      'AI receptionists',
      'WhatsApp automation',
      'Business process automation',
      'AI integrations',
    ],
  ],
  [
    'CRM & SaaS',
    [
      'CRM development',
      'Custom business software',
      'SaaS platforms',
      'Subscription software',
    ],
  ],
  [
    'HR & Recruitment',
    [
      'Recruitment',
      'Staffing',
      'HR services',
      'Employee solutions',
    ],
  ],
  [
    'Creative & Branding',
    [
      'Logo design',
      'Brand identity',
      'Corporate profiles',
      'Brochures',
      'Flyers',
      'Social media designs',
    ],
  ],
  [
    'ASO & App Growth',
    [
      'App Store Optimization',
      'Google Play Optimization',
      'App keyword research',
      'App Store listing optimization',
      'App screenshots & creative optimization',
      'App conversion-rate optimization',
      'Competitor analysis',
      'App ratings & review strategy',
      'Apple Search Ads',
      'Google App Campaigns',
      'Paid app user acquisition',
      'App install campaigns',
      'App remarketing',
      'App growth strategy',
      'App analytics & performance optimization',
    ],
  ],
];

const currencies = [
  ['AED', 'UAE Dirham'],
  ['USD', 'US Dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'British Pound'],
  ['SAR', 'Saudi Riyal'],
  ['QAR', 'Qatari Riyal'],
];

const initialForm = {
  customerName: '',
  companyName: '',
  phone: '',
  email: '',
  leadSource: 'meta',
  serviceRequired: 'Company formation',
  campaign: '',
  assignedTo: '',
  currency: 'AED',
  opportunityValue: '',
  nextFollowUp: '',
  notes: '',
};

const format = (v = 0) => {
  const value = Number(v || 0);

  return `AED ${
    value >= 1000 ? `${Math.round(value / 1000)}K` : value
  }`;
};

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AF';

function Stat({ icon: Icon, tone, value, label, hint }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={15} />
      </div>

      <ChevronRight size={13} className="chevron" />

      <div className="stat-bottom">
        <strong>{value}</strong>

        <div>
          <b>{label}</b>
          <small>{hint}</small>
        </div>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [assignees, setAssignees] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const request = useCallback(
    async (url, options = {}) => {
      const res = await fetch(`${API}${url}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Something went wrong');
      }

      return json;
    },
    []
  );

  const load = useCallback(async () => {
    try {
      setError('');
      setData(await request('/dashboard'));
    } catch (e) {
      setError(e.message);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    request('/leads/assignees')
      .then((list) => {
        setAssignees(list);
        const mine = list.find((u) => u.id === user.id) || list[0];
        if (mine) {
          setForm((f) => ({ ...f, assignedTo: mine.id }));
        }
      })
      .catch(() => {});
  }, [request]);

  const defaultAssignee = () => {
    const mine = assignees.find((u) => u.id === user.id) || assignees[0];
    return mine ? mine.id : user.id;
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await request('/leads', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          assignedTo: form.assignedTo || user.id,
          opportunityValue: Number(form.opportunityValue),
        }),
      });

      setOpen(false);
      setForm({ ...initialForm, assignedTo: defaultAssignee() });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const change = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  if (!data) {
    return (
      <main className="loading">
        <b>
          {error
            ? 'Dashboard unavailable'
            : 'Loading AFZ Prestige CRM…'}
        </b>

        {error && <button onClick={load}>Try again</button>}
      </main>
    );
  }

  const {
  stats,
  leadSources,
  pipeline,
  followUps,
  meetings,
  recentLeads,
} = data;

const calendlyUrl =
  data.calendlyUrl || 'https://calendly.com/your-name/discovery-call';

const max = Math.max(
  ...leadSources.map((s) => Number(s.leads)),
  1
);

  return (
    <Layout
      meetings={stats.meetings}
      notifications={stats.followUps}
    >
      <div className="page-heading">
        <div>
          <h1>Sales Dashboard</h1>

          <p>
            AFZ Prestige CRM ·{' '}
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <button className="add-btn" onClick={() => setOpen(true)}>
          <Plus size={15} />
          Add Lead
        </button>
      </div>

      {error && <p className="toast-error">{error}</p>}

      <section className="stats-grid">
        <Stat
          icon={Users}
          tone="slate"
          value={stats.total}
          label="Total Leads"
          hint="All time"
        />

        <Stat
          icon={CirclePlus}
          tone="blue"
          value={stats.newLeads}
          label="New Leads"
          hint="New + Assigned"
        />

        <Stat
          icon={Check}
          tone="green"
          value={stats.qualified}
          label="Qualified"
          hint="In pipeline"
        />

        <Stat
          icon={Clock3}
          tone="orange"
          value={stats.followUps}
          label="Follow-ups"
          hint="Pending action"
        />

        <Stat
          icon={CalendarDays}
          tone="purple"
          value={stats.meetings}
          label="Meetings"
          hint="Scheduled"
        />

        <Stat
          icon={FileText}
          tone="cyan"
          value={stats.proposals}
          label="Proposals"
          hint="Active"
        />

        <Stat
          icon={CircleCheck}
          tone="green"
          value={stats.won}
          label="Won"
          hint="Converted"
        />

        <Stat
          icon={CircleX}
          tone="red"
          value={stats.lost}
          label="Lost"
          hint="No deal"
        />

        <Stat
          icon={CircleX}
          tone="red"
          value={stats.notContacted}
          label="Not Contacted"
          hint="Leads"
        />

        <Stat
          icon={DollarSign}
          tone="slate"
          value={format(stats.revenue)}
          label="Revenue"
          hint={`${stats.conversion}% conv.`}
        />
      </section>

      <section className={`calendly ${calendlyUrl ? 'live' : ''}`}>
        <div className="calendar-icon">
          <Clock3 size={17} />
        </div>

        <div className="cal-info">
          <b>
            Calendly Booking Link {calendlyUrl && <em>LIVE</em>}
          </b>

          <small>
            {calendlyUrl ||
              'No Calendly URL configured — add one in Settings → Profile'}
          </small>
        </div>

        {calendlyUrl ? (
          <div className="cal-actions">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(calendlyUrl)}
            >
              <Copy size={13} />
              Copy Link
            </button>

            <a href={calendlyUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={13} />
              Open
            </a>

            <button type="button" onClick={() => navigate('/settings')}>
              <Pencil size={13} />
              Edit
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => navigate('/settings')}>
            Set Up
          </button>
        )}
      </section>

      <section className="middle-grid">
        <article className="panel sources">
          <h2>Lead Source Performance</h2>

          {leadSources.length ? (
            leadSources.map((s) => {
              const info = sources[s.source] || ['?', s.source, 'gray'];

              return (
                <div className="source-row" key={s.source}>
                  <span className={`source ${info[2]}`}>
                    <i>{info[0]}</i>
                    {info[1]}
                  </span>

                  <div className="progress">
                    <i
                      style={{
                        width: `${(Number(s.leads) / max) * 100}%`,
                      }}
                    />
                  </div>

                  <small>
                    <b>{s.leads}</b> leads
                  </small>

                  <small className="won">
                    <b>{s.won}</b> won
                  </small>

                  <strong>{s.rate}%</strong>
                </div>
              );
            })
          ) : (
            <p className="empty">No leads yet.</p>
          )}
        </article>

        <article className="panel pipeline">
          <h2>Pipeline Summary</h2>

          {pipeline.map((p) => (
            <div className="pipeline-row" key={p.stage}>
              <i className={p.stage} />

              <span>{p.stage}</span>

              <b>{p.count}</b>

              <small>{format(p.value)}</small>
            </div>
          ))}
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel">
          <h2>
            Today's Follow-ups <a>View all</a>
          </h2>

          {followUps.length ? (
            followUps.map((l) => (
              <div className="follow-row" key={l.id}>
                <i>
                  {initials(l.assignedRep?.name || l.customerName)}
                </i>

                <span>
                  <b>{l.customerName}</b>
                  <small>{l.companyName}</small>
                </span>

                <em>• Follow-up</em>
              </div>
            ))
          ) : (
            <p className="empty">No follow-ups for today.</p>
          )}
        </article>

        <article className="panel">
          <h2>
            Upcoming Meetings <a>View all</a>
          </h2>

          {meetings.length ? (
            meetings.map((m) => (
              <div className="meeting-row" key={m.id}>
                <i>
                  {new Date(m.date).toLocaleDateString('en-GB', {
                    month: 'numeric',
                    day: 'numeric',
                  })}
                </i>

                <span>
                  <b>{m.lead?.customerName}</b>

                  <small>
                    {new Date(m.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {m.type}
                  </small>
                </span>
              </div>
            ))
          ) : (
            <p className="empty">No upcoming meetings.</p>
          )}
        </article>

        <article className="panel">
          <h2>
            Recent Leads <a>View all</a>
          </h2>

          {recentLeads.length ? (
            recentLeads.map((l) => (
              <div className="recent-row" key={l.id}>
                <span>
                  <b>{l.customerName}</b>

                  <small>
                    {l.companyName} ·{' '}
                    {sources[l.leadSource]?.[1] || l.leadSource}
                  </small>
                </span>

                <div>
                  <em>{l.status}</em>

                  <small>{format(l.valueAED)}</small>
                </div>
              </div>
            ))
          ) : (
            <p className="empty">No leads yet.</p>
          )}
        </article>
      </section>

      {open && (
        <div className="modal-backdrop">
          <form className="lead-modal" onSubmit={save}>
            <header>
              <h2>Add New Lead</h2>

              <button type="button" onClick={() => setOpen(false)}>
                <X size={17} />
              </button>
            </header>

            <div className="lead-fields">
              <label>
                Full Name <b>*</b>
                <input
                  required
                  value={form.customerName}
                  onChange={change('customerName')}
                  placeholder="e.g. Ahmed Al-Mansouri"
                />
              </label>

              <label>
                Company <b>*</b>
                <input
                  required
                  value={form.companyName}
                  onChange={change('companyName')}
                  placeholder="e.g. Dubai Holdings LLC"
                />
              </label>

              <label>
                Phone <b>*</b>
                <input
                  required
                  value={form.phone}
                  onChange={change('phone')}
                  placeholder="+971 50 000 0000"
                />
              </label>

              <label>
                Email <b>*</b>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={change('email')}
                  placeholder="name@company.ae"
                />
              </label>

              <label>
                Lead Source <b>*</b>
                <select
                  value={form.leadSource}
                  onChange={change('leadSource')}
                >
                  {Object.entries(sources).map(([value, item]) => (
                    <option value={value} key={value}>
                      {item[1]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Service <b>*</b>
                <select
                  value={form.serviceRequired}
                  onChange={change('serviceRequired')}
                >
                  {serviceGroups.map(([group, items]) => (
                    <optgroup label={group} key={group}>
                      {items.map((x) => (
                        <option value={x} key={`${group}-${x}`}>
                          {x}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              <label>
                Campaign
                <input
                  value={form.campaign}
                  onChange={change('campaign')}
                  placeholder="Campaign name (optional)"
                />
              </label>

              <label>
                Assigned To <b>*</b>
                <select
                  required
                  value={form.assignedTo}
                  onChange={change('assignedTo')}
                >
                  {assignees.length ? (
                    assignees.map((u) => (
                      <option value={u.id} key={u.id}>
                        {u.name}
                      </option>
                    ))
                  ) : (
                    <option value={user.id}>
                      {user.name || 'AFZ User'}
                    </option>
                  )}
                </select>
              </label>

              <label>
                Currency <b>*</b>
                <select
                  value={form.currency}
                  onChange={change('currency')}
                >
                  {currencies.map(([code, name]) => (
                    <option value={code} key={code}>
                      {code} — {name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Opportunity Value ({form.currency}) <b>*</b>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.opportunityValue}
                  onChange={change('opportunityValue')}
                  placeholder="e.g. 50000"
                />
              </label>

              <label>
                Next Follow-up Date
                <input
                  type="date"
                  value={form.nextFollowUp}
                  onChange={change('nextFollowUp')}
                />
              </label>

              <div />

              <label className="wide">
                Notes
                <textarea
                  value={form.notes}
                  onChange={change('notes')}
                  placeholder="Any relevant details about this lead..."
                />
              </label>
            </div>

            <footer>
              <button type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>

              <button className="create" disabled={saving}>
                {saving ? 'Saving...' : 'Create Lead'}
              </button>
            </footer>
          </form>
        </div>
      )}
    </Layout>
  );
}