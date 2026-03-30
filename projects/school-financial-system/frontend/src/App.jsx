import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import LandingPage from './features/public/LandingPage';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './features/auth/ProtectedRoute';
import CashbookDashboard from './features/cashbook/CashbookDashboard';
import TrialBalance from './features/reports/TrialBalance';
import FeeMaster from './features/fees/FeeMaster';
import StudentDirectory from './features/students/StudentDirectory';
import Settings from './features/settings/Settings';
import StorekeeperDashboard from './features/inventory/StorekeeperDashboard';
import UserManagement from './features/users/UserManagement';
import { ROLE_PERMISSIONS, getHomeRouteForRole } from './auth/roleAccess';

function App() {
  const { user } = useAuth();

  // Public routes (no auth required - accessible to everyone)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Protected routes (auth required + role-based access)
  return (
    <MainLayout>
      <Routes>
        {/* Default redirect based on user role */}
        <Route 
          path="/" 
          element={
            <Navigate to={getHomeRouteForRole(user.role)} replace />
          } 
        />

        {/* Finance Module */}
        <Route 
          path="/cashbook" 
          element={
            <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.cashbook}>
              <CashbookDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Reports Module */}
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.reports}>
              <TrialBalance />
            </ProtectedRoute>
          } 
        />

        {/* Fees Module */}
        <Route 
          path="/fees" 
          element={
            <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.fees}>
              <FeeMaster />
            </ProtectedRoute>
          } 
        />

        {/* Student Directory Module */}
        <Route 
          path="/students" 
          element={
            <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.students}>
              <StudentDirectory />
            </ProtectedRoute>
          } 
        />

        {/* Settings Module (Admin Only) */}
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.settings}>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* User Management Module (Admin Only) */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.users}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Inventory Module (Storekeeper Only) */}
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute allowedRoles={ROLE_PERMISSIONS.inventory}>
              <StorekeeperDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;