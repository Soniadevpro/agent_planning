// frontend/src/components/routes/AdminRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Si l'authentification est en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  // Si l'utilisateur n'est pas connecté ou n'est pas administrateur, rediriger
  if (!currentUser || !currentUser.is_admin) {
    return <Navigate to="/dashboard" />;
  }
  
  // Si l'utilisateur est un administrateur, afficher le contenu de la route
  return children;
};

export default AdminRoute;