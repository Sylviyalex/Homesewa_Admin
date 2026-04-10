import React, { useEffect, useMemo, useState } from 'react';
import { createPaymentRequest, getPayments, markPaymentPaid } from '../api/adminApi';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestId, setRequestId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadPayments = async () => {
  try {
    setLoading(true);

    const res = await getPayments();

    console.log('PAYMENTS API RESPONSE:', JSON.stringify(res, null, 2));

    setPayments(res?.data?.payments || []);
    setPendingRequests(res?.data?.pendingRequests || []);
  } catch (error) {
    console.error('Failed to load payments:', error);
    alert(error?.response?.data?.message || 'Failed to load payments');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadPayments();
  }, []);

  const handleSend = async (bookingCodeFromCard) => {
    const finalRequestId = bookingCodeFromCard || requestId.trim();

    if (!finalRequestId || !amount.trim()) {
      alert('Please enter Request ID and Amount');
      return;
    }

    if (Number(amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    try {
      setSending(true);

      await createPaymentRequest({
        requestId: finalRequestId,
        amount: Number(amount),
      });

      setRequestId('');
      setAmount('');
      await loadPayments();
      alert('Payment request sent successfully');
    } catch (error) {
      console.error('Failed to send payment request:', error);
      alert(error?.response?.data?.message || 'Failed to send payment request');
    } finally {
      setSending(false);
    }
  };

  const handlePaid = async (id) => {
    try {
      await markPaymentPaid(id);
      await loadPayments();
      alert('Payment marked as paid');
    } catch (error) {
      console.error('Failed to update payment:', error);
      alert(error?.response?.data?.message || 'Failed to mark payment as paid');
    }
  };

  const stats = useMemo(() => {
    const total = payments.length;
    const pending = payments.filter((p) => p.status === 'PENDING').length;
    const paid = payments.filter((p) => p.status === 'PAID').length;
    const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return { total, pending, paid, totalAmount };
  }, [payments]);

  const getStatusStyle = (status) => {
    if (status === 'PAID') {
      return {
        backgroundColor: '#E8F8EE',
        color: '#16A34A',
        border: '1px solid #BBF7D0',
      };
    }

    return {
      backgroundColor: '#FFF7ED',
      color: '#EA580C',
      border: '1px solid #FED7AA',
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div style={styles.headerContent}>
          <div>
            <p style={styles.headerTag}>Finance Management</p>
            <h1 style={styles.pageTitle}>Payments</h1>
            <p style={styles.pageSubtitle}>
              Completed bookings will appear below. Only after admin sends payment request,
              the user app Pay Now button should become active.
            </p>
          </div>

          <div style={styles.headerMiniStats}>
            <div style={styles.headerMiniCard}>
              <span style={styles.headerMiniLabel}>Pending Requests</span>
              <span style={styles.headerMiniValue}>{pendingRequests.length}</span>
            </div>
            <div style={styles.headerMiniCard}>
              <span style={styles.headerMiniLabel}>Pending Payments</span>
              <span style={styles.headerMiniValue}>{stats.pending}</span>
            </div>
            <div style={styles.headerMiniCard}>
              <span style={styles.headerMiniLabel}>Paid</span>
              <span style={styles.headerMiniValue}>{stats.paid}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconBlue}>₹</div>
          <div>
            <p style={styles.statLabel}>Total Payments</p>
            <h3 style={styles.statValue}>{stats.total}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconOrange}>!</div>
          <div>
            <p style={styles.statLabel}>Pending Payments</p>
            <h3 style={styles.statValue}>{stats.pending}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconGreen}>✓</div>
          <div>
            <p style={styles.statLabel}>Paid</p>
            <h3 style={styles.statValue}>{stats.paid}</h3>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconPurple}>⌛</div>
          <div>
            <p style={styles.statLabel}>Waiting for Admin Request</p>
            <h3 style={styles.statValue}>{pendingRequests.length}</h3>
          </div>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.formCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.sectionTitle}>Create Payment Request</h3>
            <p style={styles.sectionSubTitle}>
              You can enter a request ID manually or click from the pending booking cards below.
            </p>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Request ID</label>
              <input
                style={styles.input}
                placeholder="Enter Request ID"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Amount</label>
              <input
                style={styles.input}
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="0"
              />
            </div>
          </div>

          <button
            style={{
              ...styles.primaryButton,
              opacity: sending ? 0.7 : 1,
              cursor: sending ? 'not-allowed' : 'pointer',
            }}
            onClick={() => handleSend()}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Payment Request'}
          </button>
        </div>

        <div style={styles.sideCard}>
          <h3 style={styles.sectionTitle}>Quick Summary</h3>

          <div style={styles.summaryBoxBlue}>
            <p style={styles.summaryLabel}>Completed / Waiting for Request</p>
            <p style={styles.summaryValue}>{pendingRequests.length}</p>
          </div>

          <div style={styles.summaryBoxGreen}>
            <p style={styles.summaryLabel}>Completed Payments</p>
            <p style={styles.summaryValue}>{stats.paid}</p>
          </div>

          <div style={styles.summaryBoxPurple}>
            <p style={styles.summaryLabel}>Total Requested Amount</p>
            <p style={styles.summaryValue}>₹{stats.totalAmount}</p>
          </div>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Pending Payment Requests</h3>
            <p style={styles.sectionSubTitle}>
              These are completed jobs. User cannot pay until admin sends amount.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Loading pending requests...</p>
          </div>
        ) : pendingRequests.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No completed bookings waiting for payment request</p>
          </div>
        ) : (
          <div style={styles.cardsGrid}>
            {pendingRequests.map((b) => (
              <div key={b.id} style={styles.paymentCard}>
                <div style={styles.paymentTop}>
                  <span style={styles.bookingCode}>{b.bookingCode}</span>
                  <span style={styles.pendingBadge}>COMPLETED</span>
                </div>

                <h4 style={styles.customerName}>
                  {b.name || b.user?.name || 'Unknown Customer'}
                </h4>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Service</span>
                  <span style={styles.infoValue}>{b.service?.serviceName || '-'}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Phone</span>
                  <span style={styles.infoValue}>{b.phone || b.user?.phone || '-'}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Address</span>
                  <span style={styles.infoValue}>{b.customAddress || b.address?.fullAddress || '-'}</span>
                </div>

                <button
                  style={styles.primaryButton}
                  onClick={() => {
                    setRequestId(b.bookingCode);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Use This Request ID
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.sectionTitle}>Payment Requests</h3>
            <p style={styles.sectionSubTitle}>
              Track all payment requests and statuses
            </p>
          </div>
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No payments found</p>
            <p style={styles.emptyText}>Created payment requests will appear here.</p>
          </div>
        ) : (
          <div style={styles.cardsGrid}>
            {payments.map((p) => {
              const statusStyle = getStatusStyle(p.status);

              return (
                <div key={p.id} style={styles.paymentCard}>
                  <div style={styles.paymentTop}>
                    <span style={styles.bookingCode}>
                      {p.booking?.bookingCode || 'No Code'}
                    </span>

                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: statusStyle.backgroundColor,
                        color: statusStyle.color,
                        border: statusStyle.border,
                      }}
                    >
                      {p.status}
                    </span>
                  </div>

                  <h4 style={styles.customerName}>
                    {p.booking?.name || p.booking?.user?.name || 'Unknown Customer'}
                  </h4>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Amount</span>
                    <span style={styles.amountText}>₹{p.amount}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Request ID</span>
                    <span style={styles.infoValue}>{p.booking?.bookingCode || '-'}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Service</span>
                    <span style={styles.infoValue}>
                      {p.booking?.service?.serviceName || '-'}
                    </span>
                  </div>

                  {p.status === 'PENDING' ? (
                    <button
                      style={styles.successButton}
                      onClick={() => handlePaid(p.id)}
                    >
                      Mark as Paid
                    </button>
                  ) : (
                    <button style={styles.paidButton} disabled>
                      Payment Completed
                    </button>
                  )}
                </div>
              );
            })}
          </div>
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
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.16)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
  },
  headerTag: {
    margin: 0,
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    fontWeight: 600,
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
    maxWidth: '700px',
  },
  headerMiniStats: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  headerMiniCard: {
    minWidth: '120px',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: '18px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
  },
  headerMiniLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.72)',
    marginBottom: '6px',
  },
  headerMiniValue: {
    color: '#fff',
    fontWeight: 800,
    fontSize: '22px',
  },

  statsGrid: {
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
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  statIconBlue: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: '#EAF2FF',
    color: '#1D4ED8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
  },
  statIconOrange: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: '#FFF7ED',
    color: '#EA580C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
  },
  statIconGreen: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: '#E8F8EE',
    color: '#16A34A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
  },
  statIconPurple: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    backgroundColor: '#F3E8FF',
    color: '#7C3AED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
  },
  statLabel: {
    margin: 0,
    color: '#64748B',
    fontSize: '14px',
  },
  statValue: {
    margin: '8px 0 0',
    color: '#0F172A',
    fontSize: '28px',
    fontWeight: 800,
  },

  layout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
    marginBottom: '22px',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '22px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
  },
  sideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '22px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    height: 'fit-content',
  },
  cardHeader: {
    marginBottom: '18px',
  },
  sectionTitle: {
    margin: 0,
    color: '#0F172A',
    fontSize: '22px',
    fontWeight: 800,
  },
  sectionSubTitle: {
    margin: '8px 0 0',
    color: '#64748B',
    fontSize: '14px',
    lineHeight: 1.5,
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  field: {
    marginBottom: '4px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #DDE5EE',
    backgroundColor: '#F8FAFC',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },

  primaryButton: {
    backgroundColor: '#1D5AA6',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    padding: '14px 18px',
    fontWeight: 700,
    fontSize: '15px',
    width: '100%',
    cursor: 'pointer',
  },

  summaryBoxBlue: {
    backgroundColor: '#EFF6FF',
    border: '1px solid #DBEAFE',
    borderRadius: '18px',
    padding: '16px',
    marginBottom: '12px',
  },
  summaryBoxGreen: {
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '18px',
    padding: '16px',
    marginBottom: '12px',
  },
  summaryBoxPurple: {
    backgroundColor: '#FAF5FF',
    border: '1px solid #E9D5FF',
    borderRadius: '18px',
    padding: '16px',
    marginBottom: '12px',
  },
  summaryLabel: {
    margin: 0,
    color: '#64748B',
    fontSize: '14px',
  },
  summaryValue: {
    margin: '8px 0 0',
    color: '#0F172A',
    fontSize: '28px',
    fontWeight: 800,
  },

  tableCard: {
    backgroundColor: '#FFFFFF',
    padding: '22px',
    borderRadius: '24px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    marginBottom: '22px',
  },
  tableHeader: {
    marginBottom: '18px',
  },

  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },

  paymentCard: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '20px',
    padding: '18px',
  },
  paymentTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  bookingCode: {
    backgroundColor: '#EAF2FF',
    color: '#1D4ED8',
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 700,
  },
  pendingBadge: {
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 700,
    backgroundColor: '#ECFDF5',
    color: '#059669',
    border: '1px solid #A7F3D0',
  },
  statusBadge: {
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 700,
  },
  customerName: {
    margin: '0 0 14px',
    color: '#0F172A',
    fontSize: '18px',
    fontWeight: 700,
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '12px',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: '14px',
  },
  infoValue: {
    color: '#0F172A',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'right',
  },
  amountText: {
    color: '#1D4ED8',
    fontSize: '20px',
    fontWeight: 800,
  },

  successButton: {
    width: '100%',
    marginTop: '10px',
    backgroundColor: '#16A34A',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  paidButton: {
    width: '100%',
    marginTop: '10px',
    backgroundColor: '#E2E8F0',
    color: '#475569',
    border: 'none',
    borderRadius: '14px',
    padding: '12px 14px',
    fontWeight: 700,
    cursor: 'not-allowed',
  },

  emptyState: {
    textAlign: 'center',
    padding: '28px 0 8px',
  },
  emptyTitle: {
    margin: 0,
    color: '#0F172A',
    fontSize: '16px',
    fontWeight: 700,
  },
  emptyText: {
    margin: '6px 0 0',
    color: '#64748B',
    fontSize: '14px',
  },
};