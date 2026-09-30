import { useCallback, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import Layout from '../../components/Layout';
import './leads.css';

const API =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PAGE_SIZE = 10;

const sources = {
  meta: ['M', 'Meta Ads', 'blue'],
  google: ['G', 'Google Ads', 'red'],
  website: ['W', 'Website', 'dark'],
  upwork: ['U', 'Upwork', 'green'],
  b2b: ['B', 'B2B', 'navy'],
  email: ['E', 'Email Marketing', 'purple'],
  manual: ['+', 'Manual Entry', 'gray'],
};

const statuses = [
  ['new', 'New'],
  ['assigned', 'Assigned'],
  ['contacted', 'Contacted'],
  ['interested', 'Interested'],
  ['not_interested', 'Not Interested'],
  ['qualified', 'Qualified'],
  ['unqualified', 'Unqualified'],
  ['follow_up', 'Follow-up'],
  ['meeting', 'Meeting'],
  ['proposal', 'Proposal'],
  ['negotiation', 'Negotiation'],
  ['won', 'Won'],
  ['lost', 'Lost'],
];

const statusLabels = Object.fromEntries([
  ...statuses,
  ['not_contacted', 'Not Contacted'],
]);

const statusTone = {
  new: 'blue',
  assigned: 'purple',
  contacted: 'cyan',
  not_contacted: 'red',
  interested: 'cyan',
  not_interested: 'gray',
  qualified: 'green',
  unqualified: 'gray',
  follow_up: 'amber',
  meeting: 'purple',
  proposal: 'blue',
  negotiation: 'orange',
  won: 'green',
  lost: 'red',
};

const leadId = (id) => `L-${String(id).padStart(3, '0')}`;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-CA') : '—';

function PageBar({ page, pages, from, to, total, onChange }) {
  const numbers = [];

  for (
    let i = Math.max(1, page - 2);
    i <= Math.min(pages, page + 2);
    i += 1
  ) {
    numbers.push(i);
  }

  return (
    <div className="leads-bar">
      <span className="leads-showing">
        Showing <b>{from}–{to}</b> of <b>{total}</b> leads
      </span>

      <div className="pager">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={15} />
        </button>

        {numbers.map((n) => (
          <button
            key={n}
            className={n === page ? 'active' : ''}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}

        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [allTotal, setAllTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
      });

      if (query) params.set('search', query);
      if (status) params.set('status', status);
      if (source) params.set('leadSource', source);

      const res = await fetch(`${API}/leads?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Something went wrong');
      }

      setLeads(json.leads);
      setTotal(json.total);
      setPages(json.pages);

      if (!query && !status && !source) {
        setAllTotal(json.total);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, query, status, source]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const changeSource = (e) => {
    setSource(e.target.value);
    setPage(1);
  };

  const from = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <Layout>
      <div className="leads-head">
        <div>
          <h1>Leads</h1>
          <p>
            {total} of {allTotal || total} leads
          </p>
        </div>

        <div className="leads-actions">
          <button className="btn-outline">
            <Filter size={14} />
            Filter
          </button>

          <button className="btn-primary">
            <Plus size={15} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="leads-toolbar">
        <div className="leads-filters">
          <input
            className="leads-search"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={status} onChange={changeStatus}>
            <option value="">All Statuses</option>
            {statuses.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>

          <select value={source} onChange={changeSource}>
            <option value="">All Sources</option>
            {Object.entries(sources).map(([value, item]) => (
              <option value={value} key={value}>
                {item[1]}
              </option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button className="active">
            <List size={14} />
            Table
          </button>

          <button>
            <LayoutGrid size={14} />
            Kanban
          </button>
        </div>
      </div>

      {error && <p className="leads-error">{error}</p>}

      <PageBar
        page={page}
        pages={pages}
        from={from}
        to={to}
        total={total}
        onChange={setPage}
      />

      <div className="leads-table-wrap">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Lead ID</th>
              <th>Customer</th>
              <th>Company</th>
              <th>Source</th>
              <th>Service</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && !leads.length ? (
              <tr>
                <td colSpan="9" className="leads-empty">
                  Loading leads…
                </td>
              </tr>
            ) : leads.length ? (
              leads.map((l) => {
                const src = sources[l.leadSource] || [
                  '?',
                  l.leadSource,
                  'gray',
                ];

                return (
                  <tr key={l.id}>
                    <td className="lead-id">{leadId(l.id)}</td>

                    <td className="lead-name">{l.customerName}</td>

                    <td>{l.companyName || '—'}</td>

                    <td>
                      <span className={`lead-source ${src[2]}`}>
                        <i>{src[0]}</i>
                        {src[1]}
                      </span>
                    </td>

                    <td className="lead-service">
                      {l.serviceRequired}
                    </td>

                    <td>{l.assignedRep?.name || '—'}</td>

                    <td>
                      <span
                        className={`lead-status ${
                          statusTone[l.status] || 'gray'
                        }`}
                      >
                        {statusLabels[l.status] || l.status}
                      </span>
                    </td>

                    <td>{formatDate(l.nextFollowUp)}</td>

                    <td>
                      <button className="lead-more">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="leads-empty">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PageBar
        page={page}
        pages={pages}
        from={from}
        to={to}
        total={total}
        onChange={setPage}
      />
    </Layout>
  );
}