import React from 'react';
import Logo from '../../atoms/Logo/Logo';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <Logo width="150px" />
          {title && <h1 className="auth-title">{title}</h1>}
        </div>
        <div className="auth-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 