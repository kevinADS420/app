import React, { useEffect } from 'react';
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

  // Asegurar que cuando se abre el menú, el scroll se inicie desde arriba
  useEffect(() => {
    if (isOpen) {
      const menu = document.querySelector('.mobile-menu');
      if (menu) {
        menu.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Cerrar el menú con la tecla Escape
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

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
          
          {isAuthenticated && (
            <Link 
              to="/configuracion" 
              className="mobile-nav-link"
              onClick={onClose}
            >
              <Button 
                variant="primary" 
                className="mobile-nav-button"
              >
                Mi Perfil
              </Button>
            </Link>
          )}
        </nav>
      </div>
      {isOpen && (
        <div 
          className={`mobile-menu-overlay ${isOpen ? 'visible' : ''}`}
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileMenu;