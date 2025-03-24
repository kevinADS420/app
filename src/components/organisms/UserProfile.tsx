import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../style/UserProfile.css';
import axios from 'axios';

// Crear un evento personalizado para el cierre de sesión
const userLogoutEvent = new Event('userLogout');

interface UserData {
  id_cliente?: number;
  id_proveedor?: number;
  Nombres?: string;
  nombres?: string;
  Apellidos?: string;
  apellidos?: string;
  Email?: string;
  Telefono?: string;
}

function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const loadUserData = async () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    console.log('Loading user data:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // Comprobamos si es proveedor o cliente y normalizamos
        if (user) {
          const normalizedUser: UserData = {
            id_cliente:   user.id_cliente,
            id_proveedor: user.id_proveedor,
            Nombres:      user.Nombres        || user.nombres    || '',
            Apellidos:    user.Apellidos      || user.apellidos  || '',
            Email:        user.Email          || '',
            Telefono:     user.Telefono
          };
          
          // Verificamos que tengamos la información mínima necesaria
          if (normalizedUser.Nombres && normalizedUser.Apellidos && normalizedUser.Email) {
            setUserData(normalizedUser);
            return;
          } else {
            console.error('Datos de usuario incompletos');
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.error('No user data found');
    }
    
    // Si llegamos aquí, intentamos cargar desde la API
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        let response;
        if (userType === 'customer') {
          response = await axios.get('http://localhost:10101/customer/profile');
          
          // Si la respuesta no contiene datos completos, intentamos con el email
          if (!response.data.Nombres && localStorage.getItem('user')) {
            try {
              const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
              if (storedUser.Email) {
                const userDetailResponse = await axios.get(
                  `http://localhost:10101/customer/email/${encodeURIComponent(storedUser.Email)}`
                );
                response = userDetailResponse;
              }
            } catch (detailError) {
              console.error('Error fetching detailed user data:', detailError);
            }
          }
        } else if (userType === 'proveedor') {
          response = await axios.get('http://localhost:10101/proveedor/profile');
          
          // Si la respuesta no contiene datos completos, intentamos con el email
          if (!response.data.nombres && localStorage.getItem('user')) {
            try {
              const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
              if (storedUser.Email) {
                const userDetailResponse = await axios.get(
                  `http://localhost:10101/proveedor/email/${encodeURIComponent(storedUser.Email)}`
                );
                response = userDetailResponse;
              }
            } catch (detailError) {
              console.error('Error fetching detailed user data:', detailError);
            }
          }
        }
        
        if (response && response.data) {
          const apiUser = response.data;
          
          // Normalizamos los datos que vienen de la API
          const normalizedUser: UserData = {
            id_cliente:   apiUser.id_cliente,
            id_proveedor: apiUser.id_proveedor,
            Nombres:      apiUser.Nombres       || apiUser.nombres    || '',
            Apellidos:    apiUser.Apellidos     || apiUser.apellidos  || '',
            Email:        apiUser.Email         || '',
            Telefono:     apiUser.Telefono
          };
          
          // Guardamos en localStorage y estado
          localStorage.setItem('user', JSON.stringify(normalizedUser));
          setUserData(normalizedUser);
          return;
        }
      } catch (error) {
        console.error('Error fetching user data from API:', error);
      }
    }
    
    // Solo hacemos logout si no hay token
    if (!token) {
      handleLogout();
    }
  };

  useEffect(() => {
    loadUserData();

    const handleUserLogin = () => {
      console.log('User login event detected');
      loadUserData();
    };

    const handleUserUpdate = () => {
      loadUserData();
    };

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('storage', loadUserData);
    window.addEventListener('userUpdate', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('storage', loadUserData);
      window.removeEventListener('userUpdate', handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUserData(null);
    setIsOpen(false);
    window.dispatchEvent(userLogoutEvent);
    navigate('/inicio-section');
  };

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
      path: '/configuracion'
    },
    {
      icon: '📋',
      label: 'Historial de Compras',
      path: '/historial'
    }
  ];

  // Para mantener compatibilidad con la estructura anterior
  const userDisplay = {
    id: userData.id_cliente || userData.id_proveedor || 0,
    nombre: userData.Nombres || '',
    apellido: userData.Apellidos || '',
    email: userData.Email || ''
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
              <p>{userDisplay.email}</p>
              <p className="user-id">ID: {userDisplay.id}</p>
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