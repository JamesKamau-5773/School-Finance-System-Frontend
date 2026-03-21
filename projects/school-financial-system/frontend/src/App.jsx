import React from 'react';
import MainLayout from './layout/MainLayout';
import CashbookDashboard from './features/cashbook/CashbookDashboard';

function App() {
  return (
    <MainLayout>
      <CashbookDashboard />
    </MainLayout>
  );
}

export default App;