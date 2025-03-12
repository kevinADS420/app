import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../style/UserProfile.css';

// Crear un evento personalizado para el cierre de sesión
const userLogoutEvent = new Event('userLogout');

interface UserData {
  id_cliente: number;
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono?: string;
}

function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const loadUserData = () => {
    const userStr = localStorage.getItem('user');
    console.log('Loading user data:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.Nombres && user.Apellidos && user.Email) {
          setUserData(user);
        } else {
          console.error('Datos de usuario incompletos');
          handleLogout();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    } else {
      console.error('No user data found');
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
    setUserData(null);
    setIsOpen(false);
    window.dispatchEvent(userLogoutEvent);
    navigate('/inicio-section');
  };

  // Si no hay datos de usuario, no mostrar nada
  if (!userData) {
    return null;
  }

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

  return (
    <div className="user-profile-container">
      <button 
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú de usuario"
      >
        <span className="user-initials">
          {userData.Nombres.charAt(0)}{userData.Apellidos.charAt(0)}
        </span>
      </button>
      
      {isOpen && (
        <>
          <div className="profile-dropdown">
            <div className="profile-header">
              <h3>{userData.Nombres} {userData.Apellidos}</h3>
              <p>{userData.Email}</p>
              <p className="user-id">ID: {userData.id_cliente}</p>
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