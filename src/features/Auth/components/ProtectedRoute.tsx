import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const baseUrl = 'https://backendhuertomkt.onrender.com';
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      let response;
      
      // Seleccionar la ruta según el tipo de usuario
      switch(userType) {
        case 'proveedor':
          response = await axios.get(`${baseUrl}/proveedor/profile`);
          break;
        case 'admin':
          response = await axios.get(`${baseUrl}/admin/profile`);
          break;
        case 'customer':
          response = await axios.get(`${baseUrl}/customer/profile`);
          break;
        default:
          throw new Error('Tipo de usuario no reconocido');
      }

      if (response && response.data) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Mientras verifica la autenticación
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/inicio-section" />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute; 