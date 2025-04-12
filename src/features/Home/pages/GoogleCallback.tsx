import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener el código de autorización de la URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          console.error('No se recibió el código de autorización');
          navigate('/inicio-section');
          return;
        }

        // Construir la URL del callback con el código
        const callbackUrl = `https://backendhuertomkt.onrender.com/auth/google/callback?code=${code}`;
        
        // Redirigir al backend para procesar la autenticación
        window.location.href = callbackUrl;
      } catch (error) {
        console.error('Error en el callback de Google:', error);
        navigate('/inicio-section');
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2>Procesando autenticación...</h2>
      <p>Por favor, espera un momento mientras completamos tu inicio de sesión.</p>
    </div>
  );
}

export default GoogleCallback; 