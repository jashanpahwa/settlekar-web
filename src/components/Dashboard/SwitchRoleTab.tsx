import React, { useState } from 'react';
import styles from '../../Dashboard.module.css';

interface SwitchRoleTabProps {
  currentRole: 'owner' | 'broker' | 'firm' | 'tenant';
  onSwitchRole: (newRole: 'owner' | 'broker' | 'firm' | 'tenant') => void;
}

const SwitchRoleTab: React.FC<SwitchRoleTabProps> = ({ currentRole, onSwitchRole }) => {
  const [selectedRole, setSelectedRole] = useState<'owner' | 'broker' | 'firm' | 'tenant'>(currentRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === currentRole) {
      alert("Please select a different role to switch.");
      return;
    }
    if (window.confirm(`Are you sure you want to change your account type from ${currentRole.toUpperCase()} to ${selectedRole.toUpperCase()}?`)) {
      onSwitchRole(selectedRole);
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.appCard} style={{ maxWidth: '650px', margin: '0 auto', padding: '30px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>Switch Account Role</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.925rem', marginBottom: '24px', lineHeight: 1.6 }}>
          Your current account type is set to <strong>{currentRole === 'broker' ? 'Real Estate Broker' : currentRole === 'firm' ? 'Real Estate Firm / Developer' : currentRole === 'tenant' ? 'Tenant' : 'Property Owner'}</strong>. 
          Switching your role will let you set up a new profile and unlock different features.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Owner Option */}
            <div 
              onClick={() => setSelectedRole('owner')}
              className={`${styles.roleOptionCard} ${selectedRole === 'owner' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>🏠</div>
              <div className={styles.roleOptionDetails}>
                <h4>Property Owner</h4>
                <p>List your properties directly with no brokerage. Ideal for individual landlords.</p>
              </div>
            </div>

            {/* Broker Option */}
            <div 
              onClick={() => setSelectedRole('broker')}
              className={`${styles.roleOptionCard} ${selectedRole === 'broker' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>🏢</div>
              <div className={styles.roleOptionDetails}>
                <h4>Real Estate Broker</h4>
                <p>List properties on behalf of client landlords and charge brokerage commission.</p>
              </div>
            </div>

            {/* Firm Option */}
            <div 
              onClick={() => setSelectedRole('firm')}
              className={`${styles.roleOptionCard} ${selectedRole === 'firm' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>🏢🏢</div>
              <div className={styles.roleOptionDetails}>
                <h4>Real Estate Firm / Developer</h4>
                <p>For building companies, developer firms, or commercial property companies.</p>
              </div>
            </div>

            {/* Tenant Option */}
            <div 
              onClick={() => setSelectedRole('tenant')}
              className={`${styles.roleOptionCard} ${selectedRole === 'tenant' ? styles.roleOptionCardActive : ''}`}
            >
              <div className={styles.roleOptionIcon}>👤</div>
              <div className={styles.roleOptionDetails}>
                <h4>Tenant / House Hunter</h4>
                <p>Browse verified listings and make inquiries without listing features.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.googleSignInBtn} 
            disabled={selectedRole === currentRole}
            style={{ background: '#2563eb', color: '#ffffff', fontWeight: 700, marginTop: '16px', opacity: selectedRole === currentRole ? 0.6 : 1, cursor: selectedRole === currentRole ? 'not-allowed' : 'pointer' }}
          >
            Switch to Selected Role
          </button>
        </form>
      </div>
    </div>
  );
};

export default SwitchRoleTab;
