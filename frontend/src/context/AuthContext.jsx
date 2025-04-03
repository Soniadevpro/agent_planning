import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Récupérer le profil utilisateur complet
          const userProfile = await authService.getUserProfile();
          setCurrentUser(userProfile);
        } catch  {
          // En cas d'erreur (token invalide, etc.), déconnecter
          authService.logout();
          navigate('/login');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const userInfo = await authService.login(username, password);
      setCurrentUser(userInfo);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      return true;
    } catch {
      logout();
      return false;
    }
  };

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