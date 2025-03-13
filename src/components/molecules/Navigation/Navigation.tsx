import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import './Navigation.css';

interface NavigationProps {
  isAuthenticated: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isAuthenticated }) => {
  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <Link 
          key={item.to} 
          to={item.to} 
          className="nav-link"
        >
          <Button variant="secondary" className="nav-button">
            {item.label}
          </Button>
        </Link>
      ))}
      
      {!isAuthenticated && (
        <Link to="/inicio-section" className="nav-link">
          <Button variant="primary" className="nav-button">
            Iniciar Sesión
          </Button>
        </Link>
      )}
    </nav>
  );
};

export default Navigation; 