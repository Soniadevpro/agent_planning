import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Layout
import AppLayout from './components/layout/AppLayout';

// Routes protégées
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Routes protégées (utilisateurs connectés) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Routes protégées - Placeholder pour les futures pages */}
          <Route path="/shifts" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Page des créneaux (à venir)</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/exchanges" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Page des échanges (à venir)</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout>
                <div>Page de profil (à venir)</div>
              </AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Routes d'administration */}
          <Route path="/admin" element={
            <AdminRoute>
              <AppLayout>
                <div>Page d'administration (à venir)</div>
              </AppLayout>
            </AdminRoute>
          } />
          
          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Route pour les pages non trouvées */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
