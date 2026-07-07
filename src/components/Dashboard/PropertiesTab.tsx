import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { PropertyItem } from './types';
import styles from '../../styles/Dashboard.module.css';

interface PropertiesTabProps {
  properties: PropertyItem[];
  triggerEditProperty: (propId: string | number) => void;
  handleDeleteProperty: (propId: string | number) => void;
  setActiveTab: (tab: 'overview' | 'list' | 'properties' | 'inquiries') => void;
}

const PropertiesTab: React.FC<PropertiesTabProps> = ({
  properties,
  triggerEditProperty,
  handleDeleteProperty,
  setActiveTab,
}) => {
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const handleCopyUid = (id: string | number) => {
    navigator.clipboard.writeText(id.toString());
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };
  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <h2>My Listed Properties</h2>
        <p>Verify or remove property advertisements currently live on SettleKar.</p>
      </div>

      {properties.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏢</div>
          <h2>No Properties Listed Yet</h2>
          <p>You haven't listed any property yet. Open the "List Property" tab to post your first rental!</p>
          <button className={styles.emptyStateBtn} onClick={() => setActiveTab('list')}>
            Post Listing Now
          </button>
        </div>
      ) : (
        <div className={styles.listedPropertiesGrid}>
          {properties.map((prop: PropertyItem) => (
            <div key={prop.id} className={styles.listedCard}>
              <button 
                type="button"
                onClick={() => triggerEditProperty(prop.id)}
                className={styles.listedCardImgLink}
                title="✏️ Edit Property"
              >
                <img src={prop.image} alt={prop.title} className={styles.listedCardImg} />
              </button>
              <div className={styles.listedCardBody}>
                <div className={styles.listedCardHead}>
                  <h3>
                    <button 
                      type="button"
                      onClick={() => triggerEditProperty(prop.id)}
                      className={styles.listedCardTitleLink}
                      title="✏️ Edit Property"
                    >
                      {prop.title}
                    </button>
                  </h3>
                  <span className={styles.listedCardBadge}>{prop.badge}</span>
                </div>
                <div className={styles.listedCardUid}>
                  <span className={styles.uidLabel}>UID:</span>
                  <span className={styles.uidValue}>{prop.id}</span>
                  <button 
                    type="button" 
                    className={styles.copyUidBtn} 
                    onClick={() => handleCopyUid(prop.id)}
                    title="Copy Property UID"
                    aria-label="Copy Property UID"
                  >
                    {copiedId === prop.id ? (
                      <>
                        <Check size={12} className={styles.copyIcon} />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} className={styles.copyIcon} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className={styles.listedCardAddr}>
                  📍 {prop.address || (prop.location && !prop.location.startsWith('http') ? prop.location : '') || prop.city}
                  {prop.location && prop.location.startsWith('http') && (
                    <a 
                      href={prop.location} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.mapLinkBadge}
                      title="Open Google Maps"
                    >
                      🌐 Maps
                    </a>
                  )}
                </p>
                {prop.overallscore !== undefined && prop.overallscore !== null && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                    background: prop.overallscore >= 80 
                      ? 'rgba(5, 150, 105, 0.1)' 
                      : prop.overallscore >= 60 
                        ? 'rgba(217, 119, 6, 0.1)' 
                        : 'rgba(220, 38, 38, 0.1)',
                    color: prop.overallscore >= 80 
                      ? '#059669' 
                      : prop.overallscore >= 60 
                        ? '#d97706' 
                        : '#dc2626',
                    border: prop.overallscore >= 80 
                      ? '1px solid rgba(5, 150, 105, 0.2)' 
                      : prop.overallscore >= 60 
                        ? '1px solid rgba(217, 119, 6, 0.2)' 
                        : '1px solid rgba(220, 38, 38, 0.2)',
                  }}>
                    🛡️ Livability Score: <strong>{prop.overallscore}/100</strong>
                  </div>
                )}
                <p className={styles.listedCardFeat}>{prop.features}</p>
                <div className={styles.listedCardFooter}>
                  <span className={styles.listedCardPrice}>{prop.price}</span>
                  <div className={styles.actionBtns}>
                    <button
                      type="button"
                      className={styles.editPropBtn}
                      onClick={() => triggerEditProperty(prop.id)}
                      aria-label={`Edit ${prop.title}`}
                    >
                      ✏️ Edit Property
                    </button>
                    <button
                      type="button"
                      className={styles.deletePropBtn}
                      onClick={() => handleDeleteProperty(prop.id)}
                      aria-label={`Delete ${prop.title}`}
                    >
                      🗑️ Delete Listing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesTab;
