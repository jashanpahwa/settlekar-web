import React from 'react';
import { PropertyItem } from './types';
import styles from '../../Dashboard.module.css';

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
