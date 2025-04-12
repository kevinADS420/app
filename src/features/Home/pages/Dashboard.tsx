import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://backendhuertomkt.onrender.com/dashboard', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          // Si no hay datos de usuario, redirigir al inicio de sesión
          navigate('/inicio-section');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        navigate('/inicio-section');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://backendhuertomkt.onrender.com/logout', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Limpiar cualquier dato de sesión local
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        // Redirigir al inicio
        navigate('/');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      
      {userData && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '1rem'
        }}>
          <h2>Bienvenido, {userData.user?.Nombres || 'Usuario'}</h2>
          <p>Tipo de usuario: {userData.userType || 'Cliente'}</p>
          
          <div style={{ marginTop: '2rem' }}>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
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

export default Dashboard; 