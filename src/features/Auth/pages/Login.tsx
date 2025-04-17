import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/Button/Button';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Redirigir al backend para iniciar el proceso de autenticación con Google
    window.location.href = 'https://backendhuertomkt.onrender.com/auth/google/login';
  };

  const handleLoginClick = () => {
    // Redirigir a la página de inicio de sesión existente
    navigate('/inicio-section');
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  };

  const loginContainerStyle: CSSProperties = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px'
  };

  const titleStyle: CSSProperties = {
    color: '#333',
    marginBottom: '2rem',
    fontSize: '1.8rem'
  };

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  return (
    <div style={containerStyle}>
      <div style={loginContainerStyle}>
        <h1 style={titleStyle}>Bienvenido a Huerto Market</h1>
        <div style={buttonContainerStyle}>
          <Button onClick={handleGoogleLogin} variant="primary">
            Iniciar sesión con Google
          </Button>
          <Button onClick={handleLoginClick} variant="secondary">
            Iniciar sesión con correo y contraseña
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login; 