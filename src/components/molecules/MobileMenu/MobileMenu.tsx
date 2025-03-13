import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isAuthenticated }) => {
  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
  ];

  return (
    <>
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <Link 
              key={item.to} 
              to={item.to} 
              className="mobile-nav-link"
              onClick={onClose}
            >
              <Button 
                variant="secondary" 
                className="mobile-nav-button"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          
          {!isAuthenticated && (
            <Link 
              to="/inicio-section" 
              className="mobile-nav-link"
              onClick={onClose}
            >
              <Button 
                variant="primary" 
                className="mobile-nav-button"
              >
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </nav>
      </div>
      {isOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileMenu; 