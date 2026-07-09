import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/App.css';

// Lazy load route components to split bundles and optimize initial page load performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const DeleteAccount = lazy(() => import('./pages/DeleteAccount'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LocationPage = lazy(() => import('./pages/LocationPage'));
const GuidesIndex = lazy(() => import('./pages/GuidesIndex'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

import ScrollToTop from './components/Landing/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="App">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />

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