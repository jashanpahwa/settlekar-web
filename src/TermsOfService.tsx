import { Link } from 'react-router-dom';
import styles from './TermsOfService.module.css';
import logoImage from '/logo.png';

const TermsOfService = () => {

  return (
    <div className={styles.termsOfService}>
      {/* React 19 Document Metadata */}
      <title>SettleKar - Terms of Service</title>
      <meta name="description" content="Review the Terms of Service for SettleKar. Understand user registration, listing plans, property owner responsibilities, and legal agreements." />
      <link rel="canonical" href="https://settlekar.in/terms-of-service" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://settlekar.in/terms-of-service" />
      <meta property="og:title" content="SettleKar - Terms of Service" />
      <meta property="og:description" content="Review the Terms of Service for SettleKar. Understand user registration, listing plans, property owner responsibilities, and legal agreements." />
      <meta property="og:image" content="https://settlekar.in/logo.png" />
      <meta property="og:site_name" content="SettleKar" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="SettleKar - Terms of Service" />
      <meta name="twitter:description" content="Review the Terms of Service for SettleKar. Understand listing plans, property owner responsibilities, and legal agreements." />

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

      {/* Terms of Service Content */}
      <main className={styles.termsContent}>
        <div className={`${styles.container} ${styles.termsContentContainer}`}>
          <h1>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>

          <section className={styles.termsSection}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to SettleKar ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of the SettleKar mobile application and related services (collectively, the "Service") operated by SettleKar Technologies Pvt. Ltd.
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>2. Description of Service</h2>
            <p>
              SettleKar is a property rental platform that connects property owners with potential tenants. Our Service includes:
            </p>
            <ul>
              <li>Property listing and discovery platform</li>
              <li>Mobile application for iOS and Android devices</li>
              <li>Property search and filtering capabilities</li>
              <li>Communication tools between property owners and tenants</li>
              <li>Location-based property recommendations</li>
              <li>Property photo and information management</li>
              <li>Wishlist and saved property features</li>
              <li>Payment processing for listing plans</li>
              <li>Real-time notifications and updates</li>
            </ul>
          </section>

          <section className={styles.termsSection}>
            <h2>3. User Accounts and Registration</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use certain features of our Service, you must register for an account. You may register using:
            </p>
            <ul>
              <li>Google Sign-In authentication</li>
              <li>Email and phone number verification</li>
              <li>Valid contact information including phone numbers starting with +91</li>
            </ul>

            <h3>3.2 Account Responsibilities</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>Providing accurate, current, and complete information</li>
              <li>Updating your information to keep it accurate and current</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>

            <h3>3.3 Age Requirements</h3>
            <p>
              You must be at least 18 years old to use our Service. By using the Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>4. Property Listings and Content</h2>
            <h3>4.1 Property Owner Responsibilities</h3>
            <p>If you list properties on SettleKar, you agree to:</p>
            <ul>
              <li>Provide accurate and truthful property information</li>
              <li>Upload genuine photos of the property (indoor and outdoor)</li>
              <li>Set fair and accurate rental prices</li>
              <li>Respond promptly to tenant inquiries</li>
              <li>Maintain the property in the condition described</li>
              <li>Comply with all applicable local housing laws and regulations</li>
              <li>Have the legal right to rent the property</li>
            </ul>

            <h3>4.2 Content Standards</h3>
            <p>All content you submit must:</p>
            <ul>
              <li>Be accurate and not misleading</li>
              <li>Not violate any third-party rights</li>
              <li>Not contain illegal, harmful, or offensive material</li>
              <li>Not include spam, duplicate, or irrelevant content</li>
              <li>Comply with our community guidelines</li>
            </ul>

            <h3>4.3 Content Ownership and License</h3>
            <p>
              You retain ownership of content you submit to SettleKar. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content in connection with the Service.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>5. Prohibited Uses and Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Post false, misleading, or fraudulent property listings</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Spam or send unsolicited communications</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use automated systems to access the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Collect user information without consent</li>
              <li>Impersonate any person or entity</li>
              <li>Use the Service for any commercial purpose other than property rental</li>
              <li>Post content that infringes intellectual property rights</li>
              <li>Engage in discriminatory practices based on race, religion, gender, or other protected characteristics</li>
            </ul>
          </section>

          <section className={styles.termsSection}>
            <h2>6. Payment Terms and Listing Plans</h2>
            <h3>6.1 Listing Plans</h3>
            <p>SettleKar offers various listing plans:</p>
            <ul>
              <li><strong>Basic Plan:</strong> Standard property listing features</li>
              <li><strong>Premium Plan:</strong> Enhanced visibility and additional features</li>
              <li><strong>Featured Plan:</strong> Maximum exposure and priority placement</li>
            </ul>

            <h3>6.2 Payment Processing</h3>
            <p>
              Payments are processed through secure third-party payment processors. By making a payment, you agree to the terms and conditions of our payment processors.
            </p>

            <h3>6.3 Refunds and Cancellations</h3>
            <p>
              Refund policies vary by listing plan. Please review the specific terms for your chosen plan. Generally:
            </p>
            <ul>
              <li>Refunds may be available within 24 hours of purchase</li>
              <li>Cancellations must be requested through the app</li>
              <li>Partial refunds may apply for unused portions of plans</li>
            </ul>
          </section>

          <section className={styles.termsSection}>
            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
            <p>Key privacy aspects include:</p>
            <ul>
              <li>Location data collection for property discovery</li>
              <li>Camera access for property photography</li>
              <li>Google Sign-In integration</li>
              <li>Firebase services for real-time updates</li>
              <li>Secure data storage and transmission</li>
            </ul>
          </section>

          <section className={styles.termsSection}>
            <h2>8. Intellectual Property Rights</h2>
            <h3>8.1 SettleKar's Rights</h3>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of SettleKar Technologies Pvt. Ltd. and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>

            <h3>8.2 User Content</h3>
            <p>
              You retain rights to content you create and submit. However, you must not submit content that infringes on the intellectual property rights of others.
            </p>

            <h3>8.3 Trademark Policy</h3>
            <p>
              SettleKar, the SettleKar logo, and other marks are trademarks of SettleKar Technologies Pvt. Ltd. You may not use our trademarks without our prior written consent.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>9. Disclaimers and Limitations of Liability</h2>
            <h3>9.1 Service Availability</h3>
            <p>
              We strive to maintain the Service, but we cannot guarantee uninterrupted or error-free operation. The Service is provided "as is" and "as available" without warranties of any kind.
            </p>

            <h3>9.2 Property Verification</h3>
            <p>
              While we encourage accurate listings, we do not verify the accuracy of property information, photos, or availability. Users are responsible for verifying property details independently.
            </p>

            <h3>9.3 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, SettleKar shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
            </p>

            <h3>9.4 Third-Party Services</h3>
            <p>
              Our Service integrates with third-party services (Google, Firebase, payment processors). We are not responsible for the availability or functionality of these third-party services.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>10. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless SettleKar Technologies Pvt. Ltd., its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you submit to the Service</li>
              <li>Your property listings and rental activities</li>
            </ul>
          </section>

          <section className={styles.termsSection}>
            <h2>11. Termination</h2>
            <h3>11.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by using the account deletion feature in the app or contacting our support team.
            </p>

            <h3>11.2 Termination by Us</h3>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>

            <h3>11.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to use the Service will cease immediately. Your property listings will be removed, and your account data will be handled according to our Privacy Policy.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>12. Dispute Resolution</h2>
            <h3>12.1 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>

            <h3>12.2 Jurisdiction</h3>
            <p>
              Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
            </p>

            <h3>12.3 Dispute Resolution Process</h3>
            <p>
              Before filing any legal action, we encourage users to contact our support team to resolve disputes amicably. We are committed to working with users to address concerns and find mutually acceptable solutions.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            <p>
              What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>15. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, constitute the entire agreement between you and SettleKar Technologies Pvt. Ltd. regarding the use of the Service.
            </p>
          </section>

          <section className={styles.termsSection}>
            <h2>16. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> legal@settlekar.com</p>
              <p><strong>Support:</strong> support@settlekar.com</p>
              <p><strong>Phone:</strong> +91 6367073699</p>
              <p><strong>Address:</strong> SettleKar Technologies Pvt. Ltd.<br />
              Bangalore, Karnataka<br />
              India</p>
            </div>
          </section>

          <section className={styles.termsSection}>
            <h2>17. Acknowledgment</h2>
            <p>
              By using SettleKar, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them. If you do not agree to these Terms, you must not use our Service.
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
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link to="/privacy-policy" className={styles.footerLink}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className={styles.footerLink}>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/delete-account" className={styles.footerLink}>
                    Delete Account
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <ul>
                <li>
                  <Link to="/" className={styles.footerLink}>
                    Home
                  </Link>
                </li>
                <li><a href="mailto:support@settlekar.com">Support</a></li>
                <li><a href="mailto:legal@settlekar.com">Legal Inquiries</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>Email: legal@settlekar.com</p>
              <p>Phone: +91 6367073699</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 SettleKar Technologies Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;