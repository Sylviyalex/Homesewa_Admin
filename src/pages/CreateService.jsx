import React, { useEffect, useState } from 'react';
import { createService, getServices, deleteService } from '../api/adminApi';

const API_BASE = 'http://localhost:3000';

export default function AddService() {
  const [form, setForm] = useState({
    serviceName: '',
    status: 'ACTIVE',
  });
  const [iconFile, setIconFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadServices = async () => {
    try {
      const res = await getServices();
      console.log('SERVICES API:', res);

      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setServices(list);
    } catch (err) {
      console.error(err);
      setServices([]);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setIconFile(file || null);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
    }
  };

  const resetForm = () => {
    setForm({
      serviceName: '',
      status: 'ACTIVE',
    });
    setIconFile(null);

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview('');

    const fileInput = document.getElementById('service-icon-input');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('serviceName', form.serviceName);
      formData.append('status', form.status);

      if (iconFile) {
        formData.append('icon', iconFile);
      }

      const res = await createService(formData);

      setMessage(res?.message || res?.data?.message || 'Service created successfully');
      resetForm();
      await loadServices();
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId, serviceName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${serviceName}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(serviceId);
      setMessage('');

      await deleteService(serviceId);

      setServices((prev) => prev.filter((item) => item.id !== serviceId));
      setMessage(`Service "${serviceName}" deleted successfully`);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.message || 'Failed to delete service');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <div>
          <p style={styles.welcome}>Service Management</p>
          <h1 style={styles.pageTitle}>Add Service</h1>
          <p style={styles.subtitle}>
            Create new services, upload service icons, and delete services.
          </p>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.formCard}>
          <h3 style={styles.title}>Create Service</h3>

          {message ? <div style={styles.messageBox}>{message}</div> : null}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Service Name</label>
              <input
                type="text"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                placeholder="Enter service name"
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
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Service Icon</label>
              <input
                id="service-icon-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
            </div>

            {preview ? (
              <div style={styles.previewBox}>
                <img src={preview} alt="preview" style={styles.preview} />
              </div>
            ) : null}

            <button type="submit" style={styles.createBtn} disabled={loading}>
              {loading ? 'Creating...' : 'Create Service'}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <div style={styles.topRow}>
            <h3 style={styles.title}>Services List</h3>
          </div>

          <div style={styles.servicesGrid}>
            {services.length > 0 ? (
              services.map((item) => (
                <div key={item.id} style={styles.serviceCard}>
                  <div style={styles.iconWrap}>
                    {item.icon ? (
                      <img
                        src={`${API_BASE}/uploads/services/${item.icon}`}
                        alt={item.serviceName}
                        style={styles.serviceIcon}
                      />
                    ) : (
                      <div style={styles.noIcon}>No Icon</div>
                    )}
                  </div>

                  <div style={styles.serviceInfo}>
                    <h4 style={styles.serviceName}>{item.serviceName}</h4>
                    <p style={styles.serviceMeta}>ID: {item.id}</p>
                    <p style={styles.serviceMeta}>Icon: {item.icon || 'null'}</p>

                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor:
                          item.status === 'ACTIVE' ? '#E8F8EE' : '#F1F5F9',
                        color:
                          item.status === 'ACTIVE' ? '#16A34A' : '#64748B',
                      }}
                    >
                      {item.status}
                    </span>

                    <div style={styles.actionRow}>
                      <button
                        type="button"
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(item.id, item.serviceName)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyBox}>No services found</div>
            )}
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
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)',
  },
  title: {
    margin: 0,
    marginBottom: '16px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
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
  fileInput: {
    borderRadius: '12px',
    border: '1px solid #D9E2EC',
    padding: '10px 14px',
    fontSize: '14px',
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
  previewBox: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  preview: {
    width: '90px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  serviceCard: {
    border: '1px solid #EAECEF',
    borderRadius: '18px',
    padding: '16px',
    background: '#fff',
  },
  iconWrap: {
    marginBottom: '14px',
  },
  serviceIcon: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
  },
  noIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '16px',
    background: '#F1F5F9',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid #E2E8F0',
  },
  serviceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  serviceName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#0F172A',
  },
  serviceMeta: {
    margin: 0,
    fontSize: '13px',
    color: '#64748B',
    wordBreak: 'break-word',
  },
  badge: {
    marginTop: '8px',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '12px',
    display: 'inline-block',
    alignSelf: 'flex-start',
  },
  actionRow: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  deleteBtn: {
    height: '38px',
    border: 'none',
    borderRadius: '10px',
    background: '#DC2626',
    color: '#fff',
    fontWeight: 700,
    padding: '0 14px',
    cursor: 'pointer',
  },
  emptyBox: {
    padding: '24px',
    textAlign: 'center',
    color: '#64748B',
    background: '#F8FAFC',
    borderRadius: '16px',
    border: '1px dashed #CBD5E1',
  },
};