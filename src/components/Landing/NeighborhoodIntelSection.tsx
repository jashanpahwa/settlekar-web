import React from 'react';
import styles from '../../styles/NeighborhoodIntelSection.module.css';
import { NeighborhoodIntelData } from '../../utils/locationPages';

interface NeighborhoodIntelSectionProps {
  locality: string;
  city: string;
  intel: NeighborhoodIntelData;
}

export const NeighborhoodIntelSection: React.FC<NeighborhoodIntelSectionProps> = ({
  locality,
  city,
  intel,
}) => {
  const {
    rentBand,
    commuteTimes,
    furnishingBreakdown,
    transitAccess,
    essentials,
  } = intel;

  // Visual rent bar percent calculation (based on a reasonable max of 80k for Jaipur)
  const leftPercent = Math.max(0, Math.min(85, (rentBand.min / 80000) * 100));
  const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((rentBand.max - rentBand.min) / 80000) * 100));

  const mapQuery = `${locality}, ${city}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className={styles.section}>
      <div className={styles.container || 'max-w-6xl mx-auto px-6'}>
        <div className={styles.titleSection}>
          <h2>Neighborhood Intelligence</h2>
          <p>
            Key insights, typical rent bands, transit availability, and average commute times in {locality}.
          </p>
        </div>

        <div className={styles.intelGrid}>
          {/* Rent band card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>📊</span> Rent Band Comfort
            </div>
            <div className={styles.rentBandWrapper}>
              <div className={priceRangeLabelsStyle}>
                <span>₹{rentBand.min.toLocaleString('en-IN')}</span>
                <span>₹{rentBand.max.toLocaleString('en-IN')} / month</span>
              </div>
              <div className={styles.rangeBarContainer}>
                <div
                  className={styles.rangeBarFill}
                  style={{
                    marginLeft: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>
              <p className={styles.rentNotes}>
                Typical rental values for 1 BHK to 3 BHK listings in {locality}. Premium properties/villas can exceed this range.
              </p>
            </div>
          </div>

          {/* Commute times card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>🚗</span> Travel & Commute Estimates
            </div>
            <div className={styles.commuteList}>
              {commuteTimes.map((item, idx) => (
                <div key={idx} className={styles.commuteItem}>
                  <span className={styles.commuteDest}>📍 {item.label}</span>
                  <span className={styles.commuteTimeBadge}>~{item.minutes} mins</span>
                </div>
              ))}
            </div>
          </div>

          {/* Furnishing breakdown card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>🪑</span> Furnishing Quality & Availability
            </div>
            <div className={styles.furnishDistribution}>
              <div className={styles.furnishRow}>
                <div className={styles.furnishLabels}>
                  <span>Fully Furnished</span>
                  <span>{furnishingBreakdown.fully}%</span>
                </div>
                <div className={styles.furnishBarBg}>
                  <div
                    className={styles.furnishBarFill}
                    style={{
                      width: `${furnishingBreakdown.fully}%`,
                      backgroundColor: '#4f46e5',
                    }}
                  />
                </div>
              </div>
              <div className={styles.furnishRow}>
                <div className={styles.furnishLabels}>
                  <span>Semi Furnished</span>
                  <span>{furnishingBreakdown.semi}%</span>
                </div>
                <div className={styles.furnishBarBg}>
                  <div
                    className={styles.furnishBarFill}
                    style={{
                      width: `${furnishingBreakdown.semi}%`,
                      backgroundColor: '#3b82f6',
                    }}
                  />
                </div>
              </div>
              <div className={styles.furnishRow}>
                <div className={styles.furnishLabels}>
                  <span>Unfurnished</span>
                  <span>{furnishingBreakdown.unfurnished}%</span>
                </div>
                <div className={styles.furnishBarBg}>
                  <div
                    className={styles.furnishBarFill}
                    style={{
                      width: `${furnishingBreakdown.unfurnished}%`,
                      backgroundColor: '#64748b',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transit and essentials card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>🚇</span> Transit Access
            </div>
            <div className={styles.transitGrid}>
              <div className={`${styles.transitPill} ${transitAccess.metro ? styles.active : styles.inactive}`}>
                <span className={styles.transitIcon}>🚇</span>
                <span className={styles.transitLabel}>Metro</span>
              </div>
              <div className={`${styles.transitPill} ${transitAccess.bus ? styles.active : styles.inactive}`}>
                <span className={styles.transitIcon}>🚌</span>
                <span className={styles.transitLabel}>Bus</span>
              </div>
              <div className={`${styles.transitPill} ${transitAccess.auto ? styles.active : styles.inactive}`}>
                <span className={styles.transitIcon}>🛺</span>
                <span className={styles.transitLabel}>Auto</span>
              </div>
              <div className={`${styles.transitPill} ${transitAccess.cab ? styles.active : styles.inactive}`}>
                <span className={styles.transitIcon}>🚕</span>
                <span className={styles.transitLabel}>Cabs</span>
              </div>
            </div>

            <div className={`${styles.cardTitle} mt-6`} style={{ marginTop: '24px' }}>
              <span>🛒</span> Local Essentials Nearby
            </div>
            <div className={styles.essentialsList}>
              {essentials.map((item, idx) => (
                <span key={idx} className={styles.essentialChip}>
                  ⭐ {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded neighborhood map */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <span>🗺️</span> Neighborhood Boundary Map ({locality})
          </div>
          <div className={styles.mapContainer}>
            <iframe
              title="Neighborhood Map"
              src={embedUrl}
              className={styles.mapIframe}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Safe helper for styling fallback
const priceRangeLabelsStyle = styles.priceRangeLabels || 'flex justify-between font-bold text-slate-700 mb-2';

export default NeighborhoodIntelSection;
