import React, { useEffect, CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay un token en la URL (después de la autenticación con Google)
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const userType = urlParams.get('userType'); // Obtener el tipo de usuario
        const userData = urlParams.get('userData'); // Obtener los datos del usuario
        
        if (token) {
          // Guardar el token en localStorage
          localStorage.setItem('token', token); // Cambiado de 'authToken' a 'token' para consistencia
          
          // Si tenemos el tipo de usuario, guardarlo
          if (userType) {
            localStorage.setItem('userType', userType);
          }
          
          // Si tenemos datos del usuario, guardarlos
          if (userData) {
            try {
              const parsedUserData = JSON.parse(decodeURIComponent(userData));
              localStorage.setItem('user', JSON.stringify(parsedUserData));
            } catch (error) {
              console.error('Error parsing user data:', error);
            }
          }

          // Disparar evento de login
          window.dispatchEvent(new Event('userLogin'));
          
          // Redirigir a la página principal
          navigate('/');
          return;
        }
        
        // Si no hay token, verificar el estado de autenticación
        const response = await fetch('https://backendhuertomkt.onrender.com/auth/check', {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            navigate('/');
            return;
          }
        }
        
        // Si llegamos aquí, redirigir al login
        navigate('/inicio-section');
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        navigate('/inicio-section');
      }
    };

    checkAuth();
  }, [navigate, location]);

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  };

  const loadingTextStyle: CSSProperties = {
    fontSize: '1.2rem',
    color: '#333',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <p style={loadingTextStyle}>Procesando autenticación...</p>
    </div>
  );
};

export default GoogleCallback; 