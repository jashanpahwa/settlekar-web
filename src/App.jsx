import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import LandingPage from './LandingPage.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import DeleteAccount from './DeleteAccount.jsx';
import NotFound from './NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
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