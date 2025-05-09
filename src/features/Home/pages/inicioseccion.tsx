import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../style/Registro.css';
import axios from 'axios';

// Custom event for user login
const userLoginEvent = new Event('userLogin');

// Base URL para todas las peticiones API
const API_BASE_URL = 'https://backendhuertomkt.onrender.com';

function Login() {
  const [formData, setFormData] = useState({
    Email: '',
    contraseña: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    const fieldMapping: Record<string, string> = {
      email: 'Email',
      Email: 'Email',
      contraseña: 'contraseña'
    };
    
    setFormData({
      ...formData,
      [fieldMapping[id] || id]: value,
    });
    // Clear error message when user starts typing
    if (error) setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Validate email and password
    if (!formData.Email.trim()) {
      setError('El correo electrónico es requerido');
      setLoading(false);
      return;
    }
    
    if (!formData.contraseña.trim()) {
      setError('La contraseña es requerida');
      setLoading(false);
      return;
    }
    
    // Crear un objeto con los datos de login
    const loginData = {
      Email: formData.Email.trim(),
      contraseña: formData.contraseña
    };
    
    // Configuración común para las solicitudes axios
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // Try unified login approach first
    try {
      console.log('Intentando login general...');
      const loginResponse = await axios.post(`${API_BASE_URL}/login`, loginData, axiosConfig);
      
      console.log('Login exitoso:', loginResponse.data);
      
      // Save token in localStorage
      localStorage.setItem('token', loginResponse.data.token);
      
      // Determine user type from the response
      const userType = loginResponse.data.userType || 
                       (loginResponse.data.userData?.id_cliente ? 'customer' : 
                        loginResponse.data.userData?.id_proveedor ? 'proveedor' : 'unknown');
                        
      localStorage.setItem('userType', userType);
      
      // Guardar el ID del usuario según el tipo
      if (userType === 'customer' && loginResponse.data.userData?.id_cliente) {
        localStorage.setItem('userId', loginResponse.data.userData.id_cliente.toString());
      } else if (userType === 'proveedor' && loginResponse.data.userData?.id_proveedor) {
        localStorage.setItem('userId', loginResponse.data.userData.id_proveedor.toString());
      }
      
      // Configure token for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${loginResponse.data.token}`;
      
      // Check if the response already contains user data
      if (loginResponse.data.userData) {
        localStorage.setItem('user', JSON.stringify(loginResponse.data.userData));
      } else {
        // If not, make an additional request to get the data based on user type
        try {
          let userResponse;
          if (userType === 'proveedor') {
            userResponse = await axios.post(`${API_BASE_URL}/proveedor/email`, {
              Email: formData.Email
            }, {
              headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('Datos de usuario proveedor:', userResponse.data);
            
            const userData = {
              id_proveedor: userResponse.data.id_proveedor,
              nombres: userResponse.data.nombres,
              apellidos: userResponse.data.apellidos,
              Email: userResponse.data.Email
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userId', userData.id_proveedor.toString());
          } else if (userType === 'customer') {
            userResponse = await axios.post(`${API_BASE_URL}/customer/email`, {
              Email: formData.Email
            }, {
              headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('Datos de usuario cliente:', userResponse.data);
            
            const userData = {
              id_cliente: userResponse.data.id_cliente,
              Nombres: userResponse.data.Nombres,
              Apellidos: userResponse.data.Apellidos,
              Email: userResponse.data.Email
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userId', userData.id_cliente.toString());
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          // Continue even if we can't get complete data
        }
      }
      
      // Fire successful login event
      window.dispatchEvent(userLoginEvent);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return;
    } catch (generalLoginError) {
      console.log('Login general falló, intentando como admin...', generalLoginError);
      
      // Primero intentar como admin
      try {
        const adminResponse = await axios.post(`${API_BASE_URL}/login/admin`, loginData, axiosConfig);
        
        console.log('Login exitoso como admin:', adminResponse.data);
        
        localStorage.setItem('token', adminResponse.data.token);
        localStorage.setItem('userType', 'admin');
        
        if (adminResponse.data.userData?.id_admin) {
          localStorage.setItem('userId', adminResponse.data.userData.id_admin.toString());
        }
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${adminResponse.data.token}`;
        
        if (adminResponse.data.userData) {
          localStorage.setItem('user', JSON.stringify(adminResponse.data.userData));
        } else {
          try {
            const userResponse = await axios.post(`${API_BASE_URL}/admin/email`, {
              Email: formData.Email
            }, {
              headers: {
                'Authorization': `Bearer ${adminResponse.data.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            console.log('Datos de usuario admin:', userResponse.data);
            
            const userData = {
              id_admin: userResponse.data.id_admin,
              nombres: userResponse.data.nombres,
              apellidos: userResponse.data.apellidos,
              Email: userResponse.data.Email
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userId', userData.id_admin.toString());
          } catch (error) {
            console.error('Error al obtener datos del admin:', error);
          }
        }
        
        window.dispatchEvent(userLoginEvent);
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
        return;
      } catch (adminError) {
        console.log('Login como admin falló, intentando como proveedor...', adminError);
        
        // Si falló como admin, intentar como proveedor
        try {
          const proveedorResponse = await axios.post(`${API_BASE_URL}/login/proveedor`, loginData, axiosConfig);
          
          console.log('Login exitoso como proveedor:', proveedorResponse.data);
          
          localStorage.setItem('token', proveedorResponse.data.token);
          localStorage.setItem('userType', 'proveedor');
          
          if (proveedorResponse.data.userData?.id_proveedor) {
            localStorage.setItem('userId', proveedorResponse.data.userData.id_proveedor.toString());
          }
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${proveedorResponse.data.token}`;
          
          if (proveedorResponse.data.userData) {
            localStorage.setItem('user', JSON.stringify(proveedorResponse.data.userData));
          } else {
            try {
              const userResponse = await axios.get(`${API_BASE_URL}/proveedor/profile`, {
                headers: {
                  'Authorization': `Bearer ${proveedorResponse.data.token}`
                }
              });
              
              console.log('Datos de usuario proveedor:', userResponse.data);
              
              if (userResponse.data.status === 'success' && userResponse.data.data) {
                const userData = {
                  id_proveedor: userResponse.data.data.id_proveedor,
                  nombres: userResponse.data.data.nombres,
                  apellidos: userResponse.data.data.apellidos,
                  Email: userResponse.data.data.Email,
                  telefono: userResponse.data.data.telefono,
                  direccion: userResponse.data.data.direccion
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('userId', userData.id_proveedor.toString());
              } else {
                console.error('La respuesta del servidor no tiene el formato esperado:', userResponse.data);
              }
            } catch (error) {
              console.error('Error al obtener datos del proveedor:', error);
            }
          }
          
          window.dispatchEvent(userLoginEvent);
          
          setSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
          
          return;
        } catch (proveedorError) {
          console.log('Login como proveedor falló, intentando como cliente...', proveedorError);
          
          // Si falló como proveedor, intentar como cliente
          try {
            const customerResponse = await axios.post(`${API_BASE_URL}/login/customer`, loginData, axiosConfig);
            
            console.log('Login exitoso como cliente:', customerResponse.data);
            
            localStorage.setItem('token', customerResponse.data.token);
            localStorage.setItem('userType', 'customer');
            
            if (customerResponse.data.userData?.id_cliente) {
              localStorage.setItem('userId', customerResponse.data.userData.id_cliente.toString());
            }
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${customerResponse.data.token}`;
            
            if (customerResponse.data.userData) {
              localStorage.setItem('user', JSON.stringify(customerResponse.data.userData));
            } else {
              try {
                const userResponse = await axios.post(`${API_BASE_URL}/customer/email`, {
                  Email: formData.Email
                }, {
                  headers: {
                    'Authorization': `Bearer ${customerResponse.data.token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                console.log('Datos de usuario cliente:', userResponse.data);
                
                const userData = {
                  id_cliente: userResponse.data.id_cliente,
                  Nombres: userResponse.data.Nombres,
                  Apellidos: userResponse.data.Apellidos,
                  Email: userResponse.data.Email
                };
                
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('userId', userData.id_cliente.toString());
              } catch (error) {
                console.error('Error al obtener datos del cliente:', error);
              }
            }
            
            window.dispatchEvent(userLoginEvent);
            
            setSuccess(true);
            setTimeout(() => {
              navigate('/');
            }, 2000);
            
            return;
          } catch (customerError) {
            console.error('Error en el login:', customerError);
            setError('Credenciales inválidas. Por favor, intente nuevamente.');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ContenedorRgistro">
      <div className="inicio">
        <h1 className="login-title">Iniciar Sesión</h1>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            ¡Inicio de sesión exitoso! Redirigiendo...
          </div>
        )}
        
        <form id="SaveUsers" onSubmit={handleSubmit}>
          <div className="Inputs">
            <label htmlFor="Email">Correo electrónico</label>
            <input
              type="email"
              id="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
              required
              disabled={loading}
            />
            <label htmlFor="contraseña">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={loading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="Butons">
            <div className="ButtonsInicio">
              <button className="registrate" type="submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
            <Link to="/registro" className="buttonInicioSection">
              <button className="buttonInicioSection">Registrarse</button>
            </Link>
            <button type="button" className="recuperar-password" disabled={loading}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;