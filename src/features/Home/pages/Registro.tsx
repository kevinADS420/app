import React, { useState } from 'react';
import Logo from '../../../assets/images/logo.png';
import Google from '../../../assets/icons/icons8-google-48.png';
import '../../../style/inicioSection.css';

function App() {
  const [formData, setFormData] = useState({
    Name: '',
    lastName: '',
    Email: '',
    Password: '',
    WithsignatureyourPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.Name.trim()) {
      errors.Name = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Los apellidos son requeridos';
    }
    if (!formData.Email.trim()) {
      errors.Email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      errors.Email = 'El email no es válido';
    }
    if (!formData.Password) {
      errors.Password = 'La contraseña es requerida';
    } else if (formData.Password.length < 6) {
      errors.Password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!formData.WithsignatureyourPassword) {
      errors.WithsignatureyourPassword = 'Debes confirmar tu contraseña';
    } else if (formData.Password !== formData.WithsignatureyourPassword) {
      errors.WithsignatureyourPassword = 'Las contraseñas no coinciden';
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

    if (!validateForm()) {
      setErrorMessage('Por favor, completa todos los campos correctamente');
      return;
    }

    const payload = {
      Nombres: formData.Name,
      Apellidos: formData.lastName,
      Email: formData.Email,
      contraseña: formData.Password,
    };
    
    try {
      const response = await fetch('https://backendhuertomkt.onrender.com/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error en el registro');
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
    <>
      <div className="ContainerContent">
        <div className="InicioGoogle">
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

        <div className="InicioFormulario">
          <img src={Logo} alt="Logo" />
          <form id="SaveUsers" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errorMessage}
              </div>
            )}
            <label htmlFor="Name">Nombres</label>
            <input 
              type="text" 
              id="Name" 
              value={formData.Name} 
              onChange={handleChange}
              className={fieldErrors.Name ? 'error-input' : ''}
            />
            {fieldErrors.Name && <span className="field-error">{fieldErrors.Name}</span>}
            
            <label htmlFor="lastName">Apellidos</label>
            <input 
              type="text" 
              id="lastName" 
              value={formData.lastName} 
              onChange={handleChange}
              className={fieldErrors.lastName ? 'error-input' : ''}
            />
            {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
            
            <label htmlFor="Email">Email</label>
            <input 
              type="email" 
              id="Email" 
              value={formData.Email} 
              onChange={handleChange}
              className={fieldErrors.Email ? 'error-input' : ''}
            />
            {fieldErrors.Email && <span className="field-error">{fieldErrors.Email}</span>}
            
            <label htmlFor="Password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                value={formData.Password}
                onChange={handleChange}
                className={fieldErrors.Password ? 'error-input' : ''}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('password')}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
            {fieldErrors.Password && <span className="field-error">{fieldErrors.Password}</span>}
            
            <label htmlFor="WithsignatureyourPassword">Con firma tu Contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="WithsignatureyourPassword"
                value={formData.WithsignatureyourPassword}
                onChange={handleChange}
                className={fieldErrors.WithsignatureyourPassword ? 'error-input' : ''}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
            {fieldErrors.WithsignatureyourPassword && (
              <span className="field-error">{fieldErrors.WithsignatureyourPassword}</span>
            )}

            <div className="ButtonsInicio">
              <button 
                type="submit"
                disabled={Object.keys(fieldErrors).length > 0}
                className={Object.keys(fieldErrors).length > 0 ? 'disabled-button' : ''}
              >
                Registrarte
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;