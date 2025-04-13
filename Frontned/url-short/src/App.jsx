import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Shorten from './pages/Shorten';
import Dashboard from './pages/Dashboard';
import AnalyticsDetail from './pages/AnalyticsDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/shorten" element={<Shorten />} />
      <Route path="/analytics" element={<Dashboard />} />
      <Route path="/analytics/:shortId" element={<AnalyticsDetail />} />
    </Routes>
  );
}

export default App;
