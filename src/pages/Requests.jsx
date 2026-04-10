import React, { useEffect, useMemo, useState } from 'react';
import { assignServiceman, getBookings, getServicemen } from '../api/adminApi';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [servicemen, setServicemen] = useState([]);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    try {
      const [bookingRes, servicemenRes] = await Promise.all([
        getBookings(),
        getServicemen(),
      ]);

      setRequests(bookingRes.data?.data || []);
      setServicemen(servicemenRes.data?.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load request data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (id, servicemanId) => {
    try {
      if (!servicemanId) return;
      await assignServiceman(id, Number(servicemanId));
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign serviceman');
    }
  };

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;

    return requests.filter(
      (req) =>
        req.bookingCode?.toLowerCase().includes(q) ||
        req.name?.toLowerCase().includes(q) ||
        req.service?.serviceName?.toLowerCase().includes(q) ||
        req.customAddress?.toLowerCase().includes(q) ||
        req.status?.toLowerCase().includes(q) ||
        req.serviceman?.name?.toLowerCase().includes(q)
    );
  }, [requests, search]);

  const totalRequests = requests.length;
  const newRequests = requests.filter((r) => r.status === 'PENDING').length;
  const assignedRequests = requests.filter((r) => r.status === 'ASSIGNED').length;
  const completedRequests = requests.filter((r) => r.status === 'COMPLETED').length;

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') {
      return {
        backgroundColor: '#E8F8EE',
        color: '#16A34A',
      };
    }

    if (status === 'ASSIGNED' || status === 'IN_PROGRESS') {
      return {
        backgroundColor: '#EAF2FF',
        color: '#1D4ED8',
      };
    }

    return {
      backgroundColor: '#FFF7ED',
      color: '#EA580C',
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div>
          <p style={styles.welcome}>Request Management</p>
          <h1 style={styles.pageTitle}>Service Requests</h1>
          <p style={styles.pageSubtitle}>
            View incoming service requests, assign servicemen, and track progress.
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Requests</p>
          <h3 style={styles.statValue}>{totalRequests}</h3>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>New Requests</p>
          <h3 style={styles.statValue}>{newRequests}</h3>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Assigned</p>
          <h3 style={styles.statValue}>{assignedRequests}</h3>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Completed</p>
          <h3 style={styles.statValue}>{completedRequests}</h3>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.title}>Requests Table</h3>
            <p style={styles.subTitle}>Manage service requests and assignments</p>
          </div>

          <div style={styles.searchWrap}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              style={styles.searchInput}
            />
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Request ID</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Service</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Assigned Serviceman</th>
                <th style={styles.th}>Assign</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((req) => {
                const statusStyle = getStatusBadge(req.status);

                return (
                  <tr key={req.id}>
                    <td style={styles.td}>
                      <span style={styles.requestId}>{req.bookingCode}</span>
                    </td>
                    <td style={styles.td}>{req.name}</td>
                    <td style={styles.td}>{req.service?.serviceName}</td>
                    <td style={styles.td}>{req.customAddress || '-'}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: statusStyle.backgroundColor,
                          color: statusStyle.color,
                        }}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {req.serviceman ? (
                        <span style={styles.assignedName}>{req.serviceman.name}</span>
                      ) : (
                        <span style={styles.unassigned}>Not assigned</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <select
                        value={req.serviceman?.id || ''}
                        onChange={(e) => handleAssign(req.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Select serviceman</option>
                        {servicemen.map((man) => (
                          <option key={man.id} value={man.id}>
                            {man.name} - {man.status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
            <div style={styles.emptyState}>
              <p style={styles.emptyTitle}>No requests found</p>
              <p style={styles.emptyText}>Try another search term.</p>
            </div>
          )}
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
    fontFamily: 'Inter, sans-serif',
  },
  headerCard: {
    background: 'linear-gradient(135deg, #1D5AA6 0%, #2563EB 100%)',
    borderRadius: '28px',
    padding: '28px',
    marginBottom: '22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.16)',
  },
  welcome: {
    margin: 0,
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
  },
  pageTitle: {
    margin: '8px 0',
    color: '#FFFFFF',
    fontSize: '34px',
    fontWeight: 800,
  },
  pageSubtitle: {
    margin: 0,
    color: 'rgba(255,255,255,0.88)',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '22px',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '22px',
    padding: '20px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
  },
  statLabel: {
    margin: 0,
    color: '#64748B',
    fontSize: '14px',
  },
  statValue: {
    margin: '10px 0 0',
    color: '#0F172A',
    fontSize: '30px',
    fontWeight: 800,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    padding: '22px',
    borderRadius: '24px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  title: {
    margin: 0,
    color: '#0F172A',
    fontSize: '22px',
    fontWeight: 800,
  },
  subTitle: {
    margin: '6px 0 0',
    color: '#64748B',
    fontSize: '14px',
  },
  searchWrap: {
    minWidth: '260px',
    flex: 1,
    maxWidth: '320px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: '#F8FAFC',
    boxSizing: 'border-box',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '14px 12px',
    borderBottom: '1px solid #E5E7EB',
    color: '#64748B',
    fontSize: '13px',
  },
  td: {
    padding: '14px 12px',
    borderBottom: '1px solid #F1F5F9',
    color: '#0F172A',
  },
  requestId: {
    fontWeight: 800,
    color: '#1D4ED8',
  },
  badge: {
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '12px',
  },
  assignedName: {
    fontWeight: 600,
  },
  unassigned: {
    color: '#94A3B8',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '12px',
    border: '1px solid #DDE5EE',
    backgroundColor: '#F8FAFC',
  },
  emptyState: {
    padding: '20px 0',
    textAlign: 'center',
  },
  emptyTitle: {
    margin: 0,
    fontWeight: 700,
  },
  emptyText: {
    color: '#64748B',
  },
};