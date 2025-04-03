import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../api/auth';
import { jwtDecode } from 'jwt-decode';

// Création du contexte d'authentification
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // État pour suivre l'utilisateur connecté
  const [currentUser, setCurrentUser] = useState(null);
  // État pour suivre si l'authentification est en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour suivre les erreurs d'authentification
  const [error, setError] = useState(null);
  
  // Effet pour charger l'utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const initAuth = () => {
      try {
        // Vérifier si un token existe
        const token = localStorage.getItem('token');
        if (token) {
          // Vérifier si le token n'est pas expiré
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp > currentTime) {
            // Extraire les informations utilisateur du token
            setCurrentUser({
              id: decoded.user_id,
              username: decoded.username,
              is_admin: decoded.is_admin,
              // Vous pouvez ajouter d'autres propriétés du token si nécessaire
            });
          } else {
            // Token expiré, supprimer du localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', err);
        setError('Une erreur est survenue lors de l\'initialisation de l\'authentification');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Fonction de connexion
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(username, password);
      const decoded = jwtDecode(data.access);
      
      setCurrentUser({
        id: decoded.user_id,
        username: decoded.username,
        is_admin: decoded.is_admin,
        // Vous pouvez ajouter d'autres propriétés du token si nécessaire
      });
      
      return true;
    } catch (err) {
      console.error('Erreur lors de la connexion:', err);
      setError(err.response?.data?.detail || 'Une erreur est survenue lors de la connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };
  
  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      return true;
    } catch (err) {
      console.error('Erreur lors du rafraîchissement du token:', err);
      logout(); // Déconnexion si le refresh token a expiré
      return false;
    }
  };
  
  // Fournir le contexte aux composants enfants
  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      error, 
      login, 
      logout, 
      refreshToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};