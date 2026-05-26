import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import LandingPage from './LandingPage';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import DeleteAccount from './DeleteAccount';
import NotFound from './NotFound';
import PropertyRedirect from './PropertyRedirect';
import Dashboard from './Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;