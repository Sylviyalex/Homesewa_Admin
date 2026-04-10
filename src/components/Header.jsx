import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const notificationsData = [
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
    message: 'Customer payment marked as paid',
    time: '1 hour ago',
    unread: false,
  },
];

export default function Header({ onLogout }) {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleMarkAllRead = () => {
    const updated = notifications.map((item) => ({
      ...item,
      unread: false,
    }));
    setNotifications(updated);
  };

  const handleOpenNotifications = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };

  const handleOpenSuperAdmin = () => {
    setShowProfileMenu(false);
    navigate('/super-admin');
  };



  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <h1 style={styles.title}>Home Service Admin</h1>
        <p style={styles.subTitle}>Manage requests, assignments and payments</p>
      </div>

      <div style={styles.right}>
        <input
          type="text"
          placeholder="Search..."
          style={styles.search}
        />

        <div style={styles.dropdownWrap} ref={notificationRef}>
          <button
            style={styles.notificationButton}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
          >
            <span style={styles.icon}>🔔</span>
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div>
                  <p style={styles.dropdownTitle}>Notifications</p>
                  <p style={styles.dropdownSubTitle}>
                    {unreadCount} unread updates
                  </p>
                </div>

                <button style={styles.linkButton} onClick={handleMarkAllRead}>
                  Mark all read
                </button>
              </div>

              <div style={styles.notificationList}>
                {notifications.length === 0 ? (
                  <div style={styles.emptyState}>No notifications</div>
                ) : (
                  notifications.map((item) => (
                    <div key={item.id} style={styles.notificationItem}>
                      <div style={styles.notificationTop}>
                        <p style={styles.notificationTitle}>{item.title}</p>
                        {item.unread && <span style={styles.unreadDot} />}
                      </div>
                      <p style={styles.notificationMessage}>{item.message}</p>
                      <p style={styles.notificationTime}>{item.time}</p>
                    </div>
                  ))
                )}
              </div>

              <button style={styles.viewAllButton} onClick={handleOpenNotifications}>
                View All Notifications
              </button>
            </div>
          )}
        </div>

        <div style={styles.dropdownWrap} ref={profileRef}>
          <button
            style={styles.profileButton}
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div style={styles.avatar}>S</div>
            <div style={styles.profileTextWrap}>
              <p style={styles.name}>Super Admin</p>
              <p style={styles.role}>Full Access</p>
            </div>
            <span style={styles.chevron}>▾</span>
          </button>

          {showProfileMenu && (
            <div style={styles.profileDropdown}>
              <button style={styles.menuItem} onClick={handleOpenSuperAdmin}>
                <span style={styles.menuIcon}>👤</span>
                Super Admin
              </button>

              <button
                style={styles.menuItem}
                onClick={() => {
                  const confirmLogout = window.confirm('Are you sure you want to logout?');
                  if (confirmLogout) {
                    onLogout();        // ✅ IMPORTANT
                    navigate('/login');
                  }
                }}
              >
                <span style={styles.menuIcon}>🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1D5AA6, #2563EB)',
    padding: '18px 24px',
    borderRadius: '20px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(37,99,235,0.2)',
    flexWrap: 'wrap',
    gap: '16px',
    position: 'relative',
  },

  left: {},

  title: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 800,
  },

  subTitle: {
    margin: '6px 0 0',
    opacity: 0.85,
    fontSize: '14px',
  },

  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },

  search: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    width: '220px',
  },

  dropdownWrap: {
    position: 'relative',
  },

  notificationButton: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.18)',
    border: 'none',
    borderRadius: '14px',
    width: '44px',
    height: '44px',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '16px',
  },

  icon: {
    fontSize: '18px',
  },

  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    minWidth: '20px',
    height: '20px',
    borderRadius: '999px',
    backgroundColor: '#EF4444',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
    boxSizing: 'border-box',
  },

  dropdown: {
    position: 'absolute',
    top: '54px',
    right: 0,
    width: '340px',
    backgroundColor: '#fff',
    borderRadius: '18px',
    boxShadow: '0 18px 40px rgba(15,23,42,0.16)',
    border: '1px solid #E5E7EB',
    zIndex: 1000,
    overflow: 'hidden',
  },

  dropdownHeader: {
    padding: '16px',
    borderBottom: '1px solid #EEF2F7',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },

  dropdownTitle: {
    margin: 0,
    color: '#0F172A',
    fontSize: '16px',
    fontWeight: 800,
  },

  dropdownSubTitle: {
    margin: '4px 0 0',
    color: '#64748B',
    fontSize: '12px',
  },

  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#2563EB',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '12px',
  },

  notificationList: {
    maxHeight: '320px',
    overflowY: 'auto',
  },

  notificationItem: {
    padding: '14px 16px',
    borderBottom: '1px solid #F1F5F9',
  },

  notificationTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },

  notificationTitle: {
    margin: 0,
    color: '#0F172A',
    fontSize: '14px',
    fontWeight: 700,
  },

  unreadDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#2563EB',
    flexShrink: 0,
  },

  notificationMessage: {
    margin: '6px 0 0',
    color: '#475569',
    fontSize: '13px',
    lineHeight: 1.5,
  },

  notificationTime: {
    margin: '8px 0 0',
    color: '#94A3B8',
    fontSize: '12px',
  },

  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: '#64748B',
    fontSize: '14px',
  },

  viewAllButton: {
    width: '100%',
    border: 'none',
    backgroundColor: '#F8FAFC',
    color: '#1D4ED8',
    fontWeight: 700,
    cursor: 'pointer',
    padding: '14px 16px',
    fontSize: '14px',
  },

  profileButton: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    border: 'none',
    borderRadius: '14px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    color: '#fff',
  },

  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    color: '#1D4ED8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    flexShrink: 0,
  },

  profileTextWrap: {
    textAlign: 'left',
  },

  name: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
  },

  role: {
    margin: '2px 0 0',
    fontSize: '12px',
    opacity: 0.8,
    color: '#fff',
  },

  chevron: {
    fontSize: '12px',
    opacity: 0.9,
  },

  profileDropdown: {
    position: 'absolute',
    top: '54px',
    right: 0,
    width: '220px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 18px 40px rgba(15,23,42,0.16)',
    border: '1px solid #E5E7EB',
    zIndex: 1000,
    overflow: 'hidden',
  },

  menuItem: {
    width: '100%',
    backgroundColor: '#fff',
    border: 'none',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    color: '#0F172A',
    fontSize: '14px',
    fontWeight: 600,
    borderBottom: '1px solid #F1F5F9',
    textAlign: 'left',
  },

  menuIcon: {
    width: '20px',
    textAlign: 'center',
  },
};