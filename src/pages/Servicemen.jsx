import React, { useEffect, useMemo, useState } from 'react';
import { getServicemen, createServiceman } from '../api/adminApi';

export default function Servicemen() {
  const [servicemen, setServicemen] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    skill: '',
    status: 'Available',
  });

  const loadServicemen = async () => {
    try {
      const res = await getServicemen();
      setServicemen(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadServicemen();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return servicemen.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.skill?.toLowerCase().includes(q)
    );
  }, [search, servicemen]);

  const availableCount = servicemen.filter((s) => s.status === 'Available').length;
  const busyCount = servicemen.filter((s) => s.status === 'Busy').length;
  const inactiveCount = servicemen.filter((s) => s.status === 'Inactive').length;

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateServiceman = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        skill: form.skill.trim(),
        status: form.status,
      };

      const res = await createServiceman(payload);

      setMessage(res?.data?.message || res?.message || 'Serviceman created successfully');

      setForm({
        name: '',
        email: '',
        phone: '',
        skill: '',
        status: 'Available',
      });

      await loadServicemen();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Failed to create serviceman');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    if (status === 'Available') {
      return {
        backgroundColor: '#E8F8EE',
        color: '#16A34A',
      };
    }

    if (status === 'Inactive') {
      return {
        backgroundColor: '#F1F5F9',
        color: '#64748B',
      };
    }

    return {
      backgroundColor: '#FFF4E5',
      color: '#F59E0B',
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div>
          <p style={styles.welcome}>Workforce Management</p>
          <h1 style={styles.pageTitle}>Servicemen</h1>
          <p style={styles.subtitle}>
            Manage all service professionals and track their availability.
          </p>
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p>Total</p>
          <h3>{servicemen.length}</h3>
        </div>

        <div style={styles.statCard}>
          <p>Available</p>
          <h3>{availableCount}</h3>
        </div>

        <div style={styles.statCard}>
          <p>Busy</p>
          <h3>{busyCount}</h3>
        </div>

        <div style={styles.statCard}>
          <p>Inactive</p>
          <h3>{inactiveCount}</h3>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h3 style={styles.title}>Create Serviceman</h3>
            <p style={styles.formSubtext}>
              Add a new serviceman. A user account will also be created from backend.
            </p>
          </div>

          {message ? <div style={styles.messageBox}>{message}</div> : null}

          <form onSubmit={handleCreateServiceman} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Skill</label>
              <input
                type="text"
                name="skill"
                value={form.skill}
                onChange={handleChange}
                placeholder="Enter skill"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button type="submit" style={styles.createBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create Serviceman'}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.topRow}>
            <h3 style={styles.title}>Servicemen List</h3>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.search}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Serviceman</th>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Skill</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((man) => (
                  <tr key={man.id}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>{getInitials(man.name)}</div>
                        <div>
                          <div style={styles.name}>{man.name}</div>
                          <div style={styles.sub}>{man.email || 'Technician'}</div>
                        </div>
                      </div>
                    </td>

                    <td style={styles.td}>{man.id}</td>
                    <td style={styles.td}>{man.phone}</td>
                    <td style={styles.td}>{man.skill}</td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          ...getStatusStyles(man.status),
                        }}
                      >
                        {man.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyCell}>
                      No servicemen found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#F4F7FB',
    minHeight: '100vh',
    padding: '24px',
  },
  headerCard: {
    background: 'linear-gradient(135deg, #1D5AA6, #2563EB)',
    borderRadius: '24px',
    padding: '24px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  welcome: {
    margin: 0,
    opacity: 0.8,
  },
  pageTitle: {
    margin: '6px 0',
    fontSize: '30px',
  },
  subtitle: {
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '180px',
    background: '#fff',
    padding: '16px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  formCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
  },
  formHeader: {
    marginBottom: '16px',
  },
  formSubtext: {
    margin: '8px 0 0',
    fontSize: '14px',
    color: '#64748B',
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  title: {
    margin: 0,
  },
  search: {
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    minWidth: '220px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#334155',
  },
  input: {
    height: '44px',
    borderRadius: '12px',
    border: '1px solid #D9E2EC',
    padding: '0 14px',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
  },
  createBtn: {
    marginTop: '8px',
    height: '46px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1D5AA6, #2563EB)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  messageBox: {
    background: '#EFF6FF',
    color: '#1D4ED8',
    border: '1px solid #BFDBFE',
    padding: '12px',
    borderRadius: '12px',
    marginBottom: '14px',
    fontSize: '14px',
    fontWeight: 600,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #ddd',
    color: '#475569',
    fontSize: '14px',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    flexShrink: 0,
  },
  name: {
    fontWeight: 700,
  },
  sub: {
    color: '#64748B',
    fontSize: '13px',
    marginTop: '2px',
  },
  badge: {
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '12px',
    display: 'inline-block',
  },
  emptyCell: {
    textAlign: 'center',
    padding: '24px',
    color: '#64748B',
  },
};