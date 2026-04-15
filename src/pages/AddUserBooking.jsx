import React, { useEffect, useState } from 'react';
import { createManualBooking, getBookings, getServices } from '../api/adminApi';

export default function AddUserBooking() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    address: '',
    serviceId: '',
    date: '',
    notes: '',
  });

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data || []);
    } catch (err) {
      console.error(err);
      setServices([]);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await getBookings();
      const rows = res.data?.data || [];
      setBookings(rows.slice(0, 5));
    } catch (err) {
      console.error(err);
      setBookings([]);
    }
  };

  useEffect(() => {
    loadServices();
    loadBookings();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.serviceId ||
      !form.date ||
      !form.notes.trim()
    ) {
      alert(
        'Please fill all required fields: Name, Phone, Address, Service, Preferred Date & Time, and Issue'
      );
      return;
    }

    try {
      setLoading(true);

      await createManualBooking({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        serviceId: Number(form.serviceId),

        address: [form.location.trim(), form.address.trim()]
          .filter(Boolean)
          .join(', '), // ✅ backend expects address

        scheduledAt: new Date(form.date).toISOString(),
        description: form.notes.trim(),
      });

      alert('User added and service booked successfully');

      setForm({
        name: '',
        phone: '',
        email: '',
        location: '',
        address: '',
        serviceId: '',
        date: '',
        notes: '',
      });

      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div>
          <p style={styles.welcome}>Admin Booking Panel</p>
          <h1 style={styles.pageTitle}>Add User & Book Service</h1>
          <p style={styles.pageSubtitle}>
            Use this when a customer calls directly and admin needs to create the booking manually.
          </p>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.formCard}>
          <h3 style={styles.sectionTitle}>Customer Details</h3>

          <form onSubmit={handleSubmit}>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Customer Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter customer name"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Phone Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Location / Area</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Enter area/location"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Full Address <span style={styles.required}>*</span>
              </label>
              <textarea
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter full address"
                style={styles.textarea}
                required
              />
            </div>

            <h3 style={{ ...styles.sectionTitle, marginTop: '20px' }}>Booking Details</h3>

            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Service Type <span style={styles.required}>*</span>
                </label>
                <select
                  value={form.serviceId}
                  onChange={(e) => handleChange('serviceId', e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">Select service</option>
                  {services.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.serviceName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Preferred Date & Time <span style={styles.required}>*</span>
                </label>
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Issue / Problem Description <span style={styles.required}>*</span>
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Enter issue details"
                style={styles.textarea}
                required
              />
            </div>

            <button type="submit" style={styles.primaryButton} disabled={loading}>
              {loading ? 'Creating...' : 'Add User & Create Booking'}
            </button>
          </form>
        </div>

        <div style={styles.sideCard}>
          <h3 style={styles.sectionTitle}>Recent Manual Bookings</h3>

          {bookings.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyTitle}>No manual bookings yet</p>
              <p style={styles.emptyText}>
                New admin-created bookings will appear here.
              </p>
            </div>
          ) : (
            bookings.map((item) => (
              <div key={item.id} style={styles.bookingCard}>
                <div style={styles.bookingTop}>
                  <span style={styles.requestId}>{item.bookingCode}</span>
                  <span style={styles.statusBadge}>{item.status}</span>
                </div>

                <p style={styles.bookingName}>{item.name}</p>
                <p style={styles.bookingInfo}>📞 {item.phone}</p>
                <p style={styles.bookingInfo}>🛠 {item.service?.serviceName}</p>
                <p style={styles.bookingInfo}>📍 {item.customAddress || '-'}</p>
                {item.scheduledAt ? (
                  <p style={styles.bookingInfo}>
                    📅 {new Date(item.scheduledAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            ))
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
    marginBottom: '24px',
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.16)',
  },
  welcome: {
    margin: 0,
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
  },
  pageTitle: {
    margin: '8px 0',
    color: '#fff',
    fontSize: '34px',
    fontWeight: 800,
  },
  pageSubtitle: {
    margin: 0,
    color: 'rgba(255,255,255,0.88)',
    fontSize: '15px',
    lineHeight: 1.6,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '22px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
  },
  sideCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '22px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    height: 'fit-content',
  },
  sectionTitle: {
    margin: '0 0 16px',
    color: '#0F172A',
    fontSize: '20px',
    fontWeight: 800,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#334155',
  },
  required: {
    color: '#DC2626',
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
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #DDE5EE',
    backgroundColor: '#F8FAFC',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    minHeight: '110px',
    padding: '12px 14px',
    borderRadius: '14px',
    border: '1px solid #DDE5EE',
    backgroundColor: '#F8FAFC',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
  },
  primaryButton: {
    backgroundColor: '#1D5AA6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 18px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  emptyBox: {
    padding: '20px',
    borderRadius: '16px',
    background: '#F8FAFC',
    border: '1px dashed #CBD5E1',
  },
  emptyTitle: {
    margin: 0,
    fontWeight: 700,
  },
  emptyText: {
    marginTop: '8px',
    color: '#64748B',
  },
  bookingCard: {
    border: '1px solid #E5E7EB',
    borderRadius: '16px',
    padding: '14px',
    marginBottom: '12px',
  },
  bookingTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  requestId: {
    fontWeight: 800,
    color: '#1D4ED8',
  },
  statusBadge: {
    background: '#EAF2FF',
    color: '#1D4ED8',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
  },
  bookingName: {
    margin: 0,
    fontWeight: 700,
    color: '#0F172A',
  },
  bookingInfo: {
    margin: '8px 0 0',
    color: '#475569',
    fontSize: '14px',
  },
};