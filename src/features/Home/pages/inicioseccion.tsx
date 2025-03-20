import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../style/Registro.css';
import axios from 'axios';

// Custom event for user login
const userLoginEvent = new Event('userLogin');

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
    
    // Intentamos iniciar sesión como cliente primero
    try {
      console.log('Intentando login como cliente...');
      const customerResponse = await axios.post('http://localhost:10101/login/customer', {
        Email: formData.Email.trim(),  // Cliente usa Email con mayúscula
        contraseña: formData.contraseña
      });
      
      console.log('Login exitoso como cliente:', customerResponse.data);
      
      // Guardar token en localStorage
      localStorage.setItem('token', customerResponse.data.token);
      localStorage.setItem('userType', 'customer');
      
      // Configurar token para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${customerResponse.data.token}`;
      
      // Verificar si la respuesta ya contiene datos del usuario
      if (customerResponse.data.userData) {
        // Si la respuesta de login ya incluye datos del usuario, los usamos directamente
        localStorage.setItem('user', JSON.stringify(customerResponse.data.userData));
      } else {
        // Si no, hacemos una solicitud adicional para obtener los datos
        try {
          const userResponse = await axios.get(`http://localhost:10101/customer/${formData.Email}`, {
            headers: {
              'Authorization': `Bearer ${customerResponse.data.token}`
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
        } catch (error) {
          console.error('Error al obtener datos del cliente:', error);
          // Continuar aunque no podamos obtener datos completos
        }
      }
      
      // Evento de login exitoso
      window.dispatchEvent(userLoginEvent);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return; // Salir de la función si el login como cliente fue exitoso
    } catch (customerError) {
      console.log('Login como cliente falló, intentando como proveedor...', customerError);
      
      // Si falló como cliente, intentamos como proveedor
      try {
        const proveedorResponse = await axios.post('http://localhost:10101/login/proveedor', {
          email: formData.Email.trim(),  // Proveedor usa email con minúscula
          contraseña: formData.contraseña
        });
        
        console.log('Login exitoso como proveedor:', proveedorResponse.data);
        
        // Guardar token en localStorage
        localStorage.setItem('token', proveedorResponse.data.token);
        localStorage.setItem('userType', 'proveedor');
        
        // Configurar token para futuras solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${proveedorResponse.data.token}`;
        
        // Verificar si la respuesta ya contiene datos del usuario
        if (proveedorResponse.data.userData) {
          // Si la respuesta de login ya incluye datos del usuario, los usamos directamente
          localStorage.setItem('user', JSON.stringify(proveedorResponse.data.userData));
        } else {
          // No intentamos obtener más datos del proveedor si no están incluidos en la respuesta de login
          // porque puede haber diferencias en las rutas de la API
          // Guardamos al menos el correo que tenemos
          localStorage.setItem('user', JSON.stringify({
            Email: formData.Email,
            // Otros datos que queramos guardar de la respuesta si existen
          }));
        }
        
        // Evento de login exitoso
        window.dispatchEvent(userLoginEvent);
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
        return; // Salir de la función si el login como proveedor fue exitoso
      } catch (proveedorError) {
        // Si ambos intentos fallaron, mostrar un error genérico
        console.error('Login como proveedor también falló:', proveedorError);
        setError('Credenciales incorrectas o usuario no encontrado');
        setLoading(false);
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
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="Email"
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
            <Link to="/Registro" className="buttonInicioSection">
              Crear cuenta
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