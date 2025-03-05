import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../style/Registro.css';

function Registro() {
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(JSON.stringify(formData));
  };

  return (
    <div className="ContenedorRgistro">
      <div className="inicio">
        <h1 className="login-title">Iniciar Sesión</h1>
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
            />
            <label htmlFor="Password">Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={togglePasswordVisibility}
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
          </div>

          <div className="Butons">
            <div className="ButtonsInicio">
              <button className="registrate" type="submit">
                Iniciar Sesión
              </button>
            </div>
            <Link to="/Registro" className="buttonInicioSection">
              Crear cuenta
            </Link>
            <button className="recuperar-password">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
