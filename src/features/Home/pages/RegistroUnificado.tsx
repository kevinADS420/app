import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../assets/images/logo.png';
import Google from '../../../assets/icons/icons8-google-48.png';
import '../../../style/RegistroUnificado.css';

function RegistroUnificado() {
  const navigate = useNavigate();
  
  const [userType, setUserType] = useState('customer'); // Por defecto
  
  const [formData, setFormData] = useState({
    Nombres: '',
    Apellidos: '',
    Email: '',
    contraseña: '',
    confirmarContraseña: '',
    tipoServicio: '',
    telefono: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.Nombres.trim()) {
      errors.Nombres = 'El nombre es requerido';
    }
    if (!formData.Apellidos.trim()) {
      errors.Apellidos = 'Los apellidos son requeridos';
    }
    if (!formData.Email.trim()) {
      errors.Email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      errors.Email = 'El email no es válido';
    }
    if (!formData.contraseña) {
      errors.contraseña = 'La contraseña es requerida';
    } else if (formData.contraseña.length < 6) {
      errors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!formData.confirmarContraseña) {
      errors.confirmarContraseña = 'Debes confirmar tu contraseña';
    } else if (formData.contraseña !== formData.confirmarContraseña) {
      errors.confirmarContraseña = 'Las contraseñas no coinciden';
    }

    // Validaciones específicas para proveedores
    if (userType === 'proveedor') {
      if (!formData.tipoServicio.trim()) {
        errors.tipoServicio = 'El tipo de servicio es requerido';
      }
      if (!formData.telefono.trim()) {
        errors.telefono = 'El teléfono de contacto es requerido';
      } else if (!/^\d{7,15}$/.test(formData.telefono.trim())) {
        errors.telefono = 'Ingrese un número de teléfono válido (7-15 dígitos)';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    // Limpiar el mensaje de error del campo específico
    if (fieldErrors[id]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
    setErrorMessage('');
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setErrorMessage('Por favor, completa todos los campos correctamente');
      setLoading(false);
      return;
    }

    // Determinar el endpoint según el tipo de usuario
    let endpoint;
    let payload;

    if (userType === 'customer') {
      endpoint = '/customer/register';
      payload = {
        Nombres: formData.Nombres,
        Apellidos: formData.Apellidos,
        Email: formData.Email,
        contraseña: formData.contraseña
      };
    } else if (userType === 'proveedor') {
      endpoint = '/proveedor/register'; // Nota la 'P' mayúscula para coincidir con tu backend
      payload = {
        nombres: formData.Nombres, // Cambio de nombre de campo para proveedores
        apellidos: formData.Apellidos, // Cambio de nombre de campo para proveedores
        Email: formData.Email, // Cambio de nombre de campo para proveedores
        contraseña: formData.contraseña,
        tipoServicio: formData.tipoServicio,
        telefono: formData.telefono
      };
    }

    try {
      const response = await fetch(`https://backendhuertomkt.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(true);
        setErrorMessage('');
        // Mostrar mensaje de éxito
        setTimeout(() => {
          navigate('/inicio-section'); // Redirigir a la página de inicio de sesión
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.errorInfo || errorData.message || 'Error en el registro. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Aquí iría la lógica de autenticación con Google
      // Por ahora solo mostraremos un mensaje
      setErrorMessage('La autenticación con Google está en desarrollo');
    } catch (error) {
      console.error('Error en autenticación con Google:', error);
      setErrorMessage('Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="registro-unificado-container">
      <div className="registro-left-panel">
        <div className="google-content">
          <h2>Bienvenido a HuertoMKT</h2>
          <p>Regístrate de forma rápida y segura con tu cuenta de Google</p>
          <button className="google-button" onClick={handleGoogleSignIn}>
            <img src={Google} alt="Google" className="google-icon" />
            <span>Continuar con Google</span>
          </button>
          <div className="divider">
            <span>o</span>
          </div>
        </div>
      </div>

      <div className="registro-form-container">
        <img src={Logo} alt="Logo" className="registro-logo" />
        
        <div className="role-selector">
          <h3>Selecciona tu tipo de cuenta:</h3>
          <div className="role-options">
            <div className={`role-option ${userType === 'customer' ? 'active' : ''}`}>
              <input 
                type="radio" 
                id="customer" 
                name="userType" 
                value="customer" 
                checked={userType === 'customer'} 
                onChange={() => setUserType('customer')} 
              />
              <label htmlFor="customer">
                <span className="radio-custom"></span>
                Cliente
              </label>
            </div>
            <div className={`role-option ${userType === 'proveedor' ? 'active' : ''}`}>
              <input 
                type="radio" 
                id="proveedor" 
                name="userType" 
                value="proveedor" 
                checked={userType === 'proveedor'} 
                onChange={() => setUserType('proveedor')} 
              />
              <label htmlFor="proveedor">
                <span className="radio-custom"></span>
                Proveedor
              </label>
            </div>
          </div>
        </div>
        
        <form id="registroForm" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errorMessage}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              ¡Registro exitoso! Redireccionando al inicio de sesión...
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="Nombres">Nombres</label>
              <input 
                type="text" 
                id="Nombres" 
                value={formData.Nombres} 
                onChange={handleChange}
                className={fieldErrors.Nombres ? 'error-input' : ''}
                disabled={loading || success}
              />
              {fieldErrors.Nombres && <span className="field-error">{fieldErrors.Nombres}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="Apellidos">Apellidos</label>
              <input 
                type="text" 
                id="Apellidos" 
                value={formData.Apellidos} 
                onChange={handleChange}
                className={fieldErrors.Apellidos ? 'error-input' : ''}
                disabled={loading || success}
              />
              {fieldErrors.Apellidos && <span className="field-error">{fieldErrors.Apellidos}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="Email">Correo Electrónico</label>
            <input 
              type="email" 
              id="Email" 
              value={formData.Email} 
              onChange={handleChange}
              className={fieldErrors.Email ? 'error-input' : ''}
              disabled={loading || success}
            />
            {fieldErrors.Email && <span className="field-error">{fieldErrors.Email}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contraseña">Contraseña</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className={fieldErrors.contraseña ? 'error-input' : ''}
                  disabled={loading || success}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('password')}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={loading || success}
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
              {fieldErrors.contraseña && <span className="field-error">{fieldErrors.contraseña}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmarContraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                  className={fieldErrors.confirmarContraseña ? 'error-input' : ''}
                  disabled={loading || success}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirm')}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={loading || success}
                >
                  {showConfirmPassword ? (
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
              {fieldErrors.confirmarContraseña && (
                <span className="field-error">{fieldErrors.confirmarContraseña}</span>
              )}
            </div>
          </div>
          
          {/* Campos específicos según el rol seleccionado */}
          {userType === 'proveedor' && (
            <div className="proveedor-fields">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipoServicio">Tipo de Servicio</label>
                  <input
                    type="text"
                    id="tipoServicio"
                    value={formData.tipoServicio}
                    onChange={handleChange}
                    placeholder="Ej: Productor de frutas, Verduras, etc."
                    className={fieldErrors.tipoServicio ? 'error-input' : ''}
                    disabled={loading || success}
                  />
                  {fieldErrors.tipoServicio && <span className="field-error">{fieldErrors.tipoServicio}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono de Contacto</label>
                  <input
                    type="tel"
                    id="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Número de teléfono"
                    className={fieldErrors.telefono ? 'error-input' : ''}
                    disabled={loading || success}
                  />
                  {fieldErrors.telefono && <span className="field-error">{fieldErrors.telefono}</span>}
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className={`submit-button ${loading || success ? 'disabled' : ''}`}
              disabled={loading || success}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
            
            <div className="login-redirect">
              ¿Ya tienes una cuenta? 
              <Link to="/inicio-section"> Iniciar Sesión</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistroUnificado;