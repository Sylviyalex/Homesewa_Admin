import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api/adminApi';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDashboard();
        setStats(res.data?.data || null);
      } catch (err) {
        console.error(err);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      title: 'Total Requests',
      value: stats?.totalBookings ?? 0,
      icon: '📩',
      color: 'linear-gradient(135deg, #79DCC8 0%, #92E3C5 45%, #A8E5F2 100%)',
      valueColor: '#FFFFFF',
      titleColor: 'rgba(255,255,255,0.92)',
      iconBg: 'rgba(255,255,255,0.22)',
    },
    {
      title: 'Active Jobs',
      value: (stats?.assignedBookings ?? 0) + (stats?.inProgressBookings ?? 0),
      icon: '🛠️',
      color: '#E8EEF8',
      valueColor: '#1D5AA6',
      titleColor: '#6B7280',
      iconBg: '#F3F6FB',
    },
    {
      title: 'Completed Jobs',
      value: stats?.completedBookings ?? 0,
      icon: '✅',
      color: '#DDF4E9',
      valueColor: '#2ECC84',
      titleColor: '#6B7280',
      iconBg: '#EDF9F2',
    },
    {
      title: 'Pending Payments',
      value: stats?.pendingPayments ?? 0,
      icon: '💳',
      color: '#E8EEF8',
      valueColor: '#1D5AA6',
      titleColor: '#6B7280',
      iconBg: '#F3F6FB',
    },
  ];

  const activities = (stats?.recentBookings || []).map((item) => {
    const serviceName = item.service?.serviceName || 'Service';
    return `${serviceName} request received from ${item.name}`;
  });

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div>
          <p style={styles.welcome}>Welcome back</p>
          <h1 style={styles.pageTitle}>Admin Dashboard</h1>
          <p style={styles.pageSubTitle}>
            Monitor requests, jobs, payments, and daily service activity.
          </p>
        </div>
      </div>

      <div style={styles.walletCard}>
        <div>
          <p style={styles.walletLabel}>Today&apos;s dashboard overview</p>
          <h2 style={styles.walletValue}>
            {(stats?.totalBookings ?? 0) + (stats?.completedBookings ?? 0)}
          </h2>
        </div>

        <button style={styles.walletButton}>View Summary</button>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              ...styles.card,
              background: card.color,
              border: card.title === 'Total Requests' ? 'none' : '1px solid #E7EDF2',
            }}
          >
            <div style={{ ...styles.iconBox, background: card.iconBg }}>
              <span style={styles.icon}>{card.icon}</span>
            </div>

            <div>
              <p style={{ ...styles.cardTitle, color: card.titleColor }}>
                {card.title}
              </p>
              <h2 style={{ ...styles.cardValue, color: card.valueColor }}>
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.bottomGrid}>
        <div style={styles.largeCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Recent Activity</h3>
            <button style={styles.viewAll}>View All</button>
          </div>

          <div style={styles.activityList}>
            {activities.length === 0 ? (
              <p style={styles.emptyText}>No activity found</p>
            ) : (
              activities.map((activity, index) => (
                <div key={index} style={styles.activityItem}>
                  <div style={styles.activityDot} />
                  <div>
                    <p style={styles.activityText}>{activity}</p>
                    <p style={styles.activityTime}>Recent</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.sideCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Quick Stats</h3>
            <button style={styles.viewAll}>View All</button>
          </div>

          <button style={styles.actionButton}>
            Total Users: {stats?.totalUsers ?? 0}
          </button>
          <button style={styles.actionButton}>
            Total Services: {stats?.totalServices ?? 0}
          </button>
          <button style={styles.actionButton}>
            Total Providers: {stats?.totalServicemen ?? 0}
          </button>
          <button style={styles.actionButton}>
            Available Providers: {stats?.availableServicemen ?? 0}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#F5F7F6',
    minHeight: '100vh',
    padding: '24px',
    fontFamily: 'Inter, sans-serif',
  },

  headerCard: {
    background: '#FFFFFF',
    borderRadius: '26px',
    padding: '26px 28px',
    marginBottom: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    border: '1px solid #EDF1F4',
  },

  welcome: {
    margin: 0,
    color: '#9AA3AF',
    fontSize: '14px',
    fontWeight: 500,
  },

  pageTitle: {
    margin: '8px 0 8px',
    color: '#1E1E1E',
    fontSize: '34px',
    fontWeight: 800,
  },

  pageSubTitle: {
    margin: 0,
    color: '#6B7280',
    fontSize: '15px',
    maxWidth: '620px',
    lineHeight: 1.6,
  },

  walletCard: {
    background: 'linear-gradient(90deg, #D9F1E8 0%, #E9F4F1 100%)',
    borderRadius: '22px',
    padding: '18px 22px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    border: '1px solid #DDEFE8',
  },

  walletLabel: {
    margin: 0,
    color: '#6B7280',
    fontSize: '13px',
  },

  walletValue: {
    margin: '6px 0 0',
    color: '#1E1E1E',
    fontSize: '32px',
    fontWeight: 800,
  },

  walletButton: {
    backgroundColor: '#2ECC84',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '999px',
    padding: '12px 22px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '24px',
  },

  card: {
    padding: '22px',
    borderRadius: '22px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  iconBox: {
    width: '58px',
    height: '58px',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  icon: {
    fontSize: '26px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 500,
  },

  cardValue: {
    margin: '8px 0 0',
    fontSize: '30px',
    fontWeight: 800,
  },

  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '18px',
  },

  largeCard: {
    backgroundColor: '#FFFFFF',
    padding: '22px',
    borderRadius: '24px',
    border: '1px solid #E8EDF1',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
  },

  sideCard: {
    backgroundColor: '#FFFFFF',
    padding: '22px',
    borderRadius: '24px',
    border: '1px solid #E8EDF1',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
  },

  sectionTitle: {
    margin: 0,
    color: '#1E1E1E',
    fontSize: '20px',
    fontWeight: 800,
  },

  viewAll: {
    border: 'none',
    background: 'transparent',
    color: '#2ECC84',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '13px',
  },

  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  activityItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    paddingBottom: '12px',
    borderBottom: '1px solid #F0F3F6',
  },

  activityDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#2ECC84',
    marginTop: '6px',
  },

  activityText: {
    margin: 0,
    fontWeight: 600,
    color: '#1E1E1E',
  },

  activityTime: {
    margin: '4px 0 0',
    color: '#8C95A3',
    fontSize: '13px',
  },

  emptyText: {
    color: '#64748B',
    margin: 0,
  },

  actionButton: {
    backgroundColor: '#F7FAFA',
    color: '#1E1E1E',
    border: '1px solid #E4ECE8',
    borderRadius: '14px',
    padding: '14px 16px',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
  },
};