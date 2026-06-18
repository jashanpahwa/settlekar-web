import fs from 'fs';
import path from 'path';

// Define the static routes that need real index.html files to return a 200 OK status code.
const routes = [
  'privacy-policy',
  'terms-of-service',
  'delete-account',
  'dashboard',
  'flats-for-rent-in-jaipur',
  '1-bhk-for-rent-in-vaishali-nagar-jaipur',
  'pg-near-jaipur-airport',
  'rental-property-in-malviya-nagar-jaipur',
  '2-bhk-for-rent-in-jagatpura-jaipur'
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
