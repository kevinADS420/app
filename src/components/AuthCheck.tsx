import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

const AuthCheck: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<string>('Verificando...');
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Obtener el token del localStorage
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        
        if (!storedToken) {
          setAuthStatus('No hay token en localStorage');
          return;
        }
        
        console.log('Token encontrado en localStorage:', storedToken);
        
        // Intentar verificar la autenticación
        const response = await axiosInstance.get('/auth/check');
        console.log('Respuesta de verificación:', response.data);
        setAuthStatus('Autenticado: ' + JSON.stringify(response.data));
      } catch (err: any) {
        console.error('Error al verificar autenticación:', err);
        setError(err.response?.data?.reason || err.message || 'Error desconocido');
        setAuthStatus('No autenticado');
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Verificación de Autenticación</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Estado de Autenticación:</h3>
        <p>{authStatus}</p>
      </div>
      
      {error && (
        <div style={{ marginBottom: '20px', color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Token en localStorage:</h3>
        <p style={{ wordBreak: 'break-all' }}>
          {token ? token : 'No hay token'}
        </p>
      </div>
      
      <button 
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userType');
          window.location.reload();
        }}
        style={{ 
          padding: '10px 15px', 
          backgroundColor: '#ff4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default AuthCheck; 