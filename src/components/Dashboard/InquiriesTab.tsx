import React from 'react';
import { InquiryItem } from './types';
import styles from '../../Dashboard.module.css';

interface InquiriesTabProps {
  inquiries: InquiryItem[];
  handleDeleteInquiry: (inqId: string) => void;
  formatDate: (date: string) => string;
}

const InquiriesTab: React.FC<InquiriesTabProps> = ({
  inquiries,
  handleDeleteInquiry,
  formatDate,
}) => {
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <h2>Tenant Inquiries Panel</h2>
        <p>See genuine inquiry letters sent directly by prospective renters on your properties.</p>
      </div>

      {inquiries.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✉️</div>
          <h2>No Inquiries Received</h2>
          <p>No tenant inquiries received yet. When users submit contact forms on SettleKar, they'll pop up here!</p>
        </div>
      ) : (
        <div className={styles.inquiriesContainer}>
          {inquiries.map((inq: InquiryItem) => (
            <div key={inq.id} className={styles.inquiryDetailsCard}>
              <div className={styles.inquiryDetailsHead}>
                <div className={styles.inqTitle}>
                  <h3>{inq.tenantName}</h3>
                  <span>Inquired on: <strong>{inq.propertyTitle}</strong> ({inq.propertyPrice})</span>
                </div>
                <div className={styles.inqMeta}>
                  <span className={styles.inqTime}>{formatDate(inq.createdAt)}</span>
                  <button
                    className={styles.dismissInqBtn}
                    onClick={() => handleDeleteInquiry(inq.id)}
                    title="Dismiss Inquiry"
                  >
                    ✕ Dismiss
                  </button>
                </div>
              </div>
              
              <div className={styles.inquiryDetailsMsg}>
                <p>"{inq.message}"</p>
              </div>

              <div className={styles.inquiryContactStrip}>
                <h4>Contact Prospective Tenant:</h4>
                <div className={styles.contactButtons}>
                  <a href={`mailto:${inq.tenantEmail}`} className={styles.contactEmailBtn}>
                    📧 Email: {inq.tenantEmail}
                  </a>
                  <a href={`tel:${inq.tenantPhone}`} className={styles.contactPhoneBtn}>
                    📞 Call/WhatsApp: {inq.tenantPhone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesTab;
