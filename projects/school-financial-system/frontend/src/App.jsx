import React, { useMemo, useState } from 'react';
import MainLayout from './layout/MainLayout';
import CashbookDashboard from './features/cashbook/CashbookDashboard';
import TrialBalance from './features/reports/TrialBalance';

function PlaceholderPage({ title }) {
  return (
    <div className="p-8 text-slate-300">
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400">This section is coming soon.</p>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('cashbook');

  const content = useMemo(() => {
    if (activeSection === 'audit-report') {
      return <TrialBalance />;
    }

    if (activeSection === 'fee-master') {
      return <PlaceholderPage title="Fee Master" />;
    }

    if (activeSection === 'store-keeper') {
      return <PlaceholderPage title="Store Keeper" />;
    }

    return <CashbookDashboard />;
  }, [activeSection]);

  return (
    <MainLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {content}
    </MainLayout>
  );
}

export default App;