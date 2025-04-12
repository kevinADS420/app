import axios from 'axios';

const API_BASE_URL = 'https://backendhuertomkt.onrender.com';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Importante para CORS con credenciales
});

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token encontrado en localStorage:', token);
    
    if (token) {
      // Asegurarse de que el token se envía con el formato correcto
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Headers configurados:', config.headers);
    } else {
      console.log('No hay token disponible en localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Error en el interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la respuesta:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('Error de autenticación (401) detectado');
      // Si el error es de autenticación, limpiar el localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      
      // Redirigir al login si no estamos ya en esa página
      if (!window.location.pathname.includes('/inicio-section')) {
        window.location.href = '/inicio-section';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 