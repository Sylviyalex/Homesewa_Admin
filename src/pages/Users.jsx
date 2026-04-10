import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../api/adminApi';

export default function Users() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter(
      (user) =>
        String(user.id).toLowerCase().includes(q) ||
        user.name?.toLowerCase().includes(q) ||
        user.phone?.toLowerCase().includes(q) ||
        (user.latestIssue || '').toLowerCase().includes(q)
    );
  }, [search, users]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const totalBookings = users.reduce((sum, u) => sum + (u.totalBookings || 0), 0);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const getStatusStyle = () => {
    return {
      backgroundColor: '#E8F8EE',
      color: '#15803D',
    };
  };

  const handleView = (user) => {
  navigate(`/user/${user.id}`, { state: { user } });
};

  const handleDownload = (user) => {
    navigate(`/user/${user.id}`, {
      state: {
        user,
        autoDownload: true,
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.headerCard}>
          <div>
            <p style={styles.welcome}>Customer Management</p>
            <h1 style={styles.pageTitle}>Users</h1>
            <p style={styles.pageSubtitle}>
              View all registered users, booking activity, issue details, and customer information.
            </p>
          </div>

          <button
            style={styles.primaryButton}
            onClick={() => navigate('/add-user')}
          >
            + Add User
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Users</p>
            <h3 style={styles.statValue}>{totalUsers}</h3>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Users</p>
            <h3 style={styles.statValue}>{activeUsers}</h3>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Bookings</p>
            <h3 style={styles.statValue}>{totalBookings}</h3>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h3 style={styles.title}>User Directory</h3>
              <p style={styles.subTitle}>Manage all customers in one place</p>
            </div>

            <div style={styles.searchWrap}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users, phone, issue..."
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>User ID</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Issue</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Bookings</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const statusStyle = getStatusStyle(user.status);

                  return (
                    <tr key={user.id}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.avatar}>{getInitials(user.name)}</div>
                          <div>
                            <div style={styles.userName}>{user.name}</div>
                            <div style={styles.userSubText}>Customer</div>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>{user.id}</td>
                      <td style={styles.td}>{user.phone}</td>
                      <td style={styles.td}>
                        <div style={styles.issueText}>{user.latestIssue || '-'}</div>
                      </td>

                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={styles.bookingBadge}>{user.totalBookings || 0}</span>
                      </td>

                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: statusStyle.backgroundColor,
                            color: statusStyle.color,
                          }}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <div style={styles.actionButtons}>
                          <button
                            style={styles.secondaryButton}
                            onClick={() => handleView(user)}
                          >
                            View
                          </button>

                          <button
                            style={styles.downloadButton}
                            onClick={() => handleDownload(user)}
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div style={styles.emptyState}>
                <p style={styles.emptyTitle}>No users found</p>
                <p style={styles.emptyText}>
                  Try another name, phone, or issue keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    backgroundColor: '#F4F7FB',
    minHeight: '100vh',
    padding: '24px',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  },
  content: {
    width: '100%',
    maxWidth: '100%',
    margin: 0,
  },
  headerCard: {
    width: '100%',
    boxSizing: 'border-box',
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
    lineHeight: 1.2,
  },
  pageSubtitle: {
    margin: 0,
    color: 'rgba(255,255,255,0.88)',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    color: '#1D4ED8',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 18px',
    fontWeight: 700,
    cursor: 'pointer',
    height: 'fit-content',
    whiteSpace: 'nowrap',
  },
  statsGrid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '22px',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '22px',
    padding: '20px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    minWidth: 0,
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
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    padding: '22px',
    borderRadius: '24px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    overflow: 'hidden',
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
    width: '100%',
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
    width: '100%',
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
  },
  userName: {
    fontWeight: 700,
  },
  userSubText: {
    color: '#64748B',
    fontSize: '13px',
  },
  issueText: {
    maxWidth: '280px',
  },
  bookingBadge: {
    display: 'inline-flex',
    minWidth: '28px',
    justifyContent: 'center',
    padding: '4px 8px',
    borderRadius: '999px',
    backgroundColor: '#EAF2FF',
    color: '#1D4ED8',
    fontWeight: 700,
  },
  statusBadge: {
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '12px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  secondaryButton: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  downloadButton: {
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
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