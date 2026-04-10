import React, { useState } from 'react';

const initialNotifications = [
  {
    id: 1,
    title: 'New booking request',
    message: 'AC service request received from Naveen',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Job assigned',
    message: 'Plumbing job assigned to Ravi Kumar',
    time: '10 min ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Payment received',
    message: 'Customer payment marked as paid successfully',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: 4,
    title: 'Service completed',
    message: 'Cleaning service marked as completed',
    time: 'Yesterday',
    unread: false,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map((item) => ({
      ...item,
      unread: false,
    }));
    setNotifications(updated);
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div>
          <p style={styles.headerTag}>Admin Updates</p>
          <h1 style={styles.pageTitle}>Notifications</h1>
          <p style={styles.pageSubtitle}>
            Stay updated with requests, assignments, and payment activity.
          </p>
        </div>

        <button style={styles.primaryButton} onClick={handleMarkAllRead}>
          Mark All Read
        </button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Notifications</p>
          <h3 style={styles.statValue}>{notifications.length}</h3>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Unread</p>
          <h3 style={styles.statValue}>{unreadCount}</h3>
        </div>
      </div>

      <div style={styles.listCard}>
        <h3 style={styles.sectionTitle}>Recent Notifications</h3>

        {notifications.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyTitle}>No notifications available</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.notificationItem,
                backgroundColor: item.unread ? '#F8FBFF' : '#FFFFFF',
                borderLeft: item.unread ? '4px solid #2563EB' : '4px solid transparent',
              }}
            >
              <div style={styles.notificationTop}>
                <div>
                  <p style={styles.notificationTitle}>{item.title}</p>
                  <p style={styles.notificationMessage}>{item.message}</p>
                </div>

                {item.unread && <span style={styles.unreadBadge}>New</span>}
              </div>

              <p style={styles.notificationTime}>{item.time}</p>
            </div>
          ))
        )}
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

  headerTag: {
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

  primaryButton: {
    backgroundColor: '#FFFFFF',
    color: '#1D4ED8',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 18px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  statsRow: {
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

  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '22px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
  },

  sectionTitle: {
    margin: '0 0 16px',
    color: '#0F172A',
    fontSize: '22px',
    fontWeight: 800,
  },

  notificationItem: {
    borderRadius: '18px',
    padding: '16px',
    border: '1px solid #EAEFF5',
    marginBottom: '14px',
  },

  notificationTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },

  notificationTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#0F172A',
  },

  notificationMessage: {
    margin: '6px 0 0',
    color: '#475569',
    fontSize: '14px',
    lineHeight: 1.6,
  },

  notificationTime: {
    margin: '10px 0 0',
    color: '#94A3B8',
    fontSize: '12px',
  },

  unreadBadge: {
    backgroundColor: '#EAF2FF',
    color: '#2563EB',
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },

  emptyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
  },

  emptyTitle: {
    margin: 0,
    color: '#64748B',
    fontSize: '14px',
  },
};