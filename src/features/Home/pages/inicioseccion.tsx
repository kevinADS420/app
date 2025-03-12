import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../style/Registro.css';
import axios from 'axios';

// Crear un evento personalizado para la actualización del usuario
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
    // Limpiar mensaje de error cuando el usuario empieza a escribir
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
    
    try {
      // Asegúrate de que el formato del email y contraseña sean correctos
      if (!formData.Email.trim()) {
        setError('El correo electrónico es requerido');
        return;
      }
      
      if (!formData.contraseña.trim()) {
        setError('La contraseña es requerida');
        return;
      }
      
      // Ajusta la URL a tu endpoint de autenticación
      const response = await axios.post('http://localhost:10101/login/customer', {
        Email: formData.Email.trim(),
        contraseña: formData.contraseña
      });
      
      console.log('Login response:', response.data);
      
      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      
      // Configurar el token para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Obtener datos del usuario usando el email actual
      try {
        const userResponse = await axios.get(`http://localhost:10101/customer/${formData.Email}`, {
          headers: {
            'Authorization': `Bearer ${response.data.token}`
          }
        });
        
        console.log('User data:', userResponse.data);
        
        // Guardar los datos del usuario en localStorage
        const userData = {
          id_cliente: userResponse.data.id_cliente,
          Nombres: userResponse.data.Nombres,
          Apellidos: userResponse.data.Apellidos,
          Email: userResponse.data.Email
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Disparar el evento de actualización de usuario
        window.dispatchEvent(userLoginEvent);
        
        // Mostrar mensaje de éxito
        setSuccess(true);
        
        // Redireccionar a la página principal después de 2 segundos
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (userError) {
        console.error('Error fetching user data:', userError);
        localStorage.removeItem('token');
        setError('Error al obtener datos del usuario');
        return;
      }
    } catch (err: any) {
      // Manejar errores de autenticación
      if (err.response) {
        if (err.response.status === 404) {
          setError('Usuario no encontrado');
        } else if (err.response.status === 401) {
          setError('Credenciales incorrectas');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Error en el servidor');
        }
      } else if (err.message.includes('Network Error')) {
        setError('No se pudo conectar al servidor. Verifica tu conexión');
      } else {
        setError('Error al iniciar sesión');
      }
      console.error('Error de inicio de sesión:', err);
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