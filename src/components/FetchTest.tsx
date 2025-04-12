import React, { useState, useEffect } from 'react';

const FetchTest = () => {
  const [token, setToken] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    console.log('Token encontrado en localStorage:', storedToken);
  }, []);

  const checkAuthWithFetch = async () => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const storedToken = localStorage.getItem('token');
      console.log('Token a enviar:', storedToken);

      if (!storedToken) {
        throw new Error('No hay token disponible');
      }

      // Verificar que el token tenga el formato correcto
      if (!storedToken.startsWith('Bearer ')) {
        console.log('Agregando prefijo Bearer al token');
        const tokenWithBearer = `Bearer ${storedToken}`;
        console.log('Token con Bearer:', tokenWithBearer);
        
        const response = await fetch('https://backendhuertomkt.onrender.com/auth/check', {
          method: 'GET',
          headers: {
            'Authorization': tokenWithBearer,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        console.log('Headers enviados:', {
          'Authorization': tokenWithBearer,
          'Content-Type': 'application/json',
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Error en la autenticación');
        }

        setResponse(data);
      } else {
        // El token ya tiene el prefijo Bearer
        const response = await fetch('https://backendhuertomkt.onrender.com/auth/check', {
          method: 'GET',
          headers: {
            'Authorization': storedToken,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        console.log('Headers enviados:', {
          'Authorization': storedToken,
          'Content-Type': 'application/json',
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Error en la autenticación');
        }

        setResponse(data);
      }
    } catch (err) {
      console.error('Error en la petición:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setToken(null);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Prueba de Autenticación con Fetch</h2>
      
      <div className="mb-4">
        <p className="font-semibold">Token actual:</p>
        <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
          {token || 'No hay token'}
        </pre>
      </div>

      <div className="space-x-4">
        <button
          onClick={checkAuthWithFetch}
          disabled={loading || !token}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Verificando...' : 'Probar Autenticación'}
        </button>

        <button
          onClick={clearToken}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Limpiar Token
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-blue-500">
          Verificando autenticación...
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <p className="font-bold">Respuesta:</p>
          <pre className="mt-2 overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FetchTest; 