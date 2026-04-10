import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function UserDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state?.user;

  const printRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState('');

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>User not found</h2>
          <button style={styles.backButton} onClick={() => navigate('/users')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const generatePdfBlob = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);

    const margin = 8;
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight - margin * 2;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - margin * 2;
    }

    return pdf.output('blob');
  };

  const handleDisplayPdf = async () => {
    const blob = await generatePdfBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const handleDownloadPdf = async () => {
    const blob = await generatePdfBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.name || 'user'}-issue-details.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backButton} onClick={() => navigate('/users')}>
          ← Back
        </button>

        <div style={styles.buttonRow}>
          <button style={styles.primaryButton} onClick={handleDisplayPdf}>
            Display PDF
          </button>
          <button style={styles.downloadButton} onClick={handleDownloadPdf}>
            Download PDF
          </button>
        </div>
      </div>

      <div ref={printRef} style={styles.card}>
        <h1 style={styles.title}>User Issue Details</h1>

        <div style={styles.headerSection}>
          <div>
            <h2 style={styles.userName}>{user.name || '-'}</h2>
            <p style={styles.userSub}>Customer complaint and issue information</p>
          </div>
        </div>

        <div style={styles.issueImageSection}>
          <h3 style={styles.sectionTitle}>Issue Image</h3>

          <div style={styles.issueImageWrap}>
            {user.issueImage ? (
              <img
                src={user.issueImage}
                alt="Issue"
                style={styles.issueImage}
              />
            ) : user.image ? (
              <img
                src={user.image}
                alt="Issue"
                style={styles.issueImage}
              />
            ) : (
              <div style={styles.noImage}>No Issue Image</div>
            )}
          </div>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoBox}>
            <span style={styles.label}>User ID</span>
            <span style={styles.value}>{user.id || '-'}</span>
          </div>

          <div style={styles.infoBox}>
            <span style={styles.label}>Phone</span>
            <span style={styles.value}>{user.phone || '-'}</span>
          </div>

          <div style={styles.infoBox}>
            <span style={styles.label}>Location</span>
            <span style={styles.value}>{user.location || '-'}</span>
          </div>

          <div style={styles.infoBox}>
            <span style={styles.label}>Issue</span>
            <span style={styles.value}>{user.issue || '-'}</span>
          </div>

          <div style={styles.infoBox}>
            <span style={styles.label}>Total Bookings</span>
            <span style={styles.value}>{user.totalBookings || 0}</span>
          </div>

          <div style={styles.infoBox}>
            <span style={styles.label}>Status</span>
            <span style={styles.value}>{user.status || '-'}</span>
          </div>
        </div>
      </div>

      {pdfUrl && (
        <div style={styles.pdfCard}>
          <h3 style={styles.pdfTitle}>PDF Preview</h3>
          <iframe
            src={pdfUrl}
            title="User PDF Preview"
            width="100%"
            height="700"
            style={styles.iframe}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#F4F7FB',
    padding: '24px',
    fontFamily: 'Inter, sans-serif',
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },

  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  backButton: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#0F172A',
    borderRadius: '10px',
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  primaryButton: {
    backgroundColor: '#1D5AA6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  downloadButton: {
    backgroundColor: '#16A34A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    border: '1px solid #E5E7EB',
  },

  title: {
    marginTop: 0,
    marginBottom: '24px',
    color: '#0F172A',
    fontSize: '28px',
    fontWeight: 800,
  },

  headerSection: {
    marginBottom: '24px',
  },

  userName: {
    margin: 0,
    color: '#0F172A',
    fontSize: '30px',
    fontWeight: 800,
  },

  userSub: {
    margin: '8px 0 0',
    color: '#64748B',
    fontSize: '15px',
  },

  issueImageSection: {
    marginBottom: '28px',
  },

  sectionTitle: {
    margin: '0 0 14px',
    color: '#0F172A',
    fontSize: '20px',
    fontWeight: 700,
  },

  issueImageWrap: {
    width: '100%',
    maxWidth: '420px',
  },

  issueImage: {
    width: '100%',
    maxWidth: '420px',
    height: '320px',
    objectFit: 'cover',
    borderRadius: '20px',
    border: '4px solid #E2E8F0',
    boxShadow: '0 10px 25px rgba(15,23,42,0.15)',
    display: 'block',
  },

  noImage: {
    width: '100%',
    maxWidth: '420px',
    height: '320px',
    borderRadius: '20px',
    border: '2px dashed #CBD5E1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    fontWeight: 600,
    backgroundColor: '#F8FAFC',
    fontSize: '18px',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },

  infoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
    padding: '16px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: 600,
  },

  value: {
    fontSize: '16px',
    color: '#0F172A',
    fontWeight: 700,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },

  pdfCard: {
    marginTop: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.05)',
    border: '1px solid #E5E7EB',
  },

  pdfTitle: {
    marginTop: 0,
    marginBottom: '16px',
    color: '#0F172A',
  },

  iframe: {
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
  },
};