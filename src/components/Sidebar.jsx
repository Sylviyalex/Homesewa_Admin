import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Users', path: '/users', icon: '👤' },
  { label: 'Servicemen', path: '/servicemen', icon: '🛠️' },
  { label: 'Requests', path: '/requests', icon: '📋' },
  { label: 'Payments', path: '/payments', icon: '💳' },
  { label: 'Notifications', path: '/notifications', icon: '🔔' },
  { label: 'Add Service', path: '/add-service', icon: '➕' },
  { label: 'Super Admin', path: '/super-admin', icon: '⚙️' },
];

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  

  return (
    <div style={styles.sidebar}>
      <div>
        <div style={styles.logoCard}>
          <div style={styles.logoIcon}>🏠</div>
          <div>
            <h2 style={styles.logoTitle}>Home Service</h2>
            <p style={styles.logoSubTitle}>Admin Panel</p>
          </div>
        </div>

        <div style={styles.menuSection}>
          <p style={styles.menuHeading}>MAIN MENU</p>

          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.menuItem,
                  ...(active ? styles.activeMenuItem : {}),
                }}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.adminCard}>
          <div style={styles.avatar}>S</div>
          <div>
            <p style={styles.adminName}>Super Admin</p>
            <p style={styles.adminRole}>Full Access</p>
          </div>
        </div>

        <button
          style={styles.logoutButton}
          onClick={() => {
            const confirmLogout = window.confirm('Are you sure you want to logout?');
            if (confirmLogout) {
              onLogout();           // ✅ IMPORTANT
              navigate('/login');
            }
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '270px',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    padding: '20px 16px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '4px 0 18px rgba(15,23,42,0.04)',
  },

  logoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #1D5AA6 0%, #2563EB 100%)',
    marginBottom: '24px',
  },

  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  },

  logoTitle: {
    margin: 0,
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: 800,
  },

  logoSubTitle: {
    margin: '4px 0 0',
    color: 'rgba(255,255,255,0.82)',
    fontSize: '12px',
  },

  menuSection: {
    marginTop: '8px',
  },

  menuHeading: {
    margin: '0 0 12px 10px',
    color: '#94A3B8',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.08em',
  },

  menuItem: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 14px',
    borderRadius: '14px',
    marginBottom: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },

  activeMenuItem: {
    backgroundColor: '#EAF2FF',
    color: '#1D4ED8',
    boxShadow: 'inset 0 0 0 1px #D7E5FF',
  },

  menuIcon: {
    width: '20px',
    textAlign: 'center',
    fontSize: '16px',
  },

  bottomSection: {
    marginTop: '24px',
  },

  adminCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '16px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    marginBottom: '12px',
  },

  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #1D5AA6 0%, #2563EB 100%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '16px',
    flexShrink: 0,
  },

  adminName: {
    margin: 0,
    color: '#0F172A',
    fontSize: '14px',
    fontWeight: 700,
  },

  adminRole: {
    margin: '4px 0 0',
    color: '#64748B',
    fontSize: '12px',
  },

  logoutButton: {
    width: '100%',
    border: 'none',
    backgroundColor: '#FFF1F2',
    color: '#DC2626',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 14px',
    borderRadius: '14px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    textAlign: 'left',
  },
};