import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../style/UserProfile.css';
import axios from 'axios';

// Crear un evento personalizado para el cierre de sesión
const userLogoutEvent = new Event('userLogout');

interface UserData {
  id_cliente?: number;
  id_proveedor?: number;
  id_admin?: number;
  Email: string;
  Nombres: string;
  Apellidos: string;
  role?: 'customer' | 'proveedor' | 'admin';
  googleId?: string;
}

function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('👋 Ejecutando logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUserData(null);
    window.dispatchEvent(new Event('userLogout'));
    navigate('/');
  };

  const loadUserData = async () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    // Si no hay token, hacer logout
    if (!token) {
      handleLogout();
      return;
    }

    // Configurar axios con el token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    try {
      let response;
      const baseUrl = 'https://backendhuertomkt.onrender.com';

      // Seleccionar la ruta según el tipo de usuario
      switch(userType) {
        case 'proveedor':
          response = await axios.get(`${baseUrl}/proveedor/profile`);
          if (response.data.status === 'success' && response.data.data) {
            const proveedorData = response.data.data;
            const normalizedUser: UserData = {
              id_proveedor: proveedorData.id_proveedor,
              Nombres: proveedorData.nombres,
              Apellidos: proveedorData.apellidos,
              Email: proveedorData.Email,
              role: 'proveedor' as const
            };
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            setUserData(normalizedUser);
          }
          break;
          
        case 'admin':
          response = await axios.get(`${baseUrl}/admin/profile`);
          if (response.data.status === 'success' && response.data.data) {
            const adminData = response.data.data;
            const normalizedUser: UserData = {
              id_admin: adminData.id_admin,
              Nombres: adminData.nombres,
              Apellidos: adminData.apellidos,
              Email: adminData.Email,
              role: 'admin' as const
            };
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            setUserData(normalizedUser);
          }
          break;
          
        case 'customer':
          response = await axios.get(`${baseUrl}/customer/profile`);
          if (response.data.status === 'success' && response.data.data) {
            const customerData = response.data.data;
            const normalizedUser: UserData = {
              id_cliente: customerData.id_cliente,
              Nombres: customerData.Nombres,
              Apellidos: customerData.Apellidos,
              Email: customerData.Email,
              role: 'customer' as const
            };
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            setUserData(normalizedUser);
          }
          break;
          
        default:
          console.error('Tipo de usuario no reconocido:', userType);
          handleLogout();
          return;
      }

      if (!response || !response.data) {
        console.error('No se pudieron obtener los datos del usuario');
        handleLogout();
        return;
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      handleLogout();
    }
  };

  useEffect(() => {
    console.log('🔄 Iniciando carga de datos de usuario...');
    loadUserData();

    // Escuchar eventos de login/logout
    const handleLogin = () => {
      console.log('👋 Evento de login recibido');
      loadUserData();
    };

    window.addEventListener('userLogin', handleLogin);
    window.addEventListener('userLogout', handleLogout);

    return () => {
      window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('userLogout', handleLogout);
    };
  }, []);

  // Si no hay datos de usuario, no mostrar nada
  if (!userData) {
    return null;
  }

  // Mantenemos el menú original
  const menuItems = [
    {
      icon: '🛒',
      label: 'Mis Pedidos',
      path: '/mis-pedidos'
    },
    {
      icon: '❤️',
      label: 'Favoritos',
      path: '/favoritos'
    },
    {
      icon: '⚙️',
      label: 'Editar Perfil',
      path: '/editar-perfil'
    },
    {
      icon: '📋',
      label: 'Historial de Compras',
      path: '/historial'
    }
  ];

  // Para mantener compatibilidad con la estructura anterior
  const userDisplay = {
    id: userData.id_cliente || 0,
    nombre: userData.Nombres,
    apellido: userData.Apellidos,
    email: userData.Email
  };

  return (
    <div className="user-profile-container">
      <button 
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú de usuario"
      >
        <span className="user-initials">
          {userDisplay.nombre.charAt(0)}{userDisplay.apellido.charAt(0)}
        </span>
      </button>
      
      {isOpen && (
        <>
          <div className="profile-dropdown">
            <div className="profile-header">
              <h3>{userDisplay.nombre} {userDisplay.apellido}</h3>
              <p className="user-id">Tipo: {userData.role || 'Usuario'}</p>
            </div>

            <div className="profile-menu">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="profile-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="profile-actions">
              <button 
                onClick={handleLogout} 
                className="logout-button"
              >
                <span>🚪</span>
                Cerrar Sesión
              </button>
            </div>
          </div>
          <div 
            className="profile-overlay"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default UserProfile;