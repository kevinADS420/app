import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import './Logo.css';

interface LogoProps {
  width?: string;
  height?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = '20vw', height = 'auto', className = '' }) => {
  return (
    <Link to="/" className="logo-link">
      <img 
        src={logo} 
        alt="HuertoMKT Logo" 
        className={`logo ${className}`}
        style={{ width, height }}
      />
    </Link>
  );
};

export default Logo; 