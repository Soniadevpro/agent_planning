import axiosInstance from './axiosConfig';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Connexion utilisateur
  login: async (username, password) => {
    const response = await axiosInstance.post('/token/', { username, password });
    
    // Stocker le token d'accès dans le localStorage
    localStorage.setItem('token', response.data.access);
    
    // Stocker le refresh token
    localStorage.setItem('refreshToken', response.data.refresh);
    
    return response.data;
  },
  
  // Déconnexion utilisateur
  logout: () => {
    // Supprimer les tokens du localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  // Rafraîchir le token d'accès
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token non disponible');
    }
    
    try {
      const response = await axiosInstance.post('/token/refresh/', {
        refresh: refreshToken
      });
      
      // Mettre à jour le token d'accès
      localStorage.setItem('token', response.data.access);
      
      return response.data;
    } catch (error) {
      // En cas d'erreur, déconnecter l'utilisateur
      authService.logout();
      throw error;
    }
  },
  
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Décoder le token pour vérifier s'il est expiré
      const decoded = jwtDecode(token);
      
      // Vérifier l'expiration du token (exp est en secondes)
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },
  
  // Obtenir les informations de l'utilisateur à partir du token
  getUserInfo: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      // Décoder le token pour obtenir les informations utilisateur
      return jwtDecode(token);
    } catch {
      return null;
    }
  },
  
  // Récupérer le profil complet de l'utilisateur via l'API
  getUserProfile: async () => {
    const response = await axiosInstance.get('/users/me/');
    return response.data;
  }
};

export default authService;