'use client';
import { useState } from 'react';
import { X } from 'lucide-react';

const SOURCES = ['Meta Ads', 'Google Ads', 'Website', 'Upwork', 'B2B', 'Email Marketing', 'Manual Entry'];
const SERVICES = ['iOS App', 'Android App', 'Web Development', 'CRM / ERP', 'UI/UX Design', 'Digital Marketing', 'Consulting'];
const USERS = ['Aleena Babar', 'Khalid Mansoor'];
const CURRENCIES = [
  ['AED', 'UAE Dirham'],
  ['USD', 'US Dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'British Pound'],
  ['SAR', 'Saudi Riyal'],
  ['QAR', 'Qatari Riyal'],
];

const initialForm = {
  fullName: '',
  company: '',
  phone: '',
  email: '',
  leadSource: 'Meta Ads',
  service: 'iOS App',
  campaign: '',
  assignedTo: 'Aleena Babar',
  currency: 'AED',
  opportunityValue: '',
  followUpDate: '',
  notes: '',
};

const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.55)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    background: '#fff',
    borderRadius: 14,
    width: '100%',
    maxWidth: 672,
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  title: { margin: 0, fontSize: 17, fontWeight: 600, color: '#111827' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' },
  body: {
    padding: 24,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  star: { color: '#dc2626', marginLeft: 3 },
  input: {
    height: 38,
    padding: '0 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: 80,
    fontFamily: 'inherit',
  },
  full: { gridColumn: '1 / -1' },
  error: { margin: '0 24px 8px', color: '#dc2626', fontSize: 13 },
  foot: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
  },
  cancel: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: '#111827',
    padding: '10px 16px',
  },
  create: {
    background: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

function Field({ label, required, children, style }) {
  return (
    <label style={{ ...s.field, ...style }}>
      <span style={s.label}>
        {label}
        {required && <span style={s.star}>*</span>}
      </span>
      {children}
    </label>
  );
}

export default function AddLeadModal({ onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    const required = ['fullName', 'company', 'phone', 'email', 'leadSource', 'service', 'assignedTo', 'currency', 'opportunityValue'];
    const missing = required.some((key) => String(form[key]).trim() === '');
    if (missing) {
      setError('Please fill all required fields (*)');
      return;
    }
    setError('');
    const lead = { ...form, opportunityValue: Number(form.opportunityValue), id: Date.now() };
    if (onCreated) onCreated(lead);
    onClose();
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.head}>
          <h3 style={s.title}>Add New Lead</h3>
          <button type="button" style={s.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={s.body}>
          <Field label="Full Name" required>
            <input style={s.input} placeholder="e.g. Ahmed Al-Mansouri" value={form.fullName} onChange={set('fullName')} />
          </Field>

          <Field label="Company" required>
            <input style={s.input} placeholder="e.g. Dubai Holdings LLC" value={form.company} onChange={set('company')} />
          </Field>

          <Field label="Phone" required>
            <input style={s.input} placeholder="+971 50 000 0000" value={form.phone} onChange={set('phone')} />
          </Field>

          <Field label="Email" required>
            <input style={s.input} type="email" placeholder="name@company.ae" value={form.email} onChange={set('email')} />
          </Field>

          <Field label="Lead Source" required>
            <select style={s.input} value={form.leadSource} onChange={set('leadSource')}>
              {SOURCES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Service" required>
            <select style={s.input} value={form.service} onChange={set('service')}>
              {SERVICES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Campaign">
            <input style={s.input} placeholder="Campaign name (optional)" value={form.campaign} onChange={set('campaign')} />
          </Field>

          <Field label="Assigned To" required>
            <select style={s.input} value={form.assignedTo} onChange={set('assignedTo')}>
              {USERS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </Field>

          <Field label="Currency" required>
            <select style={s.input} value={form.currency} onChange={set('currency')}>
              {CURRENCIES.map(([code, name]) => (
                <option key={code} value={code}>{code} — {name}</option>
              ))}
            </select>
          </Field>

          <Field label={`Opportunity Value (${form.currency})`} required>
            <input
              style={s.input}
              type="number"
              min="0"
              placeholder="e.g. 50000"
              value={form.opportunityValue}
              onChange={set('opportunityValue')}
            />
          </Field>

          <Field label="Next Follow-up Date">
            <input style={s.input} type="date" value={form.followUpDate} onChange={set('followUpDate')} />
          </Field>

          <div />

          <Field label="Notes" style={s.full}>
            <textarea
              style={s.textarea}
              placeholder="Any relevant details about this lead..."
              value={form.notes}
              onChange={set('notes')}
            />
          </Field>
        </div>

        {error && <p style={s.error}>{error}</p>}

        <div style={s.foot}>
          <button type="button" style={s.cancel} onClick={onClose}>Cancel</button>
          <button type="button" style={s.create} onClick={handleSubmit}>Create Lead</button>
        </div>
      </div>
    </div>
  );
}