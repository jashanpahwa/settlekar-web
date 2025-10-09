import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PrivacyPolicy.module.css';
import logoImage from '/logo.png';

const PrivacyPolicy = () => {

  return (
    <div className={styles.privacyPolicy}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logo}>
            <img src={logoImage} alt="SettleKar" className={styles.logoImage} />
          </div>
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/delete-account" className={styles.navLink}>Delete Account</Link>
          </nav>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <main className={styles.privacyContent}>
        <div className={`${styles.container} ${styles.privacyContentContainer}`}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>

          <section className={styles.policySection}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to SettleKar ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our rental property platform, mobile application, and related services.
            </p>
            <p>
              SettleKar is a property rental platform that connects property owners with potential tenants, facilitating property discovery, listing, and communication through our mobile application.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li>Name, email address, and phone number (including contact details starting with +91)</li>
              <li>Google account information when you sign in with Google</li>
              <li>Profile photos and user profile information</li>
              <li>Property listing details, descriptions, and rental preferences</li>
              <li>Property owner information including owner name, contact details, and profile photos</li>
              <li>Property photos captured through camera access (indoor and outdoor images)</li>
              <li>Location data and precise property addresses with map coordinates</li>
              <li>Payment information for property listing plans and transactions</li>
              <li>Wishlist and saved property preferences</li>
            </ul>

            <h3>2.2 Location Information</h3>
            <p>We collect location data to provide location-based services:</p>
            <ul>
              <li>Precise location coordinates for property listings</li>
              <li>Your current location to help discover nearby properties</li>
              <li>City, area, and address information for property search and filtering</li>
              <li>Google Maps integration data for property location visualization</li>
            </ul>

            <h3>2.3 Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use our app:</p>
            <ul>
              <li>Device identifiers and technical information</li>
              <li>App usage patterns, search queries, and property viewing history</li>
              <li>Real-time app performance data and crash reports</li>
              <li>IP address and general location information</li>
              <li>Firebase Analytics data for app improvement</li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li>Provide and maintain our rental property listing and search services</li>
              <li>Connect property owners with potential tenants through our platform</li>
              <li>Display property listings with photos, descriptions, and location information</li>
              <li>Process property photos captured through camera access for listings</li>
              <li>Enable location-based property search and discovery</li>
              <li>Facilitate Google Sign-In authentication and account management</li>
              <li>Process payments for property listing plans (basic, premium, featured)</li>
              <li>Manage wishlists and saved property preferences</li>
              <li>Send real-time notifications about new properties and updates</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our platform functionality and user experience</li>
              <li>Ensure security, prevent fraud, and maintain platform integrity</li>
              <li>Comply with legal obligations and enforce our terms of service</li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <h2>4. Camera and Photo Permissions</h2>
            <p>
              Our app requests camera permission to enhance your property listing experience:
            </p>
            <ul>
              <li><strong>Property Photography:</strong> Capture high-quality indoor and outdoor photos for property listings</li>
              <li><strong>Profile Pictures:</strong> Take or update profile photos for user accounts and property owner verification</li>
              <li><strong>Property Documentation:</strong> Photograph property features, amenities, and surrounding areas</li>
              <li><strong>Image Upload:</strong> Select and upload images from your device's photo library</li>
            </ul>
            <p>
              <strong>Important:</strong> Camera access is entirely optional and only activated when you choose to use camera-related features. 
              You can deny camera permission and still browse properties and use most app features. Photos captured are stored securely and 
              are only used for property listings and profile purposes. We do not access your camera without your explicit consent for each use.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>5. Location Services</h2>
            <p>
              SettleKar uses location services to provide core functionality:
            </p>
            <ul>
              <li><strong>Property Discovery:</strong> Find properties near your current location</li>
              <li><strong>Map Integration:</strong> Display properties on interactive maps with precise locations</li>
              <li><strong>Location-Based Search:</strong> Filter and search properties by city, area, or proximity</li>
              <li><strong>Property Listing:</strong> Set accurate property locations when listing properties</li>
            </ul>
            <p>
              Location permissions can be managed through your device settings. Denying location access will limit some features but won't prevent you from using the app.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>6. Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>Between Users:</strong> Property owner contact details and property information are shared with interested tenants, and tenant inquiries are shared with property owners</li>
              <li><strong>Google Services:</strong> When you use Google Sign-In, we share necessary information with Google for authentication</li>
              <li><strong>Payment Processors:</strong> Payment information is shared with secure payment processors for listing plan transactions</li>
              <li><strong>Firebase Services:</strong> App data is processed through Firebase for real-time updates, analytics, and cloud storage</li>
              <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our platform</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul>
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Secure Firebase cloud storage with access controls</li>
              <li>Google Sign-In security protocols and authentication</li>
              <li>Regular security assessments and updates</li>
              <li>Secure payment processing for listing transactions</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data backup and recovery procedures</li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <h2>8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services:
            </p>
            <ul>
              <li>Active property listings are retained while the property is available</li>
              <li>User accounts and profiles are retained while your account is active</li>
              <li>Wishlist and saved properties are retained for your convenience</li>
              <li>Payment records are retained as required by law and for dispute resolution</li>
              <li>Analytics data may be retained in aggregated, anonymized form for service improvement</li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <h2>9. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request access to your personal information and property listings</li>
              <li><strong>Correction:</strong> Update your profile information, contact details, and property listings</li>
              <li><strong>Deletion:</strong> Delete your account, property listings, and associated data</li>
              <li><strong>Portability:</strong> Export your property listings and account data</li>
              <li><strong>Opt-out:</strong> Disable notifications, location services, and camera access</li>
              <li><strong>Wishlist Management:</strong> Add or remove properties from your saved list</li>
            </ul>
          </section>

          <section className={styles.policySection}>
            <h2>10. Third-Party Services</h2>
            <p>
              SettleKar integrates with several third-party services:
            </p>
            <ul>
              <li><strong>Google Services:</strong> Google Sign-In, Google Maps, and Firebase services</li>
              <li><strong>Payment Processors:</strong> Secure payment gateways for listing plan purchases</li>
              <li><strong>Analytics Services:</strong> Firebase Analytics for app performance monitoring</li>
            </ul>
            <p>
              These services have their own privacy policies. We encourage you to review their privacy practices before using these features.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>11. Children's Privacy</h2>
            <p>
              SettleKar is intended for users aged 18 and above who can legally enter into rental agreements. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>12. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than India, particularly through our use of Firebase and Google services. We ensure that such transfers are conducted in accordance with applicable data protection laws and with appropriate safeguards in place.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>13. Updates and Notifications</h2>
            <p>
              SettleKar provides real-time updates and notifications about:
            </p>
            <ul>
              <li>New property listings in your preferred areas</li>
              <li>Price changes and availability updates</li>
              <li>Messages from property owners or interested tenants</li>
              <li>App updates and new features</li>
            </ul>
            <p>
              You can manage notification preferences through the app settings.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>14. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy in the app and updating the "Last updated" date. Your continued use of SettleKar after such changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className={styles.policySection}>
            <h2>15. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> privacy@settlekar.com</p>
              <p><strong>Support:</strong> support@settlekar.com</p>
              <p><strong>Phone:</strong> +91 6367073699</p>
              <p><strong>Address:</strong> SettleKar Technologies Pvt. Ltd.<br />
              Bangalore, Karnataka<br />
              India</p>
            </div>
          </section>

          <section className={styles.policySection}>
            <h2>16. Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of India. Any disputes arising under this Privacy Policy shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>SettleKar</h3>
              <p>Your trusted partner in finding the perfect rental property.</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/" className={styles.footerLink}>
                    Home
                  </Link>
                </li>
                <li><a href="mailto:support@settlekar.com">Support</a></li>
                <li><a href="mailto:privacy@settlekar.com">Privacy Concerns</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>Email: privacy@settlekar.com</p>
              <p>Phone: +91 12345 67890</p>
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

export default PrivacyPolicy;