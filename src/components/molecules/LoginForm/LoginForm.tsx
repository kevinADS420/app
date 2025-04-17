import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import './LoginForm.css';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData.email, formData.password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1 className="login-title">Iniciar Sesión</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <Input
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        label="Correo electrónico"
        placeholder="Ingresa tu correo"
        required
        disabled={loading}
      />

      <div className="password-field">
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          value={formData.password}
          onChange={handleChange}
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          required
          disabled={loading}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <div className="form-actions">
        <Button
          type="submit"
          disabled={loading}
          className="login-button"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        <Link to="/registro" className="register-link">
          <Button variant="secondary">
            Crear cuenta
          </Button>
        </Link>

        <button type="button" className="forgot-password">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <div className="form-footer">
        <p>¿No tienes una cuenta?</p>
        <Link to="/registro" className="register-link">Regístrate aquí</Link>
      </div>
    </form>
  );
};

export default LoginForm; 