import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verificando');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener el código de autorización de la URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (!code) {
          console.error('No se recibió el código de autorización');
          setStatus('error');
          setTimeout(() => {
            navigate('/inicio-section');
          }, 2000);
          return;
        }

        // Verificar el estado de autenticación
        const checkAuth = async () => {
          try {
            const response = await fetch('https://backendhuertomkt.onrender.com/auth/check', {
              method: 'GET',
              credentials: 'include'
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log('Estado de autenticación:', data);
              
              // Si el usuario está autenticado, redirigir al dashboard
              if (data.authenticated) {
                setStatus('exitoso');
                localStorage.setItem('userType', data.userType || 'customer');
                setTimeout(() => {
                  navigate('/dashboard');
                }, 1500);
              } else {
                setStatus('error');
                setTimeout(() => {
                  navigate('/inicio-section');
                }, 2000);
              }
            } else {
              setStatus('error');
              setTimeout(() => {
                navigate('/inicio-section');
              }, 2000);
            }
          } catch (error) {
            console.error('Error al verificar autenticación:', error);
            setStatus('error');
            setTimeout(() => {
              navigate('/inicio-section');
            }, 2000);
          }
        };

        // Esperar un momento para que el backend procese la autenticación
        setTimeout(checkAuth, 1000);
      } catch (error) {
        console.error('Error en el callback de Google:', error);
        setStatus('error');
        setTimeout(() => {
          navigate('/inicio-section');
        }, 2000);
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
      {status === 'verificando' && (
        <>
          <h2>Procesando autenticación...</h2>
          <p>Por favor, espera un momento mientras completamos tu inicio de sesión.</p>
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </>
      )}
      
      {status === 'exitoso' && (
        <>
          <h2>¡Autenticación exitosa!</h2>
          <p>Redirigiendo al dashboard...</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <h2>Error en la autenticación</h2>
          <p>Hubo un problema al procesar tu inicio de sesión. Serás redirigido a la página de inicio.</p>
        </>
      )}
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default GoogleCallback;