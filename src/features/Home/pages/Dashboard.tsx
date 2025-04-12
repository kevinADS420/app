import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../style/Dashboard.css'; // Agregar un archivo CSS para estilizar el dashboard

interface UserData {
  user?: {
    Nombres?: string;
    nombres?: string;
    Apellidos?: string;
    apellidos?: string;
    Email?: string;
  };
  userType?: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar el estado de autenticación usando la nueva ruta
    const checkAuthStatus = async () => {
      try {
        console.log('Verificando estado de autenticación...');
        const response = await fetch('https://backendhuertomkt.onrender.com/auth/check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('Respuesta de verificación de autenticación:', response.status);
        
        if (response.ok) {
          const authData = await response.json();
          console.log('Datos de autenticación:', authData);
          
          if (authData.authenticated) {
            // Usuario autenticado, intentar obtener datos completos
            try {
              const userStr = localStorage.getItem('user');
              const userType = authData.userType || localStorage.getItem('userType') || 'customer';
              
              // Actualizar userType en localStorage si viene del servidor
              if (authData.userType) {
                localStorage.setItem('userType', authData.userType);
              }
              
              if (userStr) {
                // Si ya tenemos datos en localStorage, usarlos
                const user = JSON.parse(userStr);
                setUserData({
                  user: {
                    Nombres: user.Nombres || user.nombres || '',
                    Apellidos: user.Apellidos || user.apellidos || '',
                    Email: user.Email || ''
                  },
                  userType: userType
                });
                setLoading(false);
              } else {
                // Si no hay datos de usuario en localStorage, obtenerlos del servidor
                fetchUserDataFromServer(localStorage.getItem('token') || '', userType);
              }
            } catch (error) {
              console.error('Error al procesar datos de usuario:', error);
              setAuthError('Error al procesar los datos del usuario');
              setLoading(false);
            }
          } else {
            // No autenticado según el servidor
            setAuthError('Sesión no válida. Por favor inicie sesión nuevamente.');
            setTimeout(() => navigate('/inicio-section'), 2000);
          }
        } else {
          // Error en la respuesta del servidor
          const errorData = await response.text();
          console.error('Error en verificación de autenticación:', errorData);
          setAuthError('Error de autenticación. Por favor inicie sesión nuevamente.');
          setTimeout(() => navigate('/inicio-section'), 2000);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setAuthError('Error de conexión. Por favor inténtelo de nuevo más tarde.');
        setLoading(false);
      }
    };

    const fetchUserDataFromServer = async (token: string, userType: string) => {
      try {
        const baseUrl = 'https://backendhuertomkt.onrender.com';
        let endpoint = '';

        if (userType === 'customer') {
          endpoint = '/customer/profile';
        } else if (userType === 'proveedor') {
          endpoint = '/proveedor/profile';
        } else {
          throw new Error('Tipo de usuario desconocido');
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            user: {
              Nombres: data.Nombres || data.nombres || '',
              Apellidos: data.Apellidos || data.apellidos || '',
              Email: data.Email || ''
            },
            userType: userType
          });
          // Guardar en localStorage para futuras referencias
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          throw new Error('Error al obtener datos del usuario');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario desde el servidor:', error);
        setAuthError('Error al cargar datos de usuario. Por favor inicie sesión nuevamente.');
        setTimeout(() => navigate('/inicio-section'), 2000);
      } finally {
        setLoading(false);
      }
    };

    // Verificar estado de autenticación
    checkAuthStatus();
  }, [navigate]);

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    
    // Crear evento personalizado para notificar cierre de sesión
    const userLogoutEvent = new Event('userLogout');
    window.dispatchEvent(userLogoutEvent);
    
    // Redirigir al inicio
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }
  
  if (authError) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Error de autenticación</h2>
        <p>{authError}</p>
        <button onClick={() => navigate('/inicio-section')} className="error-button">
          Ir a inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      
      <div className="dashboard-content">
        {userData && (
          <div className="user-info-card">
            <div className="user-avatar">
              {userData.user?.Nombres?.charAt(0) || ''}
              {userData.user?.Apellidos?.charAt(0) || ''}
            </div>
            <div className="user-details">
              <h2>Bienvenido, {userData.user?.Nombres || 'Usuario'} {userData.user?.Apellidos || ''}</h2>
              <p className="user-email">{userData.user?.Email || ''}</p>
              <p className="user-type">Tipo de usuario: <span>{userData.userType === 'proveedor' ? 'Proveedor' : 'Cliente'}</span></p>
            </div>
          </div>
        )}
        
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Mis Pedidos</h3>
            <p>Consulta el estado de tus pedidos recientes</p>
            <button className="card-button">Ver Pedidos</button>
          </div>
          
          <div className="dashboard-card">
            <h3>Mi Perfil</h3>
            <p>Actualiza tu información personal</p>
            <button className="card-button" onClick={() => navigate('/configuracion')}>Editar Perfil</button>
          </div>
          
          {userData?.userType === 'proveedor' && (
            <div className="dashboard-card">
              <h3>Mis Productos</h3>
              <p>Administra tu catálogo de productos</p>
              <button className="card-button" onClick={() => navigate('/RegistroProductos')}>Gestionar Productos</button>
            </div>
          )}
          
          <div className="dashboard-card">
            <h3>Favoritos</h3>
            <p>Accede a tus productos favoritos</p>
            <button className="card-button">Ver Favoritos</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;