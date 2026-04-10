import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function MainLayout({ onLogout }) {
  return (
    <div style={styles.container}>
      <Sidebar onLogout={onLogout} />

      <div style={styles.main}>
        <Header onLogout={onLogout} />
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F4F7FB',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: '20px',
    flex: 1,
    overflowY: 'auto',
  },
};