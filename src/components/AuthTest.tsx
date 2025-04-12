import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axios';

const AuthTest: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [headers, setHeaders] = useState<any>(null);

  useEffect(() => {
    // Obtener el token del localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    // Obtener los headers actuales
    const currentHeaders = axiosInstance.defaults.headers;
    setHeaders(currentHeaders);
    
    console.log('Token en localStorage:', storedToken);
    console.log('Headers actuales:', currentHeaders);
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      // Obtener el token del localStorage
      const storedToken = localStorage.getItem('token');
      console.log('Token usado para la petición:', storedToken);
      
      // Hacer la petición con axios normal para ver los headers
      const response = await axios.get('https://backendhuertomkt.onrender.com/auth/check', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });
      
      console.log('Respuesta de autenticación:', response.data);
      setResponse(response.data);
    } catch (err: any) {
      console.error('Error al verificar autenticación:', err);
      setError(err.response?.data?.reason || err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const checkAuthWithInstance = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      // Hacer la petición con la instancia de axios
      const response = await axiosInstance.get('/auth/check');
      
      console.log('Respuesta de autenticación (con instancia):', response.data);
      setResponse(response.data);
    } catch (err: any) {
      console.error('Error al verificar autenticación (con instancia):', err);
      setError(err.response?.data?.reason || err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setToken(null);
    alert('Token eliminado del localStorage');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Prueba de Autenticación</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Token en localStorage:</h3>
        <p style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
          {token ? token : 'No hay token'}
        </p>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Headers configurados:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(headers, null, 2)}
        </pre>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={checkAuth}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          Probar con axios normal
        </button>
        
        <button 
          onClick={checkAuthWithInstance}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          Probar con instancia de axios
        </button>
        
        <button 
          onClick={clearToken}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Eliminar Token
        </button>
      </div>
      
      {loading && <p>Cargando...</p>}
      
      {error && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffebee', borderRadius: '5px', color: 'red' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
          <h3>Respuesta:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthTest; 