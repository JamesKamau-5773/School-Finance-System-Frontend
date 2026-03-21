import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import CashbookDashboard from './features/cashbook/CashbookDashboard';
import TrialBalance from './features/reports/TrialBalance';
import FeeMaster from './features/fees/FeeMaster';

function PlaceholderPage({ title }) {
  return (
    <div className="p-8 text-slate-300">
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400">This section is coming soon.</p>
    </div>
  );
}

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/cashbook" replace />} />
        <Route path="/cashbook" element={<CashbookDashboard />} />
        <Route path="/reports" element={<TrialBalance />} />
        <Route path="/fees" element={<FeeMaster />} />
        <Route path="/store-keeper" element={<PlaceholderPage title="Store Keeper" />} />
        <Route path="*" element={<Navigate to="/cashbook" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;