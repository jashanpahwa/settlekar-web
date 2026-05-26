import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './InquiryModal.module.css';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string | number;
  propertyTitle: string;
  propertyPrice: string;
  ownerId?: string;
  ownerName?: string;
  onSubmitSuccess?: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  propertyPrice,
  ownerId,
  ownerName,
  onSubmitSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`Hi, I'm interested in your "${propertyTitle}" listed at {propertyPrice}. Please let me know when we can schedule a visit.`);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        propertyId,
        propertyTitle,
        propertyPrice,
        ownerId: ownerId || 'admin_mock',
        ownerName: ownerName || 'Verified Owner',
        inquirerId: 'web_guest',
        inquirerName: name.trim(),
        inquirerEmail: email.trim(),
        inquirerPhone: phone.trim(),
        tenantName: name.trim(), // Match backward compatibility key used in web dashboard
        tenantEmail: email.trim(),
        tenantPhone: phone.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add to Firestore inquiries collection
      await addDoc(collection(db, 'inquiries'), payload);

      setSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error('Error writing inquiry to Firestore:', err);
      setError('Failed to send inquiry. Please check your internet connection.');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          ✕
        </button>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 id="modal-title" className={styles.title}>Send Inquiry</h2>
            <p className={styles.subtitle}>
              Interested in <strong>{propertyTitle}</strong>? Leave your details below and the owner will get in touch with you.
            </p>
            
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="tenant-name">Full Name *</label>
              <input
                id="tenant-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="tenant-email">Email Address *</label>
              <input
                id="tenant-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="tenant-phone">Phone Number *</label>
              <input
                id="tenant-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="tenant-message">Custom Message</label>
              <textarea
                id="tenant-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your custom message here..."
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h2>Inquiry Sent Successfully!</h2>
            <p>
              Your inquiry for <strong>{propertyTitle}</strong> has been successfully submitted to the landlord.
            </p>
            <p className={styles.successNote}>
              You can log into the **Owner Portal** dashboard using the landlord's Google Account to see this inquiry populate live!
            </p>
            <button className={styles.doneBtn} onClick={onClose}>
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryModal;
