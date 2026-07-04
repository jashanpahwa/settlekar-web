import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/App.css';
import LandingPage from './pages/LandingPage';

// Lazy load other route components to split bundles and optimize initial page load performance
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const DeleteAccount = lazy(() => import('./pages/DeleteAccount'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PropertyRedirect = lazy(() => import('./pages/PropertyRedirect'));
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