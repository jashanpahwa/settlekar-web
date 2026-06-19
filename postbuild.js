import fs from 'fs';
import path from 'path';

// Define the static routes that need real index.html files to return a 200 OK status code.
const routes = [
  'privacy-policy',
  'terms-of-service',
  'delete-account',
  'dashboard',
  // Programmatic SEO Location Slugs (Jaipur)
  'flats-for-rent-in-jaipur',
  '1-bhk-for-rent-in-vaishali-nagar-jaipur',
  'pg-near-jaipur-airport',
  'rental-property-in-malviya-nagar-jaipur',
  '2-bhk-for-rent-in-jagatpura-jaipur',
  '3-bhk-flats-for-rent-in-jaipur',
  'pg-for-girls-in-jaipur',
  'pg-for-boys-in-jaipur',
  'independent-house-for-rent-in-jaipur',
  'semi-furnished-flats-for-rent-in-jaipur',
  'fully-furnished-flats-for-rent-in-jaipur',
  'budget-flats-for-rent-in-jaipur',
  'luxury-apartments-for-rent-in-jaipur',
  'student-accommodation-jaipur',
  'family-homes-for-rent-in-jaipur',
  'independent-builder-floor-for-rent-in-jaipur',
  'studio-apartments-for-rent-in-jaipur',
  'rental-property-in-bani-park-jaipur',
  'rental-property-in-c-scheme-jaipur',
  'rental-property-in-mansarovar-jaipur',
  'rental-property-in-jhotwara-jaipur',
  'rental-property-in-sanganer-jaipur',
  'rental-property-in-amer-jaipur',
  'rental-property-in-pink-city-jaipur',
  'rental-property-in-sitapura-jaipur',
  // Content Pillars & Topic Clusters (Guides)
  'guides',
  'guides/best-areas-to-live-in-jaipur-working-professionals',
  'guides/how-to-rent-flat-without-broker-jaipur',
  'guides/cost-of-living-in-jaipur',
  'guides/pg-vs-flat-comparison-jaipur',
  'guides/moving-to-jaipur-relocation-guide',
  'guides/premium-suburbs-to-rent-mumbai',
  'guides/bengaluru-rental-market-guide',
  'guides/gurugram-renting-sectors-guide',
  'guides/pune-rental-localities-working-professionals',
  'guides/understanding-rental-agreements-tenants-checklist',
  'guides/hidden-costs-of-renting-apartments',
  'guides/furnished-vs-unfurnished-flats-rental-guide',
  'guides/relocation-packing-checklist-working-professionals',
  'guides/top-residential-hubs-for-techies-chennai'
];
const distDir = path.resolve('dist');

routes.forEach((route) => {
  const routeDir = path.join(distDir, route);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Copy the built index.html into the directory
  fs.copyFileSync(path.join(distDir, 'index.html'), path.join(routeDir, 'index.html'));
  console.log(`[Post-Build] Successfully copied index.html to ${path.join(route, 'index.html')}`);
});
