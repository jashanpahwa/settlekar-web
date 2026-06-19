import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import LandingPage from './LandingPage';

// Lazy load other route components to split bundles and optimize initial page load performance
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const TermsOfService = lazy(() => import('./TermsOfService'));
const DeleteAccount = lazy(() => import('./DeleteAccount'));
const NotFound = lazy(() => import('./NotFound'));
const PropertyRedirect = lazy(() => import('./PropertyRedirect'));
const Dashboard = lazy(() => import('./Dashboard'));
const LocationPage = lazy(() => import('./LocationPage'));
const GuidesIndex = lazy(() => import('./GuidesIndex'));
const ArticlePage = lazy(() => import('./ArticlePage'));

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/property/:id"
              element={<PropertyRedirect />}
            />
            <Route path="/guides" element={<GuidesIndex />} />
            <Route path="/guides/:articleSlug" element={<ArticlePage />} />
            <Route path="/:locationSlug" element={<LocationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;