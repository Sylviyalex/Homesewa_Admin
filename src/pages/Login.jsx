import React, { useState } from 'react';
import { loginAdmin, setAuthToken } from '../api/adminApi';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const res = await loginAdmin({ email, password });

      console.log('LOGIN RESPONSE:', res.data);

      const token = res.data?.data?.accessToken;
      const user = res.data?.data?.user;

      if (!token) {
        throw new Error('Access token missing');
      }

      if (user?.role !== 'ADMIN') {
        alert('Only admin can log in here');
        return;
      }

      setAuthToken(token);
      onLogin?.(user, token);
    } catch (err) {
      console.log('LOGIN ERROR:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>Sign in to manage home service requests</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#F5F7FA',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    width: '400px',
    background: '#FFFFFF',
    padding: '28px',
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  },
  title: {
    margin: 0,
    color: '#1E1E1E',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: '8px',
    marginBottom: '20px',
  },
  group: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    background: '#1D5AA6',
    color: '#FFFFFF',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};