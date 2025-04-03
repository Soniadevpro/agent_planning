import { jwtDecode } from 'jwt-decode';
import axiosInstance from './axiosConfig';

const authService = {
  // Connexion utilisateur
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post('/token/', { username, password });
      
      // Stocker les tokens
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Décoder le token pour obtenir les informations utilisateur
      const userInfo = jwtDecode(response.data.access);
      
      return {
        id: userInfo.user_id,
        username: userInfo.username,
        is_admin: userInfo.is_admin
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },
  
  // Déconnexion utilisateur
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  // Rafraîchir le token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Pas de token de rafraîchissement');
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
  
  // Récupérer le profil utilisateur
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get('/users/me/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }
};

export default authService;