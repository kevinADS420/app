import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../../style/GoogleCallback.css';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verificando');
  const [message, setMessage] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener el código de autorización y otros parámetros de la URL
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        console.log('Parámetros de callback:', { code, state, error });

        if (error) {
          console.error('Error en callback de Google:', error);
          setStatus('error');
          setMessage(`Error en la autenticación: ${error}`);
          setTimeout(() => {
            navigate('/inicio-section');
          }, 3000);
          return;
        }

        if (!code) {
          console.error('No se recibió el código de autorización');
          setStatus('error');
          setMessage('No se recibió el código de autorización necesario');
          setTimeout(() => {
            navigate('/inicio-section');
          }, 3000);
          return;
        }

        // Verificar el estado de autenticación
        const checkAuth = async () => {
          try {
            console.log('Verificando estado de autenticación después del callback...');
            
            // Primero intentamos obtener datos directamente del URL
            // A veces el backend incluye datos en el fragmento de URL (después de #)
            const hashParams = new URLSearchParams(location.hash.substring(1));
            const fragmentToken = hashParams.get('token');
            
            if (fragmentToken) {
              console.log('Token encontrado en fragmento URL');
              localStorage.setItem('token', fragmentToken);
              
              // También buscar userType y userData si están en el fragmento
              const userType = hashParams.get('userType');
              if (userType) {
                localStorage.setItem('userType', userType);
              }
              
              const userData = hashParams.get('userData');
              if (userData) {
                try {
                  localStorage.setItem('user', userData);
                } catch (err) {
                  console.error('Error al guardar datos de usuario:', err);
                }
              }
              
              // Crear evento de login y redireccionar
              const userLoginEvent = new Event('userLogin');
              window.dispatchEvent(userLoginEvent);
              
              setStatus('exitoso');
              setMessage('Autenticación exitosa! Redirigiendo...');
              setTimeout(() => navigate('/dashboard'), 1500);
              return;
            }
            
            // Si no encontramos datos en el fragmento, intentamos con el endpoint de verificación
            // Primero sin credenciales
            const response = await fetch('https://backendhuertomkt.onrender.com/auth/check', {
              method: 'GET'
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log('Datos de verificación:', data);
              
              if (data.authenticated) {
                if (data.token) {
                  localStorage.setItem('token', data.token);
                }
                
                localStorage.setItem('userType', data.userType || 'customer');
                
                if (data.user) {
                  localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                const userLoginEvent = new Event('userLogin');
                window.dispatchEvent(userLoginEvent);
                
                setStatus('exitoso');
                setMessage('Autenticación exitosa! Redirigiendo...');
                setTimeout(() => navigate('/dashboard'), 1500);
                return;
              }
            }
            
            // Si la verificación normal falla, intentamos simular un login manual con el código recibido
            try {
              console.log('Intentando autenticación manual con el código recibido');
              const loginResult = await fetch('https://backendhuertomkt.onrender.com/auth/google/token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
              });
              
              if (loginResult.ok) {
                const tokenData = await loginResult.json();
                console.log('Datos de login manual:', tokenData);
                
                if (tokenData.token) {
                  localStorage.setItem('token', tokenData.token);
                  
                  if (tokenData.userType) {
                    localStorage.setItem('userType', tokenData.userType);
                  }
                  
                  if (tokenData.user) {
                    localStorage.setItem('user', JSON.stringify(tokenData.user));
                  }
                  
                  const userLoginEvent = new Event('userLogin');
                  window.dispatchEvent(userLoginEvent);
                  
                  setStatus('exitoso');
                  setMessage('Autenticación exitosa! Redirigiendo...');
                  setTimeout(() => navigate('/dashboard'), 1500);
                  return;
                }
              } else {
                console.error('Error en login manual:', await loginResult.text());
              }
            } catch (loginError) {
              console.error('Error en intento de login manual:', loginError);
            }
            
            // Como último recurso, enviamos el código de nuevo al backend y esperamos redirección
            console.log('Intentando redirección con código original...');
            window.location.href = `https://backendhuertomkt.onrender.com/auth/google/callback?code=${code}`;
          } catch (error) {
            console.error('Error general al verificar autenticación:', error);
            setStatus('error');
            setMessage('Error al verificar tu autenticación. Por favor intenta iniciar sesión de nuevo.');
            setTimeout(() => navigate('/inicio-section'), 3000);
          }
        };

        // Esperar un momento para que el backend procese la autenticación
        // y luego verificar el estado
        setTimeout(checkAuth, 2000);
      } catch (error) {
        console.error('Error en el callback de Google:', error);
        setStatus('error');
        setMessage('Error inesperado durante el proceso de autenticación');
        setTimeout(() => {
          navigate('/inicio-section');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <div className="google-callback-container">
      <div className={`callback-box ${status}`}>
        {status === 'verificando' && (
          <>
            <div className="spinner"></div>
            <h2>Procesando autenticación</h2>
            <p>Por favor espera mientras completamos tu inicio de sesión con Google.</p>
          </>
        )}
        
        {status === 'exitoso' && (
          <>
            <div className="success-icon">✓</div>
            <h2>¡Autenticación exitosa!</h2>
            <p>{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="error-icon">⚠️</div>
            <h2>Error en la autenticación</h2>
            <p>{message}</p>
            <button 
              onClick={() => navigate('/inicio-section')}
              className="login-redirect-btn"
            >
              Volver a inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default GoogleCallback;