import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import LandingPage from './LandingPage.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import DeleteAccount from './DeleteAccount.jsx';
import NotFound from './NotFound.jsx';

// Get base name for router based on environment
const basename = '';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;