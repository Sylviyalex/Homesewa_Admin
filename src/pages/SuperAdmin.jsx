import React from 'react';

export default function SuperAdmin() {
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.profileCard}>
        <div style={styles.avatar}>S</div>

        <h1 style={styles.name}>Super Admin</h1>
        <p style={styles.role}>System Administrator</p>

        <div style={styles.infoCard}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Name</span>
            <span style={styles.value}>Super Admin</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>superadmin@gmail.com</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.label}>Role</span>
            <span style={styles.value}>Full Access</span>
          </div>
        </div>

        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#FFFFFF',
    borderRadius: '28px',
    padding: '32px 24px',
    boxShadow: '0 12px 30px rgba(15,23,42,0.08)',
    border: '1px solid #E5E7EB',
    textAlign: 'center',
  },

  avatar: {
    width: '88px',
    height: '88px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #1D5AA6 0%, #2563EB 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '32px',
    fontWeight: 800,
  },

  name: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 800,
    color: '#0F172A',
  },

  role: {
    margin: '8px 0 22px',
    color: '#64748B',
    fontSize: '14px',
  },

  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '20px',
    padding: '16px',
    marginBottom: '22px',
    textAlign: 'left',
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '14px',
    padding: '12px 0',
    borderBottom: '1px solid #EAEFF5',
  },

  label: {
    color: '#64748B',
    fontSize: '14px',
  },

  value: {
    color: '#0F172A',
    fontSize: '14px',
    fontWeight: 700,
  },

  logoutButton: {
    width: '100%',
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    padding: '14px 18px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};