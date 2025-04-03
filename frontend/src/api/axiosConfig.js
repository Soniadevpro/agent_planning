import axios from 'axios';

// Définir l'URL de base de l'API backend
// En développement, cette URL vient de la variable d'environnement VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer une instance axios avec la configuration de base
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si un token existe, l'ajouter aux headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    // Retourner directement la réponse en cas de succès
    return response;
  },
  (error) => {
    // Gérer les erreurs courantes
    const originalRequest = error.config;

    // Si l'erreur est 401 (non autorisé) et que ce n'est pas une tentative de connexion
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Le token a expiré ou est invalide
      // On pourrait ici implémenter un refresh token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;