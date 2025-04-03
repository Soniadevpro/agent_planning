// frontend/src/components/routes/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Si l'authentification est en cours de chargement, afficher un indicateur de chargement
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Si l'utilisateur est connecté, afficher le contenu de la route
  return children;
};

export default ProtectedRoute;