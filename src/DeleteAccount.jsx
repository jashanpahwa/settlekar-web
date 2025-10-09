import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DeleteAccount.module.css';
import logoImage from '/logo.png';

const DeleteAccount = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
    feedback: '',
    confirmText: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const reasons = [
    'I found another platform',
    'Too many notifications',
    'Privacy concerns',
    'Not using the service anymore',
    'Technical issues',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 2000);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.email.includes('@') && formData.reason;
      case 2:
        return formData.confirmText.toLowerCase() === 'delete my account';
      case 3:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  if (showSuccess) {
    return (
      <div className={styles.deleteAccountPage}>
        <div className={styles.container}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <h1>Account Deletion Request Submitted</h1>
            <p>
              Your account deletion request has been received. We'll process your request within 7-10 business days.
              You'll receive a confirmation email once your account has been permanently deleted.
            </p>
            <div className={styles.successActions}>
              <Link to="/" className={`${styles.btn} ${styles.btnPrimary}`}>
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.deleteAccountPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/privacy-policy" className={styles.navLink}>Privacy Policy</Link>
          </nav>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.deleteAccountContainer}>
          <div className={styles.deleteAccountHeader}>
            <h1>Delete Your Account</h1>
            <p>We're sorry to see you go. Please follow the steps below to permanently delete your SettleKar account.</p>
          </div>

          {/* Progress Indicator */}
          <div className={styles.progressIndicator}>
            <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>1</div>
              <span>Account Details</span>
            </div>
            <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>2</div>
              <span>Confirmation</span>
            </div>
            <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''} ${step > 3 ? styles.completed : ''}`}>
              <div className={styles.stepNumber}>3</div>
              <span>Final Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.deleteAccountForm}>
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className={styles.formStep}>
                <h2>Step 1: Account Information</h2>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your registered email address"
                    required
                  />
                  <small>Please enter the email address associated with your SettleKar account</small>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reason">Reason for Deletion</label>
                  <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a reason</option>
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="feedback">Additional Feedback (Optional)</label>
                  <textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    placeholder="Help us improve by sharing your experience..."
                    rows="4"
                  />
                </div>

                <div className={styles.warningBox}>
                  <div className={styles.warningIcon}>⚠️</div>
                  <div className={styles.warningContent}>
                    <h3>Important Information</h3>
                    <ul>
                      <li>Account deletion is permanent and cannot be undone</li>
                      <li>All your property listings will be removed</li>
                      <li>Your saved properties and wishlist will be deleted</li>
                      <li>You will lose access to all messages and conversations</li>
                      <li>Any active subscriptions will be cancelled</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <div className={styles.formStep}>
                <h2>Step 2: Confirm Your Decision</h2>
                
                <div className={styles.confirmationBox}>
                  <h3>Are you absolutely sure?</h3>
                  <p>
                    This action cannot be undone. This will permanently delete your account, 
                    remove all your data from our servers, and cancel any active subscriptions.
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmText">
                    Type <strong>"delete my account"</strong> to confirm
                  </label>
                  <input
                    type="text"
                    id="confirmText"
                    name="confirmText"
                    value={formData.confirmText}
                    onChange={handleInputChange}
                    placeholder="delete my account"
                    required
                  />
                </div>

                <div className={styles.dataRetentionInfo}>
                  <h4>Data Retention Policy</h4>
                  <p>
                    After deletion, we may retain some information for legal compliance purposes 
                    for up to 30 days. This includes transaction records and communication logs 
                    required by law. All personal information will be anonymized.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Final Review */}
            {step === 3 && (
              <div className={styles.formStep}>
                <h2>Step 3: Final Review</h2>
                
                <div className={styles.reviewSummary}>
                  <h3>Deletion Summary</h3>
                  <div className={styles.summaryItem}>
                    <strong>Email:</strong> {formData.email}
                  </div>
                  <div className={styles.summaryItem}>
                    <strong>Reason:</strong> {formData.reason}
                  </div>
                  {formData.feedback && (
                    <div className={styles.summaryItem}>
                      <strong>Feedback:</strong> {formData.feedback}
                    </div>
                  )}
                </div>

                <div className={styles.finalWarning}>
                  <div className={styles.warningIcon}>🚨</div>
                  <div className={styles.warningContent}>
                    <h3>Last Chance!</h3>
                    <p>
                      Once you click "Delete My Account", your account will be scheduled for 
                      permanent deletion. You will receive a confirmation email and have 24 hours 
                      to cancel this request if you change your mind.
                    </p>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                    />
                    <span className={styles.checkmark}></span>
                    I understand that this action is permanent and I agree to the deletion of my account and all associated data.
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.formNavigation}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  disabled={isLoading}
                >
                  Previous
                </button>
              )}
              
              <div className={styles.navRight}>
                <Link to="/" className={`${styles.btn} ${styles.btnOutline}`}>
                  Cancel
                </Link>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={!isStepValid()}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    disabled={!isStepValid() || isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Delete My Account'}
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Alternative Options */}
          <div className={styles.alternativeOptions}>
            <h3>Not sure about deleting your account?</h3>
            <p>Consider these alternatives:</p>
            <div className={styles.alternativesGrid}>
              <div className={styles.alternativeCard}>
                <h4>Temporarily Deactivate</h4>
                <p>Hide your profile and listings without losing your data</p>
                <button className={`${styles.btn} ${styles.btnOutlineSmall}`}>Deactivate Instead</button>
              </div>
              <div className={styles.alternativeCard}>
                <h4>Update Privacy Settings</h4>
                <p>Control what information is visible to others</p>
                <button className={`${styles.btn} ${styles.btnOutlineSmall}`}>Privacy Settings</button>
              </div>
              <div className={styles.alternativeCard}>
                <h4>Contact Support</h4>
                <p>Get help with any issues you're experiencing</p>
                <button className={`${styles.btn} ${styles.btnOutlineSmall}`}>Get Help</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>SettleKar</h3>
              <p>Your trusted partner in finding the perfect rental property.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <ul>
                <li><a href="mailto:support@settlekar.com">Contact Support</a></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><a href="#help">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 SettleKar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DeleteAccount;